import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { backendFetchDrones } from "../services/api";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "../css/storico.css";

interface DroneData {
  uniqueId: string;
  lastUpdated: string;
  temperature: string;
}

const Storico: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [rowData, setRowData] = useState<DroneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Definizione corretta delle colonne con tipizzazione ColDef
  const columnDefs: ColDef<DroneData>[] = [
    {
      field: "uniqueId",
      headerName: "ID Missione",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "lastUpdated",
      headerName: "Data e Ora",
      sortable: true,
      filter: true,
      flex: 1,
      sort: "desc" as const, // Tipo esplicito per 'desc'
      valueFormatter: (params) => {
        if (!params.value) return ""; // Se il valore è nullo o undefined, restituisci una stringa vuota
        return new Date(params.value).toLocaleString(); // Formatta la data in formato leggibile
      },
    },
    {
      field: "temperature",
      headerName: "Temperatura",
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => `${params.value}°C`, // Tipo inferito correttamente
    },
  ];

  // Configurazioni della griglia
  const defaultColDef = {
    resizable: true,
    floatingFilter: true,
  };

  useEffect(() => {
    const fetchMissioni = async () => {
      if (!deviceId) return;

      try {
        setLoading(true);
        setError(null);

        const { responseBody } = await backendFetchDrones(
          `/deviceId/${deviceId}`
        );

        // Verifica che i dati siano validi
        if (
          !responseBody?.details?.drone ||
          !Array.isArray(responseBody.details.drone)
        ) {
          throw new Error("Dati non validi o formato inatteso");
        }

        // Estrai e formatta i dati delle missioni
        const missioni = responseBody.details.drone.map((missione: any) => ({
          uniqueId: missione.uniqueId, // Usa uniqueId
          lastUpdated: missione.timestamp, // Usa timestamp come lastUpdated
          temperature: missione.temperature, // Usa temperature
        }));

        setRowData(missioni); // Imposta i dati della tabella
      } catch (error) {
        console.error("Errore nel recupero delle missioni:", error);
        setError("Impossibile caricare le missioni. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchMissioni();
  }, [deviceId]);

  // Gestione del clic su una riga
  const onRowClicked = (event: any) => {
    navigate(`/missione/${event.data.uniqueId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Caricamento missioni in corso...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="storico-container">
      <div className="storico-header">
        <h1>Storico Missioni - Drone {deviceId}</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          Torna Indietro
        </button>
      </div>

      {rowData.length === 0 ? (
        <p className="no-data-message">
          Nessuna missione trovata per questo drone.
        </p>
      ) : (
        <div className="ag-theme-alpine grid-container">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onRowClicked={onRowClicked}
            rowSelection="single"
            pagination={true}
            paginationPageSize={15}
            animateRows={true}
            suppressCellFocus={true}
            domLayout="autoHeight"
          />
        </div>
      )}

      <div className="storico-footer">
        <p>Totale missioni: {rowData.length}</p>
      </div>
    </div>
  );
};

export default Storico;
