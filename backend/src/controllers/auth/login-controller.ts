import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { SessionManager } from "../../sessionData";
import { Cookie, SessionData } from "express-session";

import { AppSuccess } from "../../types/succesType";
import Users from "../../models/userSchema";
import { ErrorCodes } from "../../constants/errorCodes";
import { responseStatus } from "../../constants/statusEnum";
import { AppError } from "../../types/appError";
import { LoginInfo } from "../../types/infoSchema";

const login = async (
  request: Request<undefined, unknown, LoginInfo>,
  response: Response
) => {
  try {
    const { body } = request;
    console.log("dati di login:", body);

    // Verifica se l'email è fornita
    if (!body.email || !body.password) {
      throw new AppError(
        responseStatus.BAD_REQUEST,
        ErrorCodes.MISSING_FIELD,
        "Email e password sono richiesti"
      );
    }

    // Cerca l'utente nel database MongoDB
    const user = await Users.findOne({ email: body.email });

    // Se l'utente non esiste
    if (!user) {
      throw new AppError(
        responseStatus.BAD_REQUEST,
        ErrorCodes.INVALID_CREDENTIALS,
        "Credenziali non valide"
      );
    }

    // Verifica la password
    const isCorrect = await bcrypt.compare(body.password, user.password);

    if (!isCorrect) {
      throw new AppError(
        responseStatus.BAD_REQUEST,
        ErrorCodes.INVALID_CREDENTIALS,
        "Credenziali non valide"
      );
    }

    // Imposta la sessione
    request.session.email = user.email!;
    request.session.username = user.username;

    // Crea la sessione
    const sessionManager = SessionManager.getInstance();
    const sessionData: SessionData = {
      email: user.email!,
      username: user.username,
      cookie: new Cookie(),
    };

    // Salva la sessione
    sessionManager.createSession(sessionData);

    // Invia risposta di successo
    AppSuccess.getInstance().successResponse(
      response, 
      "LOGIN_SUCCESS",
      responseStatus.OK, 
      {
        id: user._id.toString(), 
        username: user.username, 
        email: user.email
      }
    );

    return;
  } catch (error) {
    // Se l'errore è già un AppError, lo passiamo direttamente
    if (error instanceof AppError) {
      throw error;
    }
    
    // Altrimenti, creiamo un nuovo errore generico
    console.error("Errore durante il login:", error);
    throw new AppError(
      responseStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INVALID_CREDENTIALS,
      "Errore durante il login"
    );
  }
};

export default login;