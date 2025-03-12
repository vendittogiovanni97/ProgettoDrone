import { Request, Response } from "express";
import DroneHistory from "../../models/droneSchemaHistory";
import { AppError } from "../../types/appError";
import { responseStatus } from "../../constants/statusEnum";
import { ErrorCodes } from "../../constants/errorCodes";
import { AppSuccess } from "../../types/succesType";
import { number } from "zod";

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

    // Calcola temperatura minima e massima usando un ciclo for
    let minTemp = Infinity;
    let maxTemp = -Infinity;

    for (let i = 0; i < trackData.length; i++) {
      if (trackData[i].temperature !== undefined) {
        if (Number(trackData[i].temperature) < minTemp)
          minTemp = Number(trackData[i].temperature);
        if (Number(trackData[i].temperature) > maxTemp)
          maxTemp = Number(trackData[i].temperature);
      }
    }

    // Se non ci sono dati di temperatura validi
    if (minTemp === Infinity || maxTemp === -Infinity) {
      minTemp = 0;
      maxTemp = 0;
    }

    // Invia la risposta con i dati della tratta e le temperature min/max
    AppSuccess.getInstance().successResponse(
      response,
      "Dati della tratta recuperati con successo",
      responseStatus.OK,
      {
        trackData,
        temperatureStats: {
          min: minTemp,
          max: maxTemp,
        },
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
