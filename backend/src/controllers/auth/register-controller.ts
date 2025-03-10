import { Request, Response } from "express";
import { RegisterInfo } from "../../types/infoSchema";
import { RegisterSchemaZod } from "../../validation/InfoSchemaValidation";
import { AppError } from "../../types/appError";
import { responseStatus } from "../../constants/statusEnum";
import bcrypt from "bcrypt";
import User from "../../model/userSchema";
import { AppSuccess } from "../../types/succesType";
import { SuccessCodes } from "../../constants/succesCode";
import { ErrorCodes } from "../../constants/errorCodes";

const register = async (
  request: Request<undefined, unknown, RegisterInfo>,
  response: Response
) => {
  const body = request.body;
  console.log("Ricevuto body", body);

  const verifiedBody = RegisterSchemaZod.safeParse(body);

  if (verifiedBody.success === false) {
    throw new AppError(
      responseStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      "Dati di registraziobne non validi"
    );
  }

  const passwordHash = await bcrypt.hash(verifiedBody.data.password, 12);
  try {
    const newUser = await User.create({
      data: {
        email: verifiedBody.data.email,
        username: verifiedBody.data.username,
        password: passwordHash,
      },
    });

    AppSuccess.getInstance().successResponse(
      response,
      SuccessCodes.USER_REGISTERED,
      responseStatus.OK,
      {
       id: newUser.id
      }
    );
    return;
  } catch (error) {
    console.error(error);
    throw new AppError(
      responseStatus.CONFLICT,
      ErrorCodes.DUPLICATE_ENTITY,
      "Email or Username already exists"
    );
  }
};

export default register;
