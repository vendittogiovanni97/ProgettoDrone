import { z } from "zod";

export const LoginSchemaZod = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchemaZod = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string(),
});
