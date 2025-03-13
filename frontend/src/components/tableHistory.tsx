import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import { backendFetch } from "../services/api";
import { EChartsOption } from "echarts";

const GraficoComponent: React.FC = () => {
    const { uniqueId } = useParams<{ uniqueId: string }>();
    const [chartData, setChartData] = useState<{ time: string; temperature: number }[]>([]);
    const [options, setOptions] = useState<EChartsOption>({}); // ✅ Inizializzato con un oggetto vuoto

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                console.log("Fetching drone list...");
                const { responseBody } = await backendFetch("/mqtt/allDrones");

                if (!responseBody?.details?.drones) {
                    throw new Error("Struttura dati non valida");
                }

                console.log("Drone list:", responseBody.details.drones);

                const selectedDrone = responseBody.details.drones.find(
                    (drone: { deviceId: string; uniqueId: string }) => drone.deviceId === uniqueId
                );

                if (!selectedDrone) {
                    throw new Error("Drone non trovato");
                }

                console.log("Selected drone:", selectedDrone);

                console.log(`Fetching historical data for drone ${selectedDrone.uniqueId}...`);
                const historicalResponse = await backendFetch(`/mqtt/track/${selectedDrone.uniqueId}`);
                const data = historicalResponse.responseBody;

                if (!data?.temperatures || !Array.isArray(data.temperatures)) {
                    throw new Error("Struttura dati non valida");
                }

                console.log("Historical data:", data.temperatures);

                const formattedData = data.temperatures.map((entry: { timestamp: string; temperature: number }) => ({
                    time: new Date(entry.timestamp).toISOString().slice(0, 19).replace("T", " "), // ✅ Formattazione più stabile
                    temperature: entry.temperature,
                }));

                setChartData(formattedData);

                setOptions({
                    title: {
                        text: `Storico Temperature - Drone ${uniqueId}`,
                        left: "center",
                    },
                    tooltip: {
                        trigger: "axis",
                    },
                    xAxis: {
                        type: "category",
                        data: formattedData.map((entry) => entry.time),
                        axisLabel: {
                            rotate: 45, // ✅ Ruota le etichette per una migliore leggibilità
                        },
                    },
                    yAxis: {
                        type: "value",
                        name: "Temperatura (°C)",
                    },
                    series: [
                        {
                            name: "Temperatura",
                            data: formattedData.map((entry) => entry.temperature),
                            type: "line",
                            smooth: true,
                            lineStyle: {
                                color: "#ff5722", // ✅ Colore più visibile
                            },
                            itemStyle: {
                                color: "#ff5722",
                            },
                        },
                    ],
                });
            } catch (error) {
                console.error("Errore nel recupero dei dati storici:", error);
            }
        };

        if (uniqueId) {
            fetchHistoricalData();
        }

    }, [uniqueId]);

    if (!chartData.length) return <p>Caricamento dati...</p>;

    return <ReactECharts option={options} style={{ height: "400px", width: "100%" }} />;
};

export default GraficoComponent;
