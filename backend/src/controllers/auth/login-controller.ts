import { Request, Response } from "express";
import { LoginInfo } from "../../types/infoSchema";

const login = async (
  request: Request<undefined, unknown, LoginInfo>,
  response: Response
) => {
  const { body } = request;
  console.log("Dati del body Login", body);
  
};

export default login;
