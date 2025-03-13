import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useParams } from "react-router-dom";
import { backendFetch } from "../services/api";
import {MissionPositionData} from "./interfaces.tsx";
import {Position} from "./interfaces.tsx";


const MapHistoryComponent: React.FC = () => {
    const { uniqueId } = useParams<{ uniqueId: string }>();
    const [missionData, setMissionData] = useState<MissionPositionData | null>(null);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                const { responseBody } = await backendFetch("/mqtt/allDrones");

                if (!responseBody.details || !responseBody.details.drones) {
                    throw new Error("Struttura dati non valida");
                }

                const selectedDrone = responseBody.details.drones.find(
                    (drone: { deviceId: string; uniqueId: string }) => drone.deviceId === uniqueId
                );

                if (!selectedDrone) {
                    throw new Error("Drone non trovato");
                }

                const historicalResponse = await backendFetch(`/mqtt/track/${selectedDrone.uniqueId}`);
                const data = historicalResponse.responseBody;

                if (!data.positionData) {
                    throw new Error("Struttura dati non valida");
                }

                const parsedData: MissionPositionData = {
                    startTime: data.startTime,
                    endTime: data.endTime,
                    positionData: data.positionData.map((pos: { lat: string; lon: string }) => ({
                        lat: parseFloat(pos.lat),
                        lon: parseFloat(pos.lon)
                    }))
                };

                setMissionData(parsedData);
            } catch (error) {
                console.error("Errore nel recupero dei dati storici:", error);
            }
        };

        if (uniqueId) {
            fetchHistoricalData();
        }
    }, [uniqueId]);

    if (!missionData) {
        return <p>Caricamento dati...</p>;
    }

    const { startTime, endTime, positionData } = missionData;

    if (!positionData || positionData.length === 0) {
        return <p>Nessuna posizione disponibile per questa missione.</p>;
    }

    // Convertiamo i dati per Leaflet
    const polylinePositions: [number, number][] = positionData.map((pos: Position) => [pos.lat, pos.lon]);

    // Icona per l'ultima posizione del drone
    const droneIcon = new L.Icon({
        iconUrl: "/images/droneStoric.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });

    return (
        <div>
            <h3>Missione dal {new Date(startTime).toLocaleString()} al {new Date(endTime).toLocaleString()}</h3>
            <MapContainer center={polylinePositions[0]} zoom={13} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Linea del percorso */}
                <Polyline positions={polylinePositions} color="blue" weight={4} />

                {/* Marker per la prima posizione */}
                <Marker position={polylinePositions[0]}>
                    <Popup>Inizio missione</Popup>
                </Marker>

                {/* Marker per l'ultima posizione */}
                <Marker position={polylinePositions[polylinePositions.length - 1]} icon={droneIcon}>
                    <Popup>Ultima posizione registrata</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapHistoryComponent;
