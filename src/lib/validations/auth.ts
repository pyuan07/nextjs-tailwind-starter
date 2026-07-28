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

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

/**
 * Server-side schema for PATCH /api/user/profile.
 *
 * Unlike profileUpdateSchema (which backs a full form and requires both
 * fields), a PATCH carries only the fields being changed — so every field is
 * optional. At least one must be present, otherwise the request is a no-op.
 */
export const profilePatchSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
  })
  .refine(data => Object.values(data).some(value => value !== undefined), {
    message: 'No fields to update',
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
