import { z } from 'zod'

const email = z.string().trim().min(1, 'Введите email').pipe(z.email('Некорректный адрес электронной почты'))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Введите пароль'),
})

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Минимум 2 символа').max(120, 'Максимум 120 символов'),
    username: z
      .string()
      .trim()
      .min(3, 'Минимум 3 символа')
      .max(50, 'Максимум 50 символов')
      .regex(/^[A-Za-z0-9_]+$/, 'Только латинские буквы, цифры и _'),
    email,
    password: z
      .string()
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .max(128, 'Пароль должен быть не длиннее 128 символов')
      .regex(/[A-Za-zА-Яа-я]/, 'Пароль должен содержать хотя бы одну букву')
      .regex(/\d/, 'Пароль должен содержать хотя бы одну цифру'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
