import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Users from "../../models/userSchema";
import { RegisterSchemaZod } from "../../validation/InfoSchemaValidation";
import { ErrorCodes } from "../../constants/errorCodes";
import { responseStatus } from "../../constants/statusEnum";
import { AppError } from "../../types/appError";
import { RegisterInfo } from "../../types/infoSchema";
import { AppSuccess } from "../../types/succesType";

export const register = async (
  request: Request<undefined, unknown, RegisterInfo>,
  response: Response
) => {
  try {
    const body = request.body;
    console.log("Dati ricevuti:", body);

    // Validazione dei dati di input
    const verifiedBody = RegisterSchemaZod.safeParse(body);

    if (verifiedBody.success === false) {
      throw new AppError(
        responseStatus.BAD_REQUEST, 
        ErrorCodes.INVALID_INPUT, 
        "Dati di registrazione non validi"
      );
    }

    // Verifica se l'utente esiste già
    const existingUser = await Users.findOne({
      $or: [
        { email: verifiedBody.data.email },
        { username: verifiedBody.data.username }
      ]
    });

    if (existingUser) {
      // Determina quale campo è duplicato
      const duplicatedField = existingUser.email === verifiedBody.data.email ? "Email" : "Username";
      
      throw new AppError(
        responseStatus.CONFLICT,
        ErrorCodes.DUPLICATE_ENTITY,
        `${duplicatedField} già in uso`
      );
    }

    // Hash della password
    const passwordHash = await bcrypt.hash(verifiedBody.data.password, 12);

    // Creazione del nuovo utente
    const newUser = await Users.create({
      email: verifiedBody.data.email,
      username: verifiedBody.data.username,
      password: passwordHash,
    });

    // Risposta di successo
    AppSuccess.getInstance().successResponse(
      response, 
      "USER_REGISTERED",
      responseStatus.CREATED, 
      {
        success: true,
        message: "Utente registrato con successo",
        userId: newUser._id
      }
    );

    return;
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    
    // Se l'errore è già un AppError, lo passiamo direttamente
    if (error instanceof AppError) {
      throw error;
    }
    // Errore generico
    throw new AppError(
      responseStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INVALID_INPUT,
      "Errore durante la registrazione"
    );
  }
};

export default register;