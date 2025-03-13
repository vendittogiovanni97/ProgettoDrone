export interface DroneData {
    deviceId: string;
    temperature: number;
    timestamp: number;
    status: string;
}

export interface DroneDataMap {
    id: string;
    lat: number;
    long: number;
    lastUpdate: number;
    isOnline: boolean;
}




export interface DronePosition {
    UniqueId: string;
    Lat: number;                                                    //Interfaccia per la Mappa
    Long: number;
    Mission: [];
}

export interface DroneMqtt
{
    id: string;
    status: string;
    temperature: number;
    latitude: number;
    longitude: number;
}

export interface MissionData {
    temperatureStats: {
        min: number;
        max: number;
    };
    temperatureData: number[];
    startTime: string;
    endTime: string;
}
export interface Position {
    lat: number;
    lon: number;
}

export interface MissionPositionData {
    startTime: string;
    endTime: string;
    positionData: Position[];
}



