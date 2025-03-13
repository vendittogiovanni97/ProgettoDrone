import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import mqtt from "mqtt";
import "leaflet/dist/leaflet.css";
import "../css/map.css";

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
    const [dronePositions, setDronePositions] = useState<Record<string, any>>({});  // Stato per le posizioni dei droni
    const markersRef = useRef<{ [key: string]: L.Marker | null }>({});  // Riferimenti ai marker sulla mappa

    useEffect(() => {
        const fetchDronePositions = async () => {
            try {
                const response = await fetch("https://fa2a-2001-b07-6469-af00-951a-4c69-dcc4-814b.ngrok-free.app/rest/mqtt/allDrones", {
                    headers: {
                        "Accept": "application/json"
                    }
                });

                const data = await response.json(); // Convertiamo la risposta in JSON

                if (!data.details || !data.details.drones) {
                    throw new Error("Struttura dati non valida");
                }

                // Estrarre solo lat, lon e status per ogni drone
                const dronePositions = data.details.drones.map((drone: any) => ({
                    id: drone.deviceId,
                    lat: drone.lat,
                    long: drone.lon,
                    lastUpdate: Date.now(),
                    isOnline: drone.status === "ONLINE" // Imposta ONLINE/OFFLINE in base allo stato
                }));

                setDronePositions(dronePositions);
            } catch (error) {
                console.error("Errore nel recupero delle posizioni dei droni:", error);
            }
        };

        fetchDronePositions();
    }, []);



    // 2. Connessione MQTT per l'aggiornamento in tempo reale
    useEffect(() => {
        const client = mqtt.connect("wss://nexustlc.ddns.net:443/mqtt", {
            username: "ProgettoDroneClient",
            password: "42286f739da8106ff3049807d1ac3fa5",
        });

        client.on("connect", () => {
            console.log("Connesso a MQTT");
            client.subscribe("Synapsy/drone/+/+");
        });

        client.on("message", (topic, message) => {
            const topicParts = topic.split("/");
            const deviceId = topicParts[2];

            try {
                const data = JSON.parse(message.toString());
                const lat = data?.lat;
                const long = data?.lon;

                if (lat !== undefined && long !== undefined) {
                    setDronePositions((prevPositions) => ({
                        ...prevPositions,
                        [deviceId]: {
                            id: deviceId,
                            lat,
                            long,
                            lastUpdate: Date.now(),
                            isOnline: true,
                        },
                    }));
                }
            } catch (error) {
                console.error("Errore nel parsing dei dati MQTT:", error);
            }
        });

        return () => {
            console.log("Disconnesso da MQTT");
            client.end();
        };
    }, []);

    //  3. Controllo stato online/offline basato sul tempo di aggiornamento
    useEffect(() => {
        const interval = setInterval(() => {
            setDronePositions((prevPositions) => {
                const updatedPositions = { ...prevPositions };
                const now = Date.now();

                Object.keys(updatedPositions).forEach((id) => {
                    if (now - updatedPositions[id].lastUpdate > 20000) {
                        updatedPositions[id] = {
                            ...updatedPositions[id],
                            isOnline: false,
                        };
                    }
                });

                return updatedPositions;
            });
        }, 20000);

        return () => clearInterval(interval);
    }, []);

    //  4. Aggiornamento icone in base allo stato online/offline
    useEffect(() => {
        Object.keys(dronePositions).forEach((id) => {
            const marker = markersRef.current[id];
            if (marker) {
                const newIcon = dronePositions[id].isOnline ? droneOnlineIcon : droneOfflineIcon;
                marker.setIcon(newIcon);
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

                {Object.values(dronePositions).map((drone) => (
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
                                <strong>ID Drone:</strong> {drone.id}<br />
                                <strong>Latitudine:</strong> {drone.lat}°<br />
                                <strong>Longitudine:</strong> {drone.long}°<br />
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








