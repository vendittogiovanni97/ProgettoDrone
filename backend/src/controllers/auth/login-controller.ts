import { SessionData, Cookie } from "express-session";
import { ErrorCodes } from "../../constants/errorCodes";
import { responseStatus } from "../../constants/statusEnum";
import Users from "../../models/userSchema";
import { SessionManager } from "../../sessionData";
import { AppError } from "../../types/appError";
import { LoginInfo } from "../../types/infoSchema";
import { AppSuccess } from "../../types/succesType";
import bcrypt from "bcrypt";
import { Request, Response } from "express";



const login = async (
  request: Request<undefined, unknown, LoginInfo>,
  response: Response
) => {
  const { body } = request;
  console.log("dati", body);

  const user = await Users.findOne({
    where: {
      email: body.email,
    },
  });

  if (user === null) {
    throw new AppError(
      responseStatus.BAD_REQUEST,
      ErrorCodes.INVALID_CREDENTIALS,
      "Credenziali non valide"
    );
  }

  const hashedPassword = user.password;
  const isCorrect = await bcrypt.compare(body.password, hashedPassword);

  if (!isCorrect) {
    throw new AppError(
      responseStatus.BAD_REQUEST,
      ErrorCodes.INVALID_CREDENTIALS,
      "Credenziali non valide"
    );
  }

  request.session.id!= user.id;
  request.session.email = user.email!;
  request.session.username = user.username;

  // Crea la sessione
  const sessionManager = SessionManager.getInstance();
  const sessionData: SessionData = {
    id: user.id,
    email: user.email!,
    username: user.username,
    cookie: new Cookie(),
  };

  // Salva la sessione
  sessionManager.createSession(sessionData);

  AppSuccess.getInstance().successResponse(response, "LOGIN_SUCCESS",responseStatus.OK, {id : user.id, username : user.username, email : user.email} )

  return;

};

export default login;

//tag nfg per page personale
