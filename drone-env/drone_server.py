import os
import time
import argparse
import numpy as np
import pybullet as p
import pybullet_data

try:
    import gym
    from gym_pybullet_drones.envs.CtrlAviary import CtrlAviary
    from gym_pybullet_drones.envs.MultiHoverAviary import MultiHoverAviary
    from gym_pybullet_drones.control.DSLPIDControl import DSLPIDControl
    from gym_pybullet_drones.utils.utils import sync
    HAS_GYM_PYBULLET_DRONES = True
except ImportError as e:
    print(f"gym_pybullet_drones or gym import error: {e}")
    HAS_GYM_PYBULLET_DRONES = False

import io
import base64
from PIL import Image

def encode_image_to_base64(drone_id, width=120, height=90):
    pos, quat = p.getBasePositionAndOrientation(drone_id)
    rot_matrix = p.getMatrixFromQuaternion(quat)
    rot_matrix = np.array(rot_matrix).reshape(3, 3)
    
    camera_pos = pos + rot_matrix.dot(np.array([0.2, 0, 0]))
    target_pos = pos + rot_matrix.dot(np.array([5.0, 0, 0]))
    up_vector = rot_matrix.dot(np.array([0, 0, 1]))
    
    view_matrix = p.computeViewMatrix(camera_pos, target_pos, up_vector)
    proj_matrix = p.computeProjectionMatrixFOV(fov=60, aspect=float(width)/height, nearVal=0.1, farVal=100.0)
    
    # ER_BULLET_HARDWARE_OPENGL for efficiency, fallback to ER_TINY_RENDERER if needed
    _, _, rgbImg, _, _ = p.getCameraImage(width, height, view_matrix, proj_matrix, renderer=p.ER_BULLET_HARDWARE_OPENGL)
    rgb_array = np.reshape(rgbImg, (height, width, 4))
    rgb = rgb_array[:, :, :3]
    
    img = Image.fromarray(rgb.astype('uint8'), 'RGB')
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=70)
    return "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode('utf-8')

def add_buildings(num_buildings=25):
    import random
    buildings = []
    for _ in range(num_buildings):
        width = random.uniform(1.0, 4.0)
        length = random.uniform(1.0, 4.0)
        height = random.uniform(3.0, 10.0)
        
        # Don't place too close to drones
        x = random.uniform(-15, 15)
        if abs(x) < 3: x += 4 * (1 if x > 0 else -1)
        
        y = random.uniform(-15, 15)
        if abs(y) < 3: y += 4 * (1 if y > 0 else -1)
        
        colBoxId = p.createCollisionShape(p.GEOM_BOX, halfExtents=[width/2, length/2, height/2])
        visualShapeId = p.createVisualShape(p.GEOM_BOX, halfExtents=[width/2, length/2, height/2], rgbaColor=[random.uniform(0.3, 0.7), random.uniform(0.3, 0.7), random.uniform(0.3, 0.7), 1])
        building_id = p.createMultiBody(baseMass=0, baseCollisionShapeIndex=colBoxId, baseVisualShapeIndex=visualShapeId, basePosition=[x, y, height/2])
        buildings.append(building_id)
    return buildings

