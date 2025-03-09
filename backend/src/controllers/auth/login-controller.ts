import { Request, Response } from "express";
import { LoginInfo } from "../../types/infoSchema";
import User from "../../model/userSchema";
import { AppError } from "../../types/appError";
import { responseStatus } from "../../constants/statusEnum";
import { ErrorCodes } from "../../constants/errorCodes";
import bcrypt from "bcrypt";


const login = async (
  request: Request<undefined, unknown, LoginInfo>,
  response: Response
) => {
  const { body } = request;
  console.log("Dati del body Login", body);
  const user = await User.find();
  if (user === null) {
    throw new AppError(
      responseStatus.BAD_REQUEST,
      ErrorCodes.INVALID_CREDENTIALS,
      "Credenziali non valide"
    );
  }

  const hashedPassword = body.password;
  const isCorrect = await bcrypt.compare(body.password, hashedPassword);

  if (!isCorrect) {
    throw new AppError(
      responseStatus.BAD_REQUEST,
      ErrorCodes.INVALID_CREDENTIALS,
      "Credenziali non valide"
    );
  }

};

export default login;
