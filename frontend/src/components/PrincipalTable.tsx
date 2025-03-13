/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
//import mqtt from "mqtt";
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
        // Richiesta API
        const { responseBody } = await backendFetch("/mqtt/allDrones");

        // Controllo struttura dati
        if (!responseBody.details || !responseBody.details.drones) {
          throw new Error("Struttura dati non valida");
        }

        // Estrarre i dati necessari
        const drones = responseBody.details.drones.map(
            (drone: {
              deviceId: string;
              temperature: number;
              status: string;
              lastUpdated: string; // Data in formato stringa ISO
            }) => ({
              deviceId: drone.deviceId,
              temperature: drone.temperature,
              timestamp: drone.lastUpdated ? new Date(drone.lastUpdated).getTime() : 0,

              status: drone.status || "OFFLINE", // Default OFFLINE
            })
        );

        setDroneData(drones);
      } catch (error) {
        console.error("Errore nel recupero dei dati iniziali:", error);
      }
    };

    fetchInitialData();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setDroneData((prevData) =>
          prevData.map((drone) => {
            const now = Date.now();
            const isOnline = drone.timestamp && (now - drone.timestamp) <= 20000;

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
      field: "deviceId",
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
