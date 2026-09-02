
import { password } from "bun";
import z, { email } from "zod";
import { Status } from "./generated/prisma/enums";

export const SignupSchema = z.object({
    email: z.email(),
    username: z.string(),
    password:z.string()
})

export const SigninSchema = z.object({
    email:z.email(),
    password:z.string()
})

export const TodoSchema = z.object({
    title: z.string(),
    description:z.string().optional(),
    Status: z.enum(["COMPLETED", "INCOMPLETED"]).optional()
})