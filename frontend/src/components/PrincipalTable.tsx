import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { ClientSideRowModelModule, ModuleRegistry, ColDef } from "ag-grid-community";
import {DroneData} from "./interfaces"

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Componente personalizzato per l'header con il pulsante
const CustomHeader: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Device ID</span>
            <button
                style={{ marginLeft: "10px", padding: "5px 10px", cursor: "pointer" }}
                onClick={() => navigate("/vedi-dettagli")}
            >
                Vedi Dettagli
            </button>
        </div>
    );
};


const PrincipalTableComponent: React.FC = () => {
    const [droneData, setDroneData] = useState<DroneData[]>([]);


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
            const topicParts = topic.split('/');
            const deviceId = topicParts[2]; // Estrarre il DeviceId

            const messageString = message.toString();

            let messageJson;
            try {
                messageJson = JSON.parse(messageString);
            } catch (error) {
                console.error("Errore nel parsing del messaggio:", error);
                return;
            }

            const temperature = messageJson?.temperature || "N/A";

            setDroneData((prevData) => {
                const existingIndex = prevData.findIndex((item) => item.DeviceId === deviceId);
                if (existingIndex !== -1) {
                    const updatedData = [...prevData];
                    updatedData[existingIndex].temperature = temperature;
                    return updatedData;
                } else {
                    return [...prevData, { DeviceId: deviceId, temperature }];
                }
            });
        });

        return () => {
            client.end();
        };
    }, []);

    // Definizione tipizzata delle colonne con header personalizzato
    const columnDefs: ColDef<DroneData>[] = [
        {
            headerName: "",
            field: "DeviceId",
            sortable: true,
            filter: true,
            headerComponent: CustomHeader // Aggiungi il componente personalizzato
        },
        { headerName: "Ultima Temperatura (°C)", field: "temperature", sortable: true, filter: true },
    ];


    return (
        <div style={{ width: "100%" }}>
            <div className="ag-theme-alpine" style={{ height: 250, width: "100%" }}>
                <AgGridReact
                    rowData={droneData}
                    columnDefs={columnDefs}
                    pagination={true}
                    domLayout="autoHeight"
                />
            </div>
        </div>
    );
};

export default PrincipalTableComponent;





