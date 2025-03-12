import { Request, Response } from "express";
import DroneHistory from "../../models/droneSchemaHistory";
import { AppError } from "../../types/appError";
import { responseStatus } from "../../constants/statusEnum";
import { ErrorCodes } from "../../constants/errorCodes";
import { AppSuccess } from "../../types/succesType";

// Funzione per formattare la durata in ore, minuti e secondi

function formatDuration(seconds: number): string {
  if (seconds == null) return "N/A";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let dataFormatted = "";

  if (hours > 0) {
    dataFormatted += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    dataFormatted += `${minutes}m `;
  }
  dataFormatted += `${secs}s`;

  return dataFormatted.trim();
}

/**
 * Ottiene i dati di una specifica tratta di missione del drone
 * con calcolo di temperatura minima e massima
 */
const getDroneTrackById = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { uniqueId } = request.params;

    // Verifica che uniqueId sia stato fornito
    if (!uniqueId) {
      throw new AppError(
        responseStatus.BAD_REQUEST,
        ErrorCodes.MISSING_FIELD,
        "Id della tratta non fornito"
      );
    }

    // Recupera i dati della tratta dal database
    const trackData = await DroneHistory.find({ uniqueId }).select("-__v");

    if (!trackData || trackData.length === 0) {
      throw new AppError(
        responseStatus.NOT_FOUND,
        ErrorCodes.ENTITY_NOT_FOUND,
        "Tratta non trovata"
      );
    }

    // Inizializza variabili per il calcolo della temperatura minima e massima
    let minTemp = 0;
    let maxTemp = 0;

    // Inizializza variabili per l'orario di inizio e fine
    let startTime: Date = new Date();
    let endTime: Date = new Date();

    const temperatureData: number[] = [];
    const positionData: { lat: number; lon: number }[] = [];

    const timestampData: Date[] = []; // Array per memorizzare i timestamp

    // Estrai i dati in un unico ciclo
    trackData.forEach((data) => {
      const temperature = Number(data.temperature);

      // Aggiorna la temperatura minima e massima
      if (temperature < minTemp) minTemp = temperature;
      if (temperature > maxTemp) maxTemp = temperature;

      // Aggiungi i dati agli array
      temperatureData.push(temperature);
      positionData.push({ lat: data.lat, lon: data.lon });

      // Aggiorna l'orario di inizio e fine
      const currentTimestamp = new Date(data.timestamp);
      timestampData.push(currentTimestamp); // Aggiungi il timestamp all'array
      if (!startTime || currentTimestamp < startTime) {
        startTime = currentTimestamp; // Aggiorna l'orario di inizio se è il primo o è più vecchio
      }
      if (!endTime || currentTimestamp > endTime) {
        endTime = currentTimestamp; // Aggiorna l'orario di fine se è il primo o è più recente
      }
    });

    // Calcola la durata della tratta (in millisecondi)
    const duration =
      endTime && startTime ? endTime.getTime() - startTime.getTime() : null;

    // Formatta la durata in ore, minuti e secondi
    const dataFormatted = duration ? formatDuration(duration / 1000) : "N/A";

    // Invia la risposta con i dati della tratta e le temperature min/max
    AppSuccess.getInstance().successResponse(
      response,
      "Dati della tratta recuperati con successo",
      responseStatus.OK,
      {
        temperatureStats: {
          min: minTemp,
          max: maxTemp,
        },
        temperatureData,
        positionData,
        timestampData,
        startTime: startTime?.toISOString(), // Formatta l'orario di inizio
        endTime: endTime?.toISOString(), // Formatta l'orario di fine
        dataFormatted, // Durata formattata in ore, minuti e secondi
      }
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.log("Errore durante il recupero dei dati della tratta", error);
    throw new AppError(
      responseStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.MISSING_FIELD,
      "Errore durante il recupero dei dati della tratta"
    );
  }
};

export default getDroneTrackById;
