import { Request, Response } from "express";
import DroneHistory from "../../models/droneSchemaHistory";
import { AppError } from "../../types/appError";
import { responseStatus } from "../../constants/statusEnum";
import { ErrorCodes } from "../../constants/errorCodes";
import { AppSuccess } from "../../types/succesType";

/**
 * Ottiene lo storico completo di tutti i droni
 */
const getAllDroneHistory = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    // Recupera tutti i dati storici dal database ordinati per timestamp decrescente
    const historyData = await DroneHistory.find()
      .select("-__v")
      .sort({ timestamp: -1 });

    if (historyData.length === 0) {
      throw new AppError(
        responseStatus.NOT_FOUND,
        ErrorCodes.ENTITY_NOT_FOUND,
        "Nessun dato storico trovato"
      );
    }

    AppSuccess.getInstance().successResponse(
      response,
      "Storico completo dei droni recuperato con successo",
      responseStatus.OK,
      { historyData }
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.log(
      "Errore durante il recupero dello storico completo dei droni",
      error
    );
    throw new AppError(
      responseStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.MISSING_FIELD,
      "Errore durante il recupero dello storico completo dei droni"
    );
  }
};

export default getAllDroneHistory;
