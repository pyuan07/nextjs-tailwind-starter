import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'validation.email.invalid' }),
  password: z.string().min(8, { message: 'validation.password.minLength' }),
  remember: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'validation.name.minLength' }),
    email: z.string().email({ message: 'validation.email.invalid' }),
    password: z
      .string()
      .min(8, { message: 'validation.password.minLength' })
      .regex(/[A-Z]/, { message: 'validation.password.uppercase' })
      .regex(/[0-9]/, { message: 'validation.password.number' }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'validation.terms.required',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validation.password.mismatch',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
