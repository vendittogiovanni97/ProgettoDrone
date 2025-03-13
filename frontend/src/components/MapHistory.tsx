import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { backendFetchDrones } from "../services/api";
import { useParams } from "react-router-dom";

const MappaStoricaComponent: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>(); // Usiamo uniqueId dall'URL
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [startPosition, setStartPosition] = useState<[number, number] | null>(
    null
  );
  const [endPosition, setEndPosition] = useState<[number, number] | null>(null);

  const droneIcon = new L.Icon({
    iconUrl: "/images/droneStoric.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const { responseBody } = await backendFetchDrones(`/track/${uniqueId}`);
        const positionData = responseBody?.details?.positionData;

        if (!Array.isArray(positionData)) {
          console.error("Dati non validi o vuoti:", responseBody);
          return;
        }

        const formattedCoordinates = positionData
          .map((entry: any) => [parseFloat(entry.lat), parseFloat(entry.lon)])
          .filter(([lat, lon]) => !isNaN(lat) && !isNaN(lon));

        if (formattedCoordinates.length > 0) {
          setCoordinates(formattedCoordinates);
          setStartPosition(formattedCoordinates[0]);
          setEndPosition(formattedCoordinates[formattedCoordinates.length - 1]);
        }
      } catch (error) {
        console.error("Errore nel recupero delle coordinate:", error);
      }
    };

    if (uniqueId) {
      fetchCoordinates();
    }
  }, [uniqueId]);

  return (
    <div className="leaflet-container">
      <MapContainer
        center={[41.9028, 12.4964]} // Centra la mappa sull'Italia
        zoom={6}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Polyline positions={coordinates} color="blue" weight={4} />

        {startPosition && (
          <Marker position={startPosition}>
            <Popup>Inizio missione</Popup>
          </Marker>
        )}

        {endPosition && (
          <Marker position={endPosition} icon={droneIcon}>
            <Popup>Ultima posizione registrata</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MappaStoricaComponent;
