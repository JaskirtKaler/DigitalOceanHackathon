
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

export const fleetStatusData: Drone[] = [
    {
        id: 'AG-402',
        model: 'X92',
        status: 'Active',
        speed: 42,
        altitude: 120,
        signalStrength: 'Strong',
        batteryLevel: 72,
        mode: 'Autonomous',
        eta: '12m'
    },
    {
        id: 'AG-305',
        model: 'B14',
        status: 'Hovering',
        speed: 0,
        altitude: 45,
        signalStrength: 'Good',
        batteryLevel: 64,
        mode: 'Manual Override',
        eta: 'Hold'
    },
    {
        id: 'AG-118',
        model: 'R02',
        status: 'Returning',
        speed: 55,
        altitude: 90,
        signalStrength: 'Strong',
        batteryLevel: 22,
        mode: 'Autonomous',
        eta: '4m'
    },
    {
        id: 'AG-772',
        model: 'Z55',
        status: 'Active',
        speed: 38,
        altitude: 150,
        signalStrength: 'Strong',
        batteryLevel: 91,
        mode: 'Autonomous',
        eta: '24m'
    },
    {
        id: 'AG-210',
        model: 'C09',
        status: 'Signal Weak',
        speed: 22,
        altitude: 60,
        signalStrength: 'Weak',
        batteryLevel: 45,
        mode: 'Autonomous',
        eta: '15m'
    },
    {
        id: 'AG-901',
        model: 'F88',
        status: 'Active',
        speed: 65,
        altitude: 210,
        signalStrength: 'Strong',
        batteryLevel: 88,
        mode: 'Autonomous',
        eta: '30m'
    }
];

export const statistics = {
    totalActive: {
        value: 12,
        change: '+2%',
        trend: 'up'
    },
    avgBattery: {
        value: '84%',
        change: '+5%',
        trend: 'up'
    },
    missionsToday: {
        value: 28,
        change: '+12%',
        trend: 'up'
    },
    safetyAlerts: {
        value: 0,
        status: 'Normal'
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

export const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'System Update',
        message: 'Commander Aero v2.4 live. New autonomous flight parameters enabled.',
        time: '2m ago',
        read: false,
        type: 'info'
    },
    {
        id: '2',
        title: 'Low Battery Warning',
        message: 'AG-210 below 15% threshold. Returning to base automatically.',
        time: '14m ago',
        read: false,
        type: 'warning'
    },
    {
        id: '3',
        title: 'Audit Complete',
        message: 'Daily regulatory compliance check passed for Zone B operations.',
        time: '1h ago',
        read: true,
        type: 'success'
    }
];

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
        name: 'Marcus Reed',
        role: 'Lead Pilot • Active',
        status: 'online',
    },
    {
        id: '2',
        name: 'Sarah Jenkins',
        role: 'Monitoring AG-305',
        status: 'online',
    },
    {
        id: '3',
        name: 'David Chen',
        role: 'Away • 5m',
        status: 'away',
    },
    {
        id: '4',
        name: 'Elena Rodriguez',
        role: 'Offline',
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
    status: 'Certified',
    compliance: true,
    windSpeed: 12,
    visibility: 14,
    precipitation: 'None',
    sources: {
        faa: true,
        orgProtocol: true
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
        value: '88.5%',
        trend: 'up',
        change: '+4.5%'
    },
    incidentRate: {
        value: '0.03%',
        trend: 'down', // Good thing
        change: '-0.01%'
    },
    flightHours: 12450,
    missionSuccessRate: 94.2
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

export const safetyLogsData: SafetyLog[] = [
    {
        id: 'L-101',
        date: 'Oct 24, 2024',
        time: '09:42 AM',
        pilot: 'Marcus Reed',
        droneId: 'AG-402',
        level: 'LOW',
        description: 'Routine pre-flight check complete. No anomalies detected.',
        verified: true
    },
    {
        id: 'L-102',
        date: 'Oct 24, 2024',
        time: '08:15 AM',
        pilot: 'Sarah Jenkins',
        droneId: 'AG-305',
        level: 'MED',
        description: 'Battery temp slightly elevated during charging. Monitoring.',
        verified: true
    },
    {
        id: 'L-103',
        date: 'Oct 23, 2024',
        time: '16:30 PM',
        pilot: 'David Chen',
        droneId: 'AG-118',
        level: 'LOW',
        description: 'Post-mission diagnostic. All systems nominal.',
        verified: true
    },
    {
        id: 'L-104',
        date: 'Oct 23, 2024',
        time: '14:12 PM',
        pilot: 'Marcus Reed',
        droneId: 'AG-772',
        level: 'HIGH',
        description: 'Unexpected wind shear reports in Sector 7. Re-routing engaged.',
        verified: true
    },
    {
        id: 'L-105',
        date: 'Oct 23, 2024',
        time: '11:05 AM',
        pilot: 'Sarah Jenkins',
        droneId: 'AG-210',
        level: 'LOW',
        description: 'Firmware capability verified for v2.4 roll-out.',
        verified: true
    }
];
