import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "This is not a valid email."
  }),
  password: z.string()
    .min(8, {
      message: "The password must be at least 8 characters long."
    }).max(64, {
      message: "The password must be at most 64 characters long."
    })
})
export const registerSchema = z.object({
  username: z.string().min(3,
    { message: "The username must be at least 3 characters long." }
  ).max(16, {
    message: "The username must be at most 16 characters long."
  }).regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,15}$/, {
    message: "The username must contain only alphanumeric characters, underscores or dots."
  }), // username parsing regex
  email: z.string().email({
    message: "This is not a valid email."
  }),
  password: z.string()
    .min(8, {
      message: "The password must be at least 8 characters long."
    }).max(64, {
      message: "The password must be at most 64 characters long."
    }),
  cfpassword: z.string()
}).refine((data) => data.password === data.cfpassword, {
  message: "Passwords don't match",
  path: ["password", "cfpassword"]
})