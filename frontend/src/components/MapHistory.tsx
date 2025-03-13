import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MissionPositionData, Position } from "./interfaces.tsx";

const MapHistoryComponents: React.FC<{ droneId: string }> = ({ droneId }) => {
    const [missionData, setMissionData] = useState<MissionPositionData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/rest/mqtt/track/${droneId}`);
                if (!response.ok) throw new Error("Errore nella richiesta");

                const data = await response.json();

                // Parsing dei dati in formato corretto
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
                console.error("Errore nel recupero dei dati:", error);
            }
        };

        fetchData();
    }, [droneId]);

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

export default MapHistoryComponents;
