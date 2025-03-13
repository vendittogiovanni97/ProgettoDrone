import { useParams } from "react-router-dom";
import TableHistoryComponents from "../components/tableHistory";
import MapHistoryComponent from "../components/MapHistory";
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
            <TableHistoryComponents deviceId={deviceId} />
            </div>
            <div className = "mission-container">
                <MapHistoryComponent deviceId={deviceId} />
            </div>

        </div>
    );
};

export default VediDettagliPages;
