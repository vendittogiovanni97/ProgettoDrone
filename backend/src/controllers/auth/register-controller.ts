import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { RegisterInfo } from "../../types/infoSchema";
import { ErrorCodes } from "../../constants/errorCodes";
import dbClient from "../../db/dbConfig";
import { AppError } from "../../types/appError";
import { RegisterSchemaZod } from "../../validation/InfoSchemaValidation";

export const register = async (
  request: Request<undefined, unknown, RegisterInfo>,
  response: Response
) => {
  const body = request.body;
  console.log("Received body:", body);

  const verifiedBody = RegisterSchemaZod.safeParse(body);

  if (verifiedBody.success === false) {
    throw new AppError(400, ErrorCodes.INVALID_INPUT, "Dati di registrazione");
  }
  const passwordHash = await bcrypt.hash(verifiedBody.data.password, 12);

  try {
    const newUser = await dbClient.userAuthentication.create({
      data: {
        email: verifiedBody.data.email,
        username: verifiedBody.data.username,
        password: passwordHash,
      },
    });

    response.status(200).json({
      success: true,
      message: "Utente registrato con successo",
      userId: newUser.id,
    });
    return;
  } catch (error) {
    console.error(error);
    response.status(409).json("Email or username already exists");
  }
};
