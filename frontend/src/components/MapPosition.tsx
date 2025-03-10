import  { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPositionComponent = () => {
    const [dronePositions, setDronePositions] = useState<any[]>([]);

    // Funzione per aggiornare la mappa con una nuova posizione del drone
    const updateMap = (newPosition: any) => {
        setDronePositions((prevPositions) => {
            const updatedPositions = prevPositions.filter((drone) => drone.id !== newPosition.id);
            updatedPositions.push(newPosition);
            return updatedPositions;
        });
    };

    useEffect(() => {
        // Funzione per recuperare la posizione dei droni tramite API
        const fetchDronePositions = async () => {
            try {
                const response = await fetch('APIMIA');
                const data = await response.json();

                // Usa updateMap per aggiornare lo stato della posizione dei droni
                data.forEach((drone: any) => {
                    updateMap(drone);
                });
            } catch (error) {
                console.error('Error fetching drone positions:', error);
            }
        };

        // Recupera la posizione dei droni ogni 5 secondi
        const intervalId = setInterval(fetchDronePositions, 10000); // ogni 10 secondi

        // Pulizia dell'intervallo quando il componente viene smontato
        return () => clearInterval(intervalId);
    }, []);

    return (
        <MapContainer center={[41.9028, 12.4964]} zoom={6} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Aggiungi i marker solo se ci sono posizioni dei droni */}
            {dronePositions.map((drone, index) => (
                <Marker key={index} position={[drone.lat, drone.lng]} icon={new L.Icon.Default()}>
                    <Popup>
                        <div>
                            <strong>ID Drone:</strong> {drone.id}<br />
                            <strong>Latitudine:</strong> {drone.lat}<br />
                            <strong>Longitudine:</strong> {drone.lng}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapPositionComponent;



