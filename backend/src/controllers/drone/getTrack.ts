import { Request, Response } from "express";
import DroneHistory from "../../models/droneSchemaHistory";
import { AppError } from "../../types/appError";
import { responseStatus } from "../../constants/statusEnum";
import { ErrorCodes } from "../../constants/errorCodes";
import { AppSuccess } from "../../types/succesType";

/**
 * Ottiene i dati di una specifica tratta di missione del drone
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

    if (!trackData) {
      throw new AppError(
        responseStatus.NOT_FOUND,
        ErrorCodes.ENTITY_NOT_FOUND,
        "Tratta non trovata"
      );
    }

    // Invia la risposta con i dati della tratta
    AppSuccess.getInstance().successResponse(
      response,
      "Dati della tratta recuperati con successo",
      responseStatus.OK,
      { trackData }
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
