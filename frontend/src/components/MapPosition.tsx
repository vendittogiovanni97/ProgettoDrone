import { useEffect, useState,useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import mqtt from "mqtt";
import "leaflet/dist/leaflet.css";
import "../css/map.css"

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
    const [dronePositions, setDronePositions] = useState<Record<string, any>>({});                                     //Parametro per il real time
    const markersRef = useRef<{ [key: string]: L.Marker | null }>({});              //Parametro per il marker

    useEffect(() => {
        const client = mqtt.connect("wss://nexustlc.ddns.net:443/mqtt", {
            username: "ProgettoDroneClient",
            password: "42286f739da8106ff3049807d1ac3fa5",
        });

        client.on("connect", () => {
            console.log("Connesso a MQTT");
            client.subscribe("Synapsy/drone/+/+");                      //connessione mqtt e sottoscrizione al topic
        });

        client.on("message", (topic, message) => {
            const topicParts = topic.split("/");
            const deviceId = topicParts[2];                     //recupero dati dal pezzo del topic utile

            try {
                const data = JSON.parse(message.toString());
                const lat = data?.lat;
                const long = data?.lon;                         //recupero dati

                if (lat !== undefined && long !== undefined) {
                    setDronePositions((prevPositions) => ({
                        ...prevPositions,
                        [deviceId]: {
                            id: deviceId,
                            lat,
                            long,
                            lastUpdate: Date.now(),
                            isOnline: true, // Imposta subito online all'arrivo del dato mettendolo nella mappa in base a lat e long
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


    useEffect(() => {
        const interval = setInterval(() => {
            setDronePositions((prevPositions) => {
                const updatedPositions = { ...prevPositions };
                const now = Date.now();                         //creo intervallo per fare l'update della posizione

                Object.keys(updatedPositions).forEach((id) => {
                    if (now - updatedPositions[id].lastUpdate > 20000) {
                        updatedPositions[id] = {
                            ...updatedPositions[id],
                            isOnline: false,                        //se non riceve dati nell'intervallo set is online falso
                        };
                    }
                });

                return updatedPositions;
            });
        }, 20000);

        return () => clearInterval(interval);
    }, []);

    // Aggiornamento forzato dell'icona in Leaflet quando cambia `isOnline`
    useEffect(() => {
        Object.keys(dronePositions).forEach((id) => {
            const marker = markersRef.current[id];
            if (marker) {
                const newIcon = dronePositions[id].isOnline ? droneOnlineIcon : droneOfflineIcon;
                marker.setIcon(newIcon);                    //in base a se è online o meno setto un icona
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







