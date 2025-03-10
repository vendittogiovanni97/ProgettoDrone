import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { ClientSideRowModelModule, ModuleRegistry, ColDef } from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Definizione del tipo dei dati della tabella
interface DroneData {
    DeviceId: string;
    temperature: string;
}

const PrincipalTableComponent: React.FC = () => {
    const [droneData, setDroneData] = useState<DroneData[]>([]);
    const navigate = useNavigate();

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

    // Definizione tipizzata delle colonne
    const columnDefs: ColDef<DroneData>[] = [
        { headerName: "Device ID", field: "DeviceId", sortable: true, filter: true },
        { headerName: "Ultima Temperatura (°C)", field: "temperature", sortable: true, filter: true },
    ];

    return (
        <div style={{ width: "100%" }}>
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Stato Droni</h2>
            <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
                <AgGridReact
                    rowData={droneData}
                    columnDefs={columnDefs}
                    pagination={true}
                    domLayout="autoHeight"
                />
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button className="details-button" onClick={() => navigate("/vedi-dettagli")}>
                    Vedi Dettagli
                </button>
            </div>
        </div>
    );
};

export default PrincipalTableComponent;





