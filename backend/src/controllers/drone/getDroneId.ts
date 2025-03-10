import { Request, Response } from "express";
import { ErrorCodes } from "../../constants/errorCodes";
import { responseStatus } from "../../constants/statusEnum";
import RealTimeDroneData from "../../models/droneSchemaRealTime";
import { AppError } from "../../types/appError";
import { AppSuccess } from "../../types/succesType";

interface droneId {
  deviceId: string
}

const getDroneById = async (request: Request, response: Response): Promise<void> => {
  try {
    const { deviceId } = request.params;
    
    if (!deviceId) {
      throw new AppError(
        responseStatus.BAD_REQUEST,
        ErrorCodes.MISSING_FIELD,
        "ID del drone non specificato"
      );
    }
    //.select in modo positivo iclude solo i dati che vogliamo visualizare,invece con - escludiamo quel campo dalla risposta dei dati
    // un campo che aggiunge mongodb in automatico
    const drone: droneId | null= await RealTimeDroneData.findOne({ deviceId }).select('-__v');
    
    if (!drone) {
      throw new AppError(
        responseStatus.NOT_FOUND,
        ErrorCodes.ENTITY_NOT_FOUND,
        `Drone con ID ${deviceId} non trovato`
      );
    }
    
    AppSuccess.getInstance().successResponse(
      response,
      "DRONE_RETRIEVED",
      responseStatus.OK,
      { drone }
    );
    
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    console.error("Errore durante il recupero del drone:", error);
    throw new AppError(
      responseStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.ENTITY_NOT_FOUND,
      "Errore durante il recupero del drone"
    );
  }
};

export default getDroneById;