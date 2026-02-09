
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
