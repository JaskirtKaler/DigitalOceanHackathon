--------------------------------------------------
-- 1. B2B Multi-tenancy Core
--------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY, -- Will be the 'org_...' ID from Clerk
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- 2. User & Role Management (Sync with Clerk)
--------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Will be the 'user_...' ID from Clerk
    email TEXT NOT NULL UNIQUE,
    organization_id TEXT REFERENCES organizations(id),
    
    -- Roles can be 'admin' or 'pilot'
    -- We can use standard 'org:admin'/'org:member' Clerk roles here
    base_role TEXT DEFAULT 'pilot', 
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- 3. The Assets (Simulated or Real Drones)
--------------------------------------------------
CREATE TABLE IF NOT EXISTS drones (
    id TEXT PRIMARY KEY, -- Unique ID (e.g., 'AG-ALPHA-01')
    organization_id TEXT REFERENCES organizations(id),
    nickname TEXT,
    
    -- RL Agent Details
    agent_model_version TEXT DEFAULT 'commander-aero-v1',
    is_simulated BOOLEAN DEFAULT true, -- Tracks if it's running in gym-pybullet

    created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------
-- 4. High-Volume Telemetry (Black Box)
-- This data must be stored for BOTH live HUD 
-- and future RL training data.
--------------------------------------------------
CREATE TABLE IF NOT EXISTS telemetry_logs (
    id BIGSERIAL PRIMARY KEY, -- Big serial for high-volume logs
    drone_id TEXT REFERENCES drones(id),
    mission_id UUID, -- Links multiple data points to one flight session
    
    logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Attitude/Orientation (Pitch, Roll, Yaw) - Crucial for RL balance
    attitude_pitch FLOAT, -- Up/Down tilt (radians)
    attitude_roll  FLOAT, -- Left/Right tilt (radians)
    attitude_yaw   FLOAT, -- Heading (radians)
    
    -- Velocity (Simulation data)
    velocity_x FLOAT, -- Meters per second
    velocity_y FLOAT,
    velocity_z FLOAT,
    
    -- HUD/Live Data (matching user provided image sample)
    battery_level INTEGER, -- 0-100 percentage
    altitude FLOAT, -- Meters above 'home'
    gps_lat FLOAT, -- Simulated or Real GPS
    gps_lon FLOAT,
    
    -- RL Model Insights (How stable does the agent think it is?)
    rl_agent_stability_score FLOAT DEFAULT 1.0, -- Normalized score
    weather_wind_speed_disturbance FLOAT -- Current wind disturbance (P0API)
);

--------------------------------------------------
-- 5. Add Indexes for Performance
--------------------------------------------------
-- Critical for B2B isolation in Go queries
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_drones_org ON drones(organization_id);

-- Critical for live telemetry dashboard queries (fetch last 100 rows)
CREATE INDEX IF NOT EXISTS idx_telemetry_time ON telemetry_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_drone_time ON telemetry_logs(drone_id, logged_at DESC);
