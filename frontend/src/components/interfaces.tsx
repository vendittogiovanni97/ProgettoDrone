export interface DroneData {
    DeviceId: string;
    UniqueId: string;
    status: "Online" | "Offline";                                   //Interfaccia per La Tabella
    lastData: string;
}

export interface DronePosition {
    UniqueId: string;
    Lat: number;                                                    //Interfaccia per la Mappa
    Long: number;
    Mission: [];
}
