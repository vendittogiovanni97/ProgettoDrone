import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
//import mqtt from "mqtt";
import "leaflet/dist/leaflet.css";
import "../css/map.css";
import { backendFetch } from "../services/api";
import {DroneDataMap} from "./interfaces.tsx";

// Icone per lo stato del drone
const droneOnlineIcon = new L.Icon({
    iconUrl: "/images/camera-drone.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});
const droneOfflineIcon = new L.Icon({
    iconUrl: "/images/drone.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const MapPositionComponent = () => {
    const [dronePositions, setDronePositions] = useState<DroneDataMap[]>([]); // Array, non oggetto!
    const markersRef = useRef<{ [key: string]: L.Marker | null }>({}); // Riferimento ai marker

    useEffect(() => {
        const fetchDronePositions = async () => {
            try {
                // Richiesta API
                const { responseBody } = await backendFetch("/mqtt/allDrones");

                if (!responseBody.details || !responseBody.details.drones) {
                    throw new Error("Struttura dati non valida");
                }

                // Estrarre i dati necessari
                const drones = responseBody.details.drones.map(
                    (drone: {
                        deviceId: string;
                        lat: number;
                        lon: number;
                        status: string;
                        lastUpdated: string;
                    }) => ({
                        id: drone.deviceId,
                        lat: drone.lat,
                        long: drone.lon,
                        lastUpdate: new Date(drone.lastUpdated).getTime(), // Convertire timestamp in ms
                        isOnline: drone.status === "ONLINE",
                    })
                );

                setDronePositions(drones);
            } catch (error) {
                console.error("Errore nel recupero delle posizioni dei droni:", error);
            }
        };

        fetchDronePositions();
    }, []);

    // Controllo stato online/offline basato sul tempo di aggiornamento
    useEffect(() => {
        const interval = setInterval(() => {
            setDronePositions((prevPositions) =>
                prevPositions.map((drone) => ({
                    ...drone,
                    isOnline: Date.now() - drone.lastUpdate <= 20000, // 20 sec per offline
                }))
            );
        }, 20000);

        return () => clearInterval(interval);
    }, []);

    // Aggiornamento icone in base allo stato online/offline
    useEffect(() => {
        dronePositions.forEach((drone) => {
            const marker = markersRef.current[drone.id];
            if (marker) {
                marker.setIcon(drone.isOnline ? droneOnlineIcon : droneOfflineIcon);
            }
        });
    }, [dronePositions]);

    return (
        <div className="leaflet-container">
            <MapContainer center={[41.9028, 12.4964]} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {dronePositions.map((drone) => (
                    <Marker
                        key={drone.id}
                        position={[drone.lat, drone.long]}
                        icon={drone.isOnline ? droneOnlineIcon : droneOfflineIcon}
                        ref={(marker) => {
                            if (marker) {
                                markersRef.current[drone.id] = marker;
                            }
                        }}
                    >
                        <Popup>
                            <div>
                                <strong>ID Drone:</strong> {drone.id}
                                <br />
                                <strong>Latitudine:</strong> {drone.lat}°
                                <br />
                                <strong>Longitudine:</strong> {drone.long}°
                                <br />
                                <strong>Stato:</strong> {drone.isOnline ? "🟢 Online" : "🔴 Offline"}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPositionComponent;
