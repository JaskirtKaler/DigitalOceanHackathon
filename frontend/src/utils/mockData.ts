
export interface Drone {
    id: string;
    model: string;
    status: 'Active' | 'Hovering' | 'Returning' | 'Signal Weak';
    speed: number;
    altitude: number;
    signalStrength: 'Strong' | 'Good' | 'Weak';
    batteryLevel: number;
    mode: 'Autonomous' | 'Manual Override' | 'Hold';
    eta?: string;
}

export const fleetStatusData: Drone[] = [];

export const statistics = {
    totalActive: {
        value: 0,
        change: '0%',
        trend: 'stable'
    },
    avgBattery: {
        value: 'N/A',
        change: '0%',
        trend: 'stable'
    },
    missionsToday: {
        value: 0,
        change: '0%',
        trend: 'stable'
    },
    safetyAlerts: {
        value: 0,
        status: 'N/A'
    }
};

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'warning' | 'success';
}

export const mockNotifications: Notification[] = [];

export interface CrewMember {
    id: string;
    name: string;
    role: string;
    status: 'online' | 'offline' | 'away';
    avatar?: string;
}

export const flightCrew: CrewMember[] = [
    {
        id: '1',
        name: 'Jaskirt Kaler',
        role: 'Admin • Online',
        status: 'online',
    },
    {
        id: '2',
        name: 'Pilot One',
        role: 'Pilot • Online',
        status: 'online',
    },
    {
        id: '3',
        name: 'Pilot Two',
        role: 'Pilot • Offline',
        status: 'offline',
    }
];

export interface AuditData {
    status: 'Certified' | 'Pending' | 'Failed';
    compliance: boolean;
    windSpeed: number;
    visibility: number;
    precipitation: string;
    sources: {
        faa: boolean;
        orgProtocol: boolean;
    };
}

export const auditData: AuditData = {
    status: 'Pending',
    compliance: false,
    windSpeed: 0,
    visibility: 0,
    precipitation: 'N/A',
    sources: {
        faa: false,
        orgProtocol: false
    }
};

export interface AnalyticsMetrics {
    efficiency: {
        value: string;
        trend: 'up' | 'down' | 'stable';
        change: string;
    };
    incidentRate: {
        value: string;
        trend: 'up' | 'down' | 'stable';
        change: string;
    };
    flightHours: number;
    missionSuccessRate: number;
}

export const analyticsData: AnalyticsMetrics = {
    efficiency: {
        value: 'N/A',
        trend: 'stable',
        change: '0%'
    },
    incidentRate: {
        value: 'N/A',
        trend: 'stable',
        change: '0%'
    },
    flightHours: 0,
    missionSuccessRate: 0
};

export interface SafetyLog {
    id: string;
    date: string;
    time: string;
    pilot: string;
    droneId: string;
    level: 'LOW' | 'MED' | 'HIGH';
    description: string;
    verified: boolean;
}

export const safetyLogsData: SafetyLog[] = [];

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    avatarColor: string;
    avatarUrl?: string;
    status: 'Active' | 'Pending' | 'Inactive';
    isAdmin: boolean;
    isPilot: boolean;
}

export const teamMembersData: TeamMember[] = [
    {
        id: 'tm-1',
        name: 'Jaskirt Kaler',
        email: 'jaskirt@skyhigh.com',
        avatarColor: '#E8B86D',
        status: 'Active',
        isAdmin: true,
        isPilot: true
    },
    {
        id: 'tm-2',
        name: 'Pilot One',
        email: 'pilot1@skyhigh.com',
        avatarColor: '#D4E85E',
        status: 'Active',
        isAdmin: false,
        isPilot: true
    },
    {
        id: 'tm-3',
        name: 'Pilot Two',
        email: 'pilot2@skyhigh.com',
        avatarColor: '#D47A4A',
        status: 'Active',
        isAdmin: false,
        isPilot: true
    }
];

export const organizationSettings = {
    name: 'SkyHigh Logistics',
    displayId: 'skyhigh'
};
