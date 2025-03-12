export type DronesInfo = {
  deviceId: string;
  uniqueId: string;
  lat: string;
  lon: string;
  temperature: string;
  status: string;
  timestamp: Date;
};

export interface DronePosition {
  deviceId: string;
  lat: number;
  lon: number;
}
