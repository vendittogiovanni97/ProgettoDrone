export interface DroneData {
    DeviceId: string;
    temperature: string;
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