def run_multi_hover_aviary(num_drones=3, gui=True, simulation_steps_multiplier=20):
    """
    Runs a PyBullet simulation server using gym_pybullet_drones MultiHoverAviary.
    """
    print(f"[INFO] Starting MultiHoverAviary Simulation Server with {num_drones} drones...")
    
    # Initial positions: spaced out along the X axis
    INIT_XYZS = np.array([[i * 1.5, 0, 1] for i in range(num_drones)])
    INIT_RPYS = np.array([[0, 0, 0] for _ in range(num_drones)])

    # Initialize environment
    env = MultiHoverAviary(
        gui=gui,
        num_drones=num_drones,
        initial_xyzs=INIT_XYZS,
        initial_rpys=INIT_RPYS,
    )

    # Initialize controllers for hovering
    ctrl = [DSLPIDControl(drone_model=env.DRONE_MODEL) for i in range(num_drones)]
    
    # Run the simulation
    obs, info = env.reset()
    start_time = time.time()
    
    import requests
    import random
    from concurrent.futures import ThreadPoolExecutor
    
    executor = ThreadPoolExecutor(max_workers=5)
    org_id = "test_org"
    
    target_z = 1.0
    for i in range(simulation_steps_multiplier * env.SIM_FREQ):
        # Compute actions (PID control)
        actions = np.zeros((num_drones, 4))
        for j in range(num_drones):
            # Target position adds dynamic circular flight patterns at varying heights
            angle = i * 0.015 + (j * 2 * np.pi / num_drones)
            radius = 1.0 + (j * 0.5)
            height_offset = (j * 1.5) + 0.5 * np.sin(i * 0.03 + j)
            target_pos = INIT_XYZS[j] + np.array([radius * np.cos(angle), radius * np.sin(angle), height_offset])
            
            # The MultiHoverAviary state includes [pos, quat, rpy, vel, ang_vel, last_clipped_action]
            state_j = None
            if isinstance(obs, dict):
                state_j = obs[str(j)]["state"]
            elif isinstance(obs, tuple) and isinstance(obs[0], dict):
                # Gym v26 / Gymnasium handling
                state_j = obs[0][str(j)]["state"] 
            elif isinstance(obs, np.ndarray):
                state_j = obs[j, :]
            else:
                state_j = obs[j]
                
            # Add dynamic banking and pitching to the target orientation
            target_rpy = np.array([
                0.25 * np.cos(i * 0.03 + j), # Roll
                0.15 * np.sin(i * 0.03 + j), # Pitch
                angle + np.pi/2 # Yaw
            ])
                
            action, _, _ = ctrl[j].computeControlFromState(
                control_timestep=env.CTRL_TIMESTEP,
                state=state_j,
                target_pos=target_pos,
                target_rpy=target_rpy
            )
            actions[j, :] = action
            
        # Step the environment
        step_returns = env.step(actions)
        if len(step_returns) == 4:
            obs, reward, done, info = step_returns
        else:
            obs, reward, terminated, truncated, info = step_returns

        env.render()
        sync(i, start_time, env.CTRL_TIMESTEP)
        
        # Send telemetry (~10 Hz for 240Hz simulation => every 24 steps)
        # Note: If env.SIM_FREQ is different, adjust this ratio
        if i % max(1, int(env.SIM_FREQ / 10)) == 0:
            for j in range(num_drones):
                state_j = None
                if isinstance(obs, dict):
                    state_j = obs[str(j)]["state"]
                elif isinstance(obs, tuple) and isinstance(obs[0], dict):
                    state_j = obs[0][str(j)]["state"]
                elif isinstance(obs, np.ndarray):
                    state_j = obs[j, :]
                else:
                    state_j = obs[j]
                
                # state includes: [pos(3), quat(4), rpy(3), vel(3), ang_vel(3), last_clipped_action(4)]
                pos = state_j[0:3]
                rpy = state_j[7:10]
                vel = state_j[10:13]
                
                payload = {
                    "drone_id": f"AG-ALPHA-0{j+1}",
                    "organization_id": org_id,
                    "attitude_pitch": float(rpy[1]),
                    "attitude_roll": float(rpy[0]),
                    "attitude_yaw": float(rpy[2]),
                    "velocity_x": float(vel[0]),
                    "velocity_y": float(vel[1]),
                    "velocity_z": float(vel[2]),
                    "battery_level": max(0, 100 - int((i / (simulation_steps_multiplier * env.SIM_FREQ)) * 100)),
                    "altitude": float(pos[2]),
                    "gps_lat": 37.7749 + (float(pos[0]) * 0.0001),
                    "gps_lon": -122.4194 + (float(pos[1]) * 0.0001),
                    "rl_agent_stability_score": 0.95 + random.uniform(-0.05, 0.05),
                    "weather_wind_speed_disturbance": 2.5 + random.uniform(-0.5, 0.5)
                }
                
                # Render camera feed at 3 Hz to save CPU
                if i % max(1, int(env.SIM_FREQ / 3)) == 0:
                    payload["camera_feed"] = encode_image_to_base64(env.DRONE_IDS[j]) if hasattr(env, 'DRONE_IDS') else ""
                
                executor.submit(requests.post, "http://localhost:8080/api/telemetry", json=payload, timeout=0.1)

    env.close()
    print("[INFO] Simulation Server Finished.")

