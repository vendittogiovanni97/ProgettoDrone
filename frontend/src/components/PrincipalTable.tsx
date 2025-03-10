import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {useNavigate} from "react-router-dom";

// Registra i moduli
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const PrincipalTableComponent: React.FC = () => {
    const [droneData, setDroneData] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("URL_API");
                const data = await response.json();
                setDroneData(data);
            } catch (error) {
                console.error("Errore nel recupero dati drone:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const columnDefs = [
        { headerName: "DeviceId", field: "DeviceId", sortable: true, filter: true },
        { headerName: "ID", field: "UniqueId", filter: true },
        {
            headerName: "Stato",
            field: "status",
            cellStyle: (params: any) => ({
                color: params.value === "Online" ? "green" : "red",
                fontWeight: "bold",
            }),
        },
        { headerName: "Ultimo Dato Ricevuto", field: "lastData", sortable: true },
    ];

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
            <AgGridReact rowData={droneData} columnDefs={columnDefs} pagination={true} />
    <div className="details-container">
        <button
            className="details-button"
            onClick={() => navigate("/vedi-dettagli")}
        >
            Vedi Dettagli
        </button>
    </div>
    </div>
    );
};

export default PrincipalTableComponent;

