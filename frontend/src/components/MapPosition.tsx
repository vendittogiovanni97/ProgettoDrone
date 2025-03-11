import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import mqtt from "mqtt";
import "leaflet/dist/leaflet.css";

const MapPositionComponent = () => {
    // Stato per memorizzare le posizioni dei droni ricevute da MQTT
    const [dronePositions, setDronePositions] = useState<any[]>([]);

    useEffect(() => {
        // Connessione al broker MQTT con le credenziali fornite
        const client = mqtt.connect("wss:nexustlc.ddns.net:443/mqtt", {
            username: "ProgettoDroneClient",
            password: "42286f739da8106ff3049807d1ac3fa5",
        });

        // Evento quando la connessione a MQTT viene stabilita con successo
        client.on("connect", () => {
            console.log("Connesso a MQTT");
            client.subscribe("Synapsy/drone/+/+"); // Sottoscrizione ai topic dei droni
        });

        // Evento che si attiva quando arriva un messaggio MQTT
        client.on("message", (topic, message) => {
            const topicParts = topic.split("/");
            const deviceId = topicParts[2]; // Estrazione dell'ID del drone dal topic

            try {
                // Parsing del messaggio JSON ricevuto
                const data = JSON.parse(message.toString());
                const lat = data?.lat || null;
                const long = data?.lon || null;

                // Se latitudine e longitudine sono validi, aggiorna la posizione del drone
                if (lat !== null && long !== null) {
                    setDronePositions((prevPositions) => {
                        // Aggiorna la posizione del drone se già esiste, altrimenti lo aggiunge
                        const updatedPositions = prevPositions.map((drone) =>
                            drone.id === deviceId ? { ...drone, lat, long } : drone
                        );

                        return updatedPositions.some((drone) => drone.id === deviceId)
                            ? updatedPositions
                            : [...updatedPositions, { id: deviceId, lat, long }];
                    });
                }
            } catch (error) {
                console.error("Errore nel parsing dei dati MQTT:", error);
            }
        });

        // Cleanup della connessione quando il componente viene smontato
        return () => {
            console.log("Disconnesso da MQTT");
            client.end();
        };
    }, []);

    return (
        // Contenitore della mappa Leaflet con centro su Roma e zoom predefinito
        <MapContainer center={[41.9028, 12.4964]} zoom={6} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Itera sulle posizioni dei droni e aggiunge i marker alla mappa */}
            {dronePositions.map((drone) => (
                <Marker key={drone.id} position={[drone.lat, drone.long]} icon={new L.Icon.Default()}>
                    <Popup>
                        <div>
                            <strong>ID Drone:</strong> {drone.id}<br />
                            <strong>Latitudine:</strong> {drone.lat}°<br />
                            <strong>Longitudine:</strong> {drone.long}°
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapPositionComponent;







