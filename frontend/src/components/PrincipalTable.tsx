import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { ClientSideRowModelModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { DroneData } from "./interfaces";
import {
    AllCommunityModule,
    themeAlpine,
} from "ag-grid-community";
import "../css/table.css"


ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

const PrincipalTableComponent: React.FC = () => {
    const [droneData, setDroneData] = useState<DroneData[]>([]); // Stato per memorizzare i dati dei droni
    const navigate = useNavigate(); // Hook per la navigazione tra le pagine

    useEffect(() => {
        // Connessione al broker MQTT
        const client = mqtt.connect("wss:nexustlc.ddns.net:443/mqtt", {
            username: "ProgettoDroneClient",
            password: "42286f739da8106ff3049807d1ac3fa5",
        });

        client.on("connect", () => {
            console.log("Connesso a MQTT");
            client.subscribe("Synapsy/drone/+/+"); // Sottoscrizione al topic per ricevere dati da tutti i droni
        });

        client.on("message", (topic, message) => {
            const topicParts = topic.split('/'); // Suddivide il topic per estrarre il DeviceId
            const deviceId = topicParts[2]; // Estrarre l'ID del drone

            try {
                const data = JSON.parse(message.toString()); // Converte il messaggio JSON ricevuto
                const temperature = data?.temperature || "N/A"; // Estrae la temperatura o imposta "N/A" se mancante
                const timestamp = Date.now(); // Registra il timestamp corrente

                setDroneData((prevData) => {
                    const existingIndex = prevData.findIndex((item) => item.DeviceId === deviceId); // Controlla se il drone esiste già nella lista
                    const isOnline = true; // Se riceviamo dati, consideriamo il drone online

                    if (existingIndex !== -1) {
                        const updatedData = [...prevData];
                        updatedData[existingIndex] = {
                            DeviceId: deviceId,
                            temperature,
                            timestamp,
                            status: isOnline ? "Online" : "Offline"
                        };
                        return updatedData; // Aggiorna il dato esistente del drone
                    } else {
                        return [...prevData, {
                            DeviceId: deviceId,
                            temperature,
                            timestamp,
                            status: isOnline ? "Online" : "Offline"
                        }];
                    }
                });
            } catch (error) {
                console.error("Errore nel parsing del messaggio:", error); // Logga un errore se il parsing fallisce
            }
        });

        return () => {
            client.end(); // Disconnessione dal broker MQTT quando il componente viene smontato
        };
    }, []);

    useEffect(() => {
        // Controlla lo stato dei droni ogni 5 secondi
        const interval = setInterval(() => {
            setDroneData((prevData) =>
                prevData.map((drone) => {
                    const now = Date.now();
                    const isOnline = now - drone.timestamp <= 20000; // Se i dati sono più vecchi di 20 secondi, il drone è "Offline"
                    return { ...drone, status: isOnline ? "Online" : "Offline" };
                })
            );
        }, 20000);

        return () => clearInterval(interval); // Pulisce l'intervallo quando il componente si smonta
    }, []);

    // Navigazione ai dettagli del drone quando si clicca sul suo ID
    const handleDroneClick = (deviceId: string) => {
        navigate(`/dettagli/${deviceId}`);
    };

    // Rende l'ID del drone cliccabile e stilizzato come un link
    const renderDroneId = (value: string) => {
        return (
            <span
                style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                onClick={() => handleDroneClick(value)}
            >
                {value}
            </span>
        );
    };

    // Mostra lo stato del drone con un pallino verde (Online) o rosso (Offline)
    const renderStatus = (status: string) => {
        return (
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
    };

    // Definizione delle colonne della tabella
    const columnDefs: ColDef<DroneData>[] = [
        {
            headerName: "ID Drone",
            field: "DeviceId",
            sortable: true,
            filter: true,
            cellRenderer: ({ value }) => renderDroneId(value), // Rende il DeviceId cliccabile
        },
        {
            headerName: "Ultima Temperatura (°C)",
            field: "temperature",
            sortable: true,
            filter: true
        },
        {
            headerName: "Ultimo Dato Ricevuto",
            field: "timestamp",
            sortable: true,
            filter: true,
            valueFormatter: ({ value }) => new Date(value).toLocaleString() // Formatta il timestamp in una data leggibile
        },
        {
            headerName: "Stato",
            field: "status",
            sortable: true,
            filter: true,
            cellRenderer: ({ value }) => renderStatus(value) // Mostra il pallino verde/rosso in base allo stato
        }
    ];

    return (

            <div className="ag-theme-alpine">
                <AgGridReact
                    theme={themeAlpine}
                    rowData={droneData} // Passa i dati dei droni alla tabella
                    columnDefs={columnDefs} // Imposta le colonne della tabella
                    pagination={true} // Abilita la paginazione
                    domLayout="autoHeight" // Adatta la dimensione della tabella
                />
            </div>

    );
};

export default PrincipalTableComponent;