def run_ppo_hover_aviary(gui=True, simulation_steps_multiplier=200):
    """
    Trains a stable_baselines3 PPO model and runs it in the GUI, sending telemetry.
    """
    try:
        from stable_baselines3 import PPO
        from stable_baselines3.common.env_util import make_vec_env
        from gym_pybullet_drones.envs.HoverAviary import HoverAviary
    except ImportError as e:
        print(f"[ERROR] Required PPO libraries missing: {e}")
        return

    print("[INFO] Starting PPO Training Phase...")
    
    # Setup vectorized environment for training
    train_env = make_vec_env(HoverAviary, n_envs=1)
    
    model_path = "ppo_hover_aviary_model"
    if os.path.exists(model_path + ".zip"):
        print("[INFO] Loading existing PPO model...")
        model = PPO.load(model_path, env=train_env)
    else:
        print("[INFO] Training new PPO model (this may take a few seconds)...")
        model = PPO("MlpPolicy", train_env, verbose=1)
        # Train for a moderate amount of steps to learn basic stability
        model.learn(total_timesteps=15000)
        model.save(model_path)
        print("[INFO] PPO model saved!")
    
    print("[INFO] Starting PPO Simulation Phase...")
    
    env = HoverAviary(gui=gui, record=False)
    
    step_returns = env.reset()
    if isinstance(step_returns, tuple) and len(step_returns) == 2:
        obs, info = step_returns
    else:
        obs = step_returns
        
    start_time = time.time()
    
    from concurrent.futures import ThreadPoolExecutor
    executor = ThreadPoolExecutor(max_workers=5)
    
    import requests
    import random
    org_id = "org-001"
    
    for i in range(simulation_steps_multiplier * env.SIM_FREQ):
        action, _states = model.predict(obs, deterministic=True)
        
        step_returns = env.step(action)
        if len(step_returns) == 4:
            obs, reward, terminated, info = step_returns
            done = terminated
        else:
            obs, reward, terminated, truncated, info = step_returns
            done = terminated or truncated

        env.render()
        sync(i, start_time, env.CTRL_TIMESTEP)
        
        # Log Live Telemetry
        if i % max(1, int(env.SIM_FREQ / 10)) == 0:
            # For BaseAviary, arrays are pos, rpy, vel. We access the first drone [0].
            pos = env.pos[0]
            rpy = env.rpy[0]
            vel = env.vel[0]

            payload = {
                "drone_id": "AG-ALPHA-01",
                "organization_id": org_id,
                "attitude_pitch": float(rpy[1]),
                "attitude_roll": float(rpy[0]),
                "attitude_yaw": float(rpy[2]),
                "velocity_x": float(vel[0]),
                "velocity_y": float(vel[1]),
                "velocity_z": float(vel[2]),
                "battery_level": max(0, 100 - int((i / (simulation_steps_multiplier * env.SIM_FREQ)) * 100)),
                "altitude": float(pos[2]),
                "gps_lat": 37.7749 + (float(pos[0]) * 0.0001),
                "gps_lon": -122.4194 + (float(pos[1]) * 0.0001),
                "rl_agent_stability_score": 0.95 + random.uniform(-0.05, 0.05),
                "weather_wind_speed_disturbance": 2.5 + random.uniform(-0.5, 0.5)
            }
            executor.submit(requests.post, "http://localhost:8080/api/telemetry", json=payload, timeout=0.1)
                
        if done:
            step_returns = env.reset()
            if isinstance(step_returns, tuple) and len(step_returns) == 2:
                obs, info = step_returns
            else:
                obs = step_returns
            
    env.close()
    print("[INFO] PPO Simulation Server Finished.")

