import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ColDef,
  GridReadyEvent,
  GridApi,
} from "ag-grid-community";
import { DroneData } from "./interfaces";
import { AllCommunityModule } from "ag-grid-community";
import { backendFetchDrones } from "../services/api";

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

const PrincipalTableComponent: React.FC = () => {
  const [droneData, setDroneData] = useState<DroneData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const navigate = useNavigate();

  // Funzione per recuperare i dati dalla API
  const fetchDroneData = useCallback(async () => {
    try {
      // Richiesta API
      const { responseBody } = await backendFetchDrones("/allDrones");

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
          lastUpdated: string;
        }) => ({
          deviceId: drone.deviceId,
          temperature: drone.temperature,
          timestamp: drone.lastUpdated
            ? new Date(drone.lastUpdated).getTime()
            : 0,
          status: drone.status || "OFFLINE",
        })
      );

      // Aggiorna lo stato in base al timestamp
      const now = Date.now();
      const updatedDrones = drones.map((drone) => {
        const isOnline = drone.timestamp && now - drone.timestamp <= 20000;
        return { ...drone, status: isOnline ? "Online" : "Offline" };
      });

      setDroneData(updatedDrones);
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
    }
  }, []);

  // Funzione per aggiornare lo stato online/offline
  const updateOnlineStatus = useCallback(() => {
    setDroneData((prevData) =>
      prevData.map((drone) => {
        const now = Date.now();
        const isOnline = drone.timestamp && now - drone.timestamp <= 20000;
        return { ...drone, status: isOnline ? "Online" : "Offline" };
      })
    );
  }, []);

  // Effetto per il caricamento iniziale e l'aggiornamento periodico
  useEffect(() => {
    fetchDroneData();

    // Imposta intervalli per aggiornare i dati e lo stato
    const dataInterval = setInterval(fetchDroneData, 60000); // Aggiorna i dati ogni minuto
    const statusInterval = setInterval(updateOnlineStatus, 20000); // Aggiorna lo stato ogni 20 secondi

    return () => {
      clearInterval(dataInterval);
      clearInterval(statusInterval);
    };
  }, [fetchDroneData, updateOnlineStatus]);

  const handleDroneClick = (deviceId: string) => {
    navigate(`/storico/${deviceId}`);
  };

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  // Renderer personalizzato per la cella status con fix per assicurare che il testo venga mostrato
  const statusCellRenderer = (params: any) => {
    const status = params.value;
    return (
      <div
        className="status-cell-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "2px 0",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: status === "Online" ? "#00aa00" : "#ff0000",
            display: "inline-block",
            marginRight: "4px",
          }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: "normal",
            display: "inline-block",
          }}
        >
          {status}
        </span>
      </div>
    );
  };

  const droneCellRenderer = (params: any) => {
    return (
      <div
        style={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "blue",
        }}
        onClick={() => handleDroneClick(params.value)}
      >
        {params.value}
      </div>
    );
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "ID Drone",
        field: "deviceId",
        sortable: true,
        filter: true,
        cellRenderer: droneCellRenderer,
        flex: 2,
        minWidth: 60,
      },
      {
        headerName: "Ultima Temperatura (°C)",
        field: "temperature",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 120,
        valueFormatter: (params) => {
          return params.value !== undefined
            ? `${params.value.toFixed(1)}°C`
            : "N/A";
        },
      },
      {
        headerName: "Ultimo Dato Ricevuto",
        field: "timestamp",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 180,
        valueFormatter: (params) => {
          return params.value ? new Date(params.value).toLocaleString() : "N/A";
        },
      },
      {
        headerName: "Stato",
        field: "status",
        sortable: true,
        filter: true,
        cellRenderer: statusCellRenderer,
        flex: 1,
        minWidth: 100,
        // Assicurati che la cella abbia spazio sufficiente
        autoHeight: true,
        // Disabilita la compressione del contenuto della cella
        suppressSizeToFit: false,
      },
    ],
    []
  );

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      sortable: true,
      filter: true,
      suppressAutoSize: false,
      wrapText: false,
    };
  }, []);

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: "500px",
        width: "100%",
        overflow: "auto",
      }}
    >
      {/* Aggiungiamo uno stile inline per forzare la visualizzazione corretta delle celle di stato */}
      <style>
        {`
          .ag-theme-alpine .ag-cell {
            display: flex;
            align-items: center;
            line-height: 1.5;
            padding: 6px 8px;
          }
          .status-cell-container {
            display: flex !important;
            width: 100%;
          }
          .ag-cell-value {
            width: 100%;
            display: flex;
          }
        `}
      </style>
      <AgGridReact
        rowData={droneData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        suppressCellFocus={false}
        domLayout="autoHeight"
        onGridReady={onGridReady}
        animateRows={true}
        rowSelection="single"
        enableCellTextSelection={true}
        suppressRowVirtualisation={true}
        suppressColumnVirtualisation={true}
      />
    </div>
  );
};

export default PrincipalTableComponent;
