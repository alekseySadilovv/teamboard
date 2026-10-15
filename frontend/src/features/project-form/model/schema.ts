import { z } from 'zod'
import { projectStatuses, type Project, type ProjectInput } from '../../../entities/project'

const tagPattern = /^[0-9a-zа-яё+#._-]+$/i

export const roleSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .trim()
    .min(2, 'Название роли — минимум 2 символа')
    .max(80, 'Название роли — максимум 80 символов'),
  description: z.string().trim().max(300, 'Требования — максимум 300 символов'),
  isOpen: z.boolean(),
})

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(120, 'Название должно быть не длиннее 120 символов'),
  summary: z
    .string()
    .trim()
    .min(10, 'Краткое описание — минимум 10 символов')
    .max(300, 'Краткое описание — максимум 300 символов'),
  description: z.string().trim().max(5000, 'Описание — максимум 5000 символов'),
  status: z.enum(projectStatuses),
  tags: z
    .array(
      z
        .string()
        .trim()
        .max(40, 'Тег — максимум 40 символов')
        .regex(tagPattern, 'Тег может содержать только буквы, цифры и символы + # . _ -'),
    )
    .max(10, 'Можно указать не более 10 тегов'),
  roles: z.array(roleSchema).max(20, 'Не более 20 ролей'),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export const emptyRole: ProjectFormValues['roles'][number] = { title: '', description: '', isOpen: true }

export function toFormValues(project?: Project): ProjectFormValues {
  if (!project) {
    return { title: '', summary: '', description: '', status: 'recruiting', tags: [], roles: [{ ...emptyRole }] }
  }
  return {
    title: project.title,
    summary: project.summary,
    description: project.description,
    status: project.status,
    tags: project.tags,
    roles: project.roles.map(({ id, title, description, isOpen }) => ({ id, title, description, isOpen })),
  }
}

export function toProjectInput(values: ProjectFormValues): ProjectInput {
  return {
    ...values,
    tags: [...new Set(values.tags.map((tag) => tag.toLowerCase().replace(/^#/, '')))],
  }
}