def run_basic_pybullet_server(num_drones=3, gui=True):
    """
    Fallback method: runs a basic PyBullet simulation if gym-pybullet-drones is not installed.
    """
    print(f"[INFO] gym_pybullet_drones not found or failed to load. Running basic PyBullet server with {num_drones} drones...")
    physicsClient = p.connect(p.GUI if gui else p.DIRECT)
    p.setGravity(0, 0, -9.81)
    p.setAdditionalSearchPath(pybullet_data.getDataPath())
    
    # Load ground plane and buildings
    p.loadURDF("plane.urdf")
    add_buildings(30)
    
    drones = []
    for i in range(num_drones):
        start_pos = [i * 1.5, 0, 1]
        start_ori = p.getQuaternionFromEuler([0, 0, 0])
        try:
            drone_id = p.loadURDF("simple_drone.urdf", start_pos, start_ori)
        except p.error:
            try:
                # Try some common pybullet drone-like URDFs if simple_drone is missing
                drone_id = p.loadURDF("quadrotor.urdf", start_pos, start_ori)
            except p.error:
                try:
                    drone_id = p.loadURDF("cf2x.urdf", start_pos, start_ori)
                except p.error:
                    # Fallback to sphere
                    drone_id = p.loadURDF("sphere2.urdf", start_pos, start_ori)
        drones.append(drone_id)
        
    import requests
    import random
    from concurrent.futures import ThreadPoolExecutor
    
    executor = ThreadPoolExecutor(max_workers=5)

    # Add organization_id parameter, defaulting to a known one if necessary or just a mocked one.
    org_id = "test_org"
    
    for step in range(240 * 60): # 60 seconds simulation
        p.stepSimulation()
        time.sleep(1./240.)
        
        # Make the drones move in circles
        for i, drone_id in enumerate(drones):
            angle = step * 0.02 + (i * 2 * np.pi / num_drones)
            radius = 1.5 + (i * 0.5) # Different radius per drone
            height = 1.5 + (i * 1.5) + 0.3 * np.sin(step * 0.05 + i) # Fly at different heights
            # Calculate position
            pos = [radius * np.cos(angle), radius * np.sin(angle), height]
            # Calculate orientation (facing forward, banked into the turn)
            roll = 0.25 * np.cos(step * 0.05 + i)
            pitch = 0.15 * np.sin(step * 0.05 + i)
            quat = p.getQuaternionFromEuler([roll, pitch, angle + np.pi/2])
            
            # Forcing them to fly programmatically for basic simulation validation:
            p.resetBasePositionAndOrientation(drone_id, pos, quat)
            
            # Calculate and apply manual velocities (since reseting position zeroes velocity out)
            d_angle = 0.02 * 240
            vel_x = -radius * np.sin(angle) * d_angle
            vel_y = radius * np.cos(angle) * d_angle
            vel_z = 0.3 * np.cos(step * 0.05 + i) * 0.05 * 240
            p.resetBaseVelocity(drone_id, linearVelocity=[vel_x, vel_y, vel_z])
            
        # Send telemetry every 24 steps (~10 Hz)
        if step % 24 == 0:
            for i, drone_id in enumerate(drones):
                pos, quat = p.getBasePositionAndOrientation(drone_id)
                rpy = p.getEulerFromQuaternion(quat)
                vel, ang_vel = p.getBaseVelocity(drone_id)
                
                payload = {
                    "drone_id": f"AG-ALPHA-0{i+1}",
                    "organization_id": org_id,
                    "attitude_pitch": float(rpy[1]),
                    "attitude_roll": float(rpy[0]),
                    "attitude_yaw": float(rpy[2]),
                    "velocity_x": float(vel[0]),
                    "velocity_y": float(vel[1]),
                    "velocity_z": float(vel[2]),
                    "battery_level": max(0, 100 - int(step / (240 * 60) * 100)), # Mock battery drain
                    "altitude": float(pos[2]),
                    "gps_lat": 37.7749 + (float(pos[0]) * 0.0001), # Mock GPS from local position
                    "gps_lon": -122.4194 + (float(pos[1]) * 0.0001),
                    "rl_agent_stability_score": 0.95 + random.uniform(-0.05, 0.05),
                    "weather_wind_speed_disturbance": 2.5 + random.uniform(-0.5, 0.5)
                }
                
                # Render camera feed at 3 Hz to save CPU
                if step % int(240 / 3) == 0:
                    payload["camera_feed"] = encode_image_to_base64(drone_id)
                
                # Fire and forget async request to avoid blocking simulation loop
                executor.submit(requests.post, "http://localhost:8080/api/telemetry", json=payload, timeout=0.1)
        
    p.disconnect()
    print("[INFO] Basic PyBullet Simulation Server Finished.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='PyBullet Drone Env Server')
    parser.add_argument('--num_drones', type=int, default=3, help='Number of drones to simulate')
    parser.add_argument('--headless', action='store_true', help='Run headless without GUI')
    parser.add_argument('--ppo', action='store_true', help='Use PPO Learning format')
    args = parser.parse_args()
    
    if HAS_GYM_PYBULLET_DRONES:
        if args.ppo:
            run_ppo_hover_aviary(gui=not args.headless, simulation_steps_multiplier=200)
        else:
            try:
                run_multi_hover_aviary(num_drones=args.num_drones, gui=not args.headless)
            except Exception as e:
                print(f"[ERROR] MultiHoverAviary failed with exception: {e}")
                run_basic_pybullet_server(num_drones=args.num_drones, gui=not args.headless)
    else:
        run_basic_pybullet_server(num_drones=args.num_drones, gui=not args.headless)
