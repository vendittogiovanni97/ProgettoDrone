import { useParams } from "react-router-dom";
import TableHistoryComponents from "../components/tableHistory";
import MapHistoryComponents from "../components/MapHistory";
import "../css/vediDettagli.css";

const VediDettagliPages: React.FC = () => {
    const { deviceId } = useParams<{ deviceId?: string }>(); // Accetta anche undefined

    if (!deviceId) {
        return <p>Errore: ID drone non trovato</p>;
    }

    return (
        <div className="dettagli-container">
            <h1>Dettagli del Drone: {deviceId}</h1>
            <div className="grafico-container">
            <TableHistoryComponents droneId={deviceId} />
            </div>
            <div className="missione-container">
            <MapHistoryComponents droneId={deviceId} />
            </div>
        </div>
    );
};

export default VediDettagliPages;
