import { z } from "zod";

export const LoginSchemaZod = {
  email: z.string().email(),
  password : z.string().min(6)
}

export const RegisterSchemaZod = {
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(5)
}