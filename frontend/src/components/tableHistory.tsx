import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { MissionData } from "./interfaces.tsx"; // Importiamo l'interfaccia dei dati

// Componente per visualizzare il grafico delle temperature
const TableHistoryComponents: React.FC<{ droneId: string }> = ({ droneId }) => {
    // Stato per memorizzare i dati della missione
    const [missionData, setMissionData] = useState<MissionData | null>(null);

    // Effetto per recuperare i dati quando cambia il droneId
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/rest/mqtt/track/${droneId}`);
                if (!response.ok) throw new Error("Errore nella richiesta");
                const data: MissionData = await response.json();
                setMissionData(data); // Salviamo i dati nello stato
            } catch (error) {
                console.error("Errore nel recupero dei dati:", error);
            }
        };

        fetchData();
    }, [droneId]); // Si esegue ogni volta che cambia il droneId

    // Funzione per generare le opzioni del grafico
    const getChartOption = (): EChartsOption => {
        if (!missionData) {
            return { title: { text: "" }, xAxis: {}, yAxis: {}, series: [] }; // Opzione di default se i dati non sono ancora caricati
        }

        // Estraggo i dati dalla missione
        const { startTime, endTime, temperatureData, temperatureStats } = missionData;

        // Converto i timestamp in numeri
        const startTimestamp = new Date(startTime).getTime();
        const endTimestamp = new Date(endTime).getTime();

        // Evito divisioni per zero
        const dataLength = temperatureData.length || 1;

        // Creo gli intervalli temporali per ogni dato
        const timestamps = temperatureData.map((_, i) =>
            startTimestamp + ((endTimestamp - startTimestamp) / dataLength) * i
        );

        return {
            title: { text: `Temperature Missione Drone ${droneId}` }, // Titolo del grafico
            tooltip: { trigger: "axis" }, // Mostra i valori quando si passa sopra il grafico
            legend: { data: ["Temperatura", "Minima", "Massima"] }, // Legenda
            xAxis: { type: "time" as const, name: "Tempo", nameLocation: "middle", nameGap: 25 }, // Asse X con dati temporali
            yAxis: { type: "value", name: "°C", nameLocation: "middle", nameGap: 35 }, // Asse Y con temperature
            series: [
                {
                    name: "Temperatura",
                    type: "line",
                    data: timestamps.map((time, i) => [time, temperatureData[i]]), // Dati della temperatura
                    smooth: true,
                    lineStyle: { color: "green" },
                },
                {
                    name: "Minima",
                    type: "line",
                    data: timestamps.map((time) => [time, temperatureStats.min]), // Linea temperatura minima
                    smooth: true,
                    lineStyle: { color: "blue", type: "dashed" },
                },
                {
                    name: "Massima",
                    type: "line",
                    data: timestamps.map((time) => [time, temperatureStats.max]), // Linea temperatura massima
                    smooth: true,
                    lineStyle: { color: "red", type: "dashed" },
                },
            ],
        };
    };

    return (
        <>
            {!missionData ? (
                <p>Caricamento dati...</p> // Messaggio di caricamento quando i dati non sono disponibili
            ) : (
                <ReactECharts option={getChartOption()} style={{ width: "100%", height: "400px" }} />
            )}
        </>
    );
};

export default TableHistoryComponents;
