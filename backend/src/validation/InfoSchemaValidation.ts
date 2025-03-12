import { z } from "zod";

export const LoginSchemaZod = z.object({
  email:z.string().email(),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%^&*(),.?":{}|<>]/)
});

export const RegisterSchemaZod = z.object({
  email: z.string().email({message: "Invalid email address"}).max(49),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%^&*(),.?":{}|<>]/),
  username: z.string().max(49).min(5),
});

export const PasswordSchemaZod = z.object({
  password: z.string().min(6, { message: "Must be 6 or more characters long" }).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%^&*(),.?":{}|<>]/)
})