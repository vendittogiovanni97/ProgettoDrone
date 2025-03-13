import React from "react";
import { useParams } from "react-router-dom";
import "../css/missione.css"; // Importa il file CSS per la pagina
import GraficoTemperatureComponent from "../components/graficoComponente";
import MappaStoricaComponent from "../components/MapHistory";

const MissionePage: React.FC = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>(); // Ottieni l'ID della missione dall'URL

  return (
    <div className="missione-container">
      <h1>Dettaglio Missione: {uniqueId}</h1>

      {/* Sezione per il grafico delle temperature */}
      <div className="grafico-section">
        <h2>Grafico delle Temperature</h2>
        <GraficoTemperatureComponent />
      </div>

      {/* Sezione per la mappa storica */}
      <div className="mappa-section">
        <h2>Mappa Storica</h2>
        <MappaStoricaComponent />
      </div>
    </div>
  );
};

export default MissionePage;
