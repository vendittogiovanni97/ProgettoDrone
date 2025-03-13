/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ColDef,
} from "ag-grid-community";
import { DroneData } from "./interfaces";
import { AllCommunityModule, themeAlpine } from "ag-grid-community";
import "../css/table.css";
import { backendFetch } from "../services/api";

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

const PrincipalTableComponent: React.FC = () => {
  const [droneData, setDroneData] = useState<DroneData[]>([]);
  const navigate = useNavigate();

  // Funzione per recuperare i dati iniziali dalla API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Usa backendFetch per fare la richiesta
        const { responseBody } = await backendFetch("/mqtt/allDrones");

        // Verifica la struttura dei dati
        if (!responseBody.details || !responseBody.details.drones) {
          throw new Error("Struttura dati non valida");
        }

        // Estrarre solo lat, lon e status per ogni drone
        const drones = responseBody.details.drones.map(
          (drone: {
            deviceId: any;
            temperature: any;
            status: any;
            lastUpadate: any;
          }) => ({
            deviceId: drone.deviceId,
            temperature: drone.temperature,
            timestamp: drone.lastUpadate,
            status: drone.status || "OFFLINE", // Default se manca lo stato
          })
        );

        setDroneData(drones);
      } catch (error) {
        console.error("Errore nel recupero dei dati iniziali:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Effetto per la connessione MQTT
  useEffect(() => {
    const client = mqtt.connect("wss:nexustlc.ddns.net:443/mqtt", {
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
        const temperature = data?.temperature || "N/A";
        const timestamp = Date.now();

        setDroneData((prevData) => {
          const existingIndex = prevData.findIndex(
            (item) => item.DeviceId === deviceId
          );

          if (existingIndex !== -1) {
            const updatedData = [...prevData];
            updatedData[existingIndex] = {
              DeviceId: deviceId,
              temperature,
              timestamp,
              status: "Online",
            };
            return updatedData;
          } else {
            return [
              ...prevData,
              {
                DeviceId: deviceId,
                temperature,
                timestamp,
                status: "Online",
              },
            ];
          }
        });
      } catch (error) {
        console.error("Errore nel parsing del messaggio:", error);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  // Controllo stato droni ogni 20 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setDroneData((prevData) =>
        prevData.map((drone) => {
          const now = Date.now();
          const isOnline = now - drone.timestamp <= 20000;
          return { ...drone, status: isOnline ? "Online" : "Offline" };
        })
      );
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleDroneClick = (deviceId: string) => {
    navigate(`/vediDettagli/${deviceId}`);
  };

  const renderDroneId = (value: string) => (
    <span
      style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
      onClick={() => handleDroneClick(value)}
    >
      {value}
    </span>
  );

  const renderStatus = (status: string) => (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: status === "Online" ? "green" : "red",
        }}
      ></span>
      {status}
    </span>
  );

  const columnDefs: ColDef<DroneData>[] = [
    {
      headerName: "ID Drone",
      field: "DeviceId",
      sortable: true,
      filter: true,
      cellRenderer: ({ value }) => renderDroneId(value),
    },
    {
      headerName: "Ultima Temperatura (°C)",
      field: "temperature",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Ultimo Dato Ricevuto",
      field: "timestamp",
      sortable: true,
      filter: true,
      valueFormatter: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      headerName: "Stato",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: ({ value }) => renderStatus(value),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ overflow: "auto" }}>
      <AgGridReact
        theme={themeAlpine}
        rowData={droneData}
        columnDefs={columnDefs}
        pagination={true}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default PrincipalTableComponent;
