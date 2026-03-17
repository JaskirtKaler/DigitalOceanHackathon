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
    
    target_z = 1.0
    for i in range(simulation_steps_multiplier * env.SIM_FREQ):
        # Compute actions (PID control)
        actions = np.zeros((num_drones, 4))
        for j in range(num_drones):
            # Target position adds a small sinusoidal hover effect
            target_pos = INIT_XYZS[j] + np.array([0, 0, 0.5 * np.sin(i / 100.0)])
            
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
                
            action, _, _ = ctrl[j].computeControlFromState(
                control_timestep=env.CTRL_TIMESTEP,
                state=state_j,
                target_pos=target_pos,
                target_rpy=INIT_RPYS[j]
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

    env.close()
    print("[INFO] Simulation Server Finished.")

def run_basic_pybullet_server(num_drones=3, gui=True):
    """
    Fallback method: runs a basic PyBullet simulation if gym-pybullet-drones is not installed.
    """
    print(f"[INFO] gym_pybullet_drones not found or failed to load. Running basic PyBullet server with {num_drones} drones...")
    physicsClient = p.connect(p.GUI if gui else p.DIRECT)
    p.setGravity(0, 0, -9.81)
    p.setAdditionalSearchPath(pybullet_data.getDataPath())
    
    # Load ground plane
    p.loadURDF("plane.urdf")
    
    drones = []
    for i in range(num_drones):
        start_pos = [i * 1.5, 0, 1]
        start_ori = p.getQuaternionFromEuler([0, 0, 0])
        try:
            # Try some common pybullet drone-like URDFs
            drone_id = p.loadURDF("quadrotor.urdf", start_pos, start_ori)
        except p.error:
            try:
                drone_id = p.loadURDF("cf2x.urdf", start_pos, start_ori)
            except p.error:
                # Fallback to sphere
                drone_id = p.loadURDF("sphere2.urdf", start_pos, start_ori)
        drones.append(drone_id)
        
    for _ in range(240 * 20): # 20 seconds simulation
        p.stepSimulation()
        time.sleep(1./240.)
        
    p.disconnect()
    print("[INFO] Basic PyBullet Simulation Server Finished.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='PyBullet Drone Env Server')
    parser.add_argument('--num_drones', type=int, default=3, help='Number of drones to simulate')
    parser.add_argument('--headless', action='store_true', help='Run headless without GUI')
    args = parser.parse_args()
    
    if HAS_GYM_PYBULLET_DRONES:
        try:
            run_multi_hover_aviary(num_drones=args.num_drones, gui=not args.headless)
        except Exception as e:
            print(f"[ERROR] MultiHoverAviary failed with exception: {e}")
            run_basic_pybullet_server(num_drones=args.num_drones, gui=not args.headless)
    else:
        run_basic_pybullet_server(num_drones=args.num_drones, gui=not args.headless)
