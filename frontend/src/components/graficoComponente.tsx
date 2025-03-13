/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import { backendFetchDrones } from "../services/api";
import { EChartsOption } from "echarts";

const GraficoTemperatureComponent: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>(); // Usiamo uniqueId dall'URL
  const [chartData, setChartData] = useState<
    { time: string; temperature: number }[]
  >([]);
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState<string | null>(null); // Stato per gli errori

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Recupera i dati della tratta (missione) in base a uniqueId
        const response = await backendFetchDrones(`/track/${uniqueId}`);
        const responseData = response.responseBody;

        // Verifica che i dati siano validi
        if (
          !responseData?.details?.temperatureData ||
          !Array.isArray(responseData.details.temperatureData)
        ) {
          throw new Error("Dati della missione non validi");
        }

        // 2. Formatta i dati delle temperature
        const formattedData = responseData.details.temperatureData.map(
          (temperature: number, index: number) => ({
            time: `Punto ${index + 1}`, // Usa un'etichetta generica per il tempo
            temperature: temperature,
          })
        );

        // 3. Imposta i dati nel state
        setChartData(formattedData);

        // 4. Configura le opzioni del grafico
        setOptions({
          title: {
            text: `Storico Temperature - Missione ${uniqueId}`,
            left: "center",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: formattedData.map((entry) => entry.time),
            axisLabel: {
              rotate: 45, // Ruota le etichette per una migliore leggibilità
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
                color: "#ff5722", // Colore della linea
              },
              itemStyle: {
                color: "#ff5722", // Colore dei punti
              },
            },
          ],
        });
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
        setError("Errore nel caricamento dei dati delle temperature.");
      } finally {
        setLoading(false);
      }
    };

    if (uniqueId) {
      fetchTemperatureData();
    }
  }, [uniqueId]);

  const [options, setOptions] = useState<EChartsOption>({});

  if (loading) {
    return <p>Caricamento dati...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <ReactECharts option={options} style={{ height: "400px", width: "100%" }} />
  );
};

export default GraficoTemperatureComponent;
