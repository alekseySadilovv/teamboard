import { ApiError } from '../errors'
import type { RequestOptions } from '../types'
import { db, nextId, type MockApplicationStatus, type MockProjectStatus, type ProjectRow, type UserRow } from './data'

const LATENCY_MS = 450
const SESSION_KEY = 'teamboard.mock.session'
const OWNER_ROLE_TITLE = 'Автор проекта'

type Body = Record<string, unknown>
type Handler = (match: RegExpMatchArray, options: RequestOptions) => unknown

function readSession(): number | null {
  try {
    const value = sessionStorage.getItem(SESSION_KEY)
    return value === null ? 1 : value === '' ? null : Number(value)
  } catch {
    return 1
  }
}

let currentUserId: number | null = readSession()

function setSession(userId: number | null) {
  currentUserId = userId
  try {
    sessionStorage.setItem(SESSION_KEY, userId === null ? '' : String(userId))
  } catch {
    // sessionStorage недоступен — сессия живёт до перезагрузки
  }
}

const now = () => new Date().toISOString()

function requireUser(): UserRow {
  const user = db.users.find((item) => item.id === currentUserId)
  if (!user) throw new ApiError(401, 'Требуется вход в систему')
  return user
}

function findProject(id: number): ProjectRow {
  const project = db.projects.find((item) => item.id === id)
  if (!project) throw new ApiError(404, 'Проект не найден')
  return project
}

function requireOwner(project: ProjectRow, user: UserRow) {
  if (project.ownerId !== user.id) throw new ApiError(403, 'Изменять проект может только его автор')
}

const userShort = (id: number) => {
  const user = db.users.find((item) => item.id === id)!
  return { id: user.id, username: user.username, fullName: user.fullName }
}

const userDto = ({ password: _password, ...user }: UserRow) => user

function projectDto(project: ProjectRow) {
  const roles = db.roles
    .filter((role) => role.projectId === project.id)
    .map(({ projectId: _projectId, ...role }) => role)
  return {
    ...project,
    tags: [...project.tags].sort(),
    owner: userShort(project.ownerId),
    roles,
    members: db.members
      .filter((member) => member.projectId === project.id)
      .map((member) => ({ id: member.id, user: userShort(member.userId), roleTitle: member.roleTitle, joinedAt: member.joinedAt })),
    openRolesCount: roles.filter((role) => role.isOpen).length,
  }
}

function applicationDto(application: (typeof db.applications)[number]) {
  return {
    id: application.id,
    projectId: application.projectId,
    projectTitle: findProject(application.projectId).title,
    roleId: application.roleId,
    roleTitle: db.roles.find((role) => role.id === application.roleId)?.title ?? '',
    user: userShort(application.userId),
    message: application.message,
    status: application.status,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  }
}

function validateProject(body: Body, partial: boolean) {
  const errors: { field: string; message: string }[] = []
  const title = body.title as string | undefined
  const summary = body.summary as string | undefined
  if ((!partial || title !== undefined) && (!title || title.trim().length < 3)) {
    errors.push({ field: 'title', message: 'Слишком короткое значение (минимум 3 симв.)' })
  }
  if ((!partial || summary !== undefined) && (!summary || summary.trim().length < 10)) {
    errors.push({ field: 'summary', message: 'Слишком короткое значение (минимум 10 симв.)' })
  }
  if (errors.length) throw new ApiError(422, 'Ошибка валидации данных', errors)
}

function normalizeTags(tags: unknown): string[] {
  return [...new Set((tags as string[]).map((tag) => tag.trim().toLowerCase().replace(/^#/, '')).filter(Boolean))]
}

function syncRoles(projectId: number, roles: Body[]) {
  const keepIds = new Set<number>()
  for (const item of roles) {
    if (item.id) {
      const role = db.roles.find((r) => r.id === item.id && r.projectId === projectId)
      if (!role) throw new ApiError(400, `Роль с id=${item.id} не относится к этому проекту`)
      Object.assign(role, { title: item.title, description: item.description ?? '', isOpen: item.isOpen ?? true })
      keepIds.add(role.id)
    } else {
      const id = nextId(db.roles)
      db.roles.push({ id, projectId, title: String(item.title), description: String(item.description ?? ''), isOpen: Boolean(item.isOpen ?? true) })
      keepIds.add(id)
    }
  }
  db.roles = db.roles.filter((role) => role.projectId !== projectId || keepIds.has(role.id))
}

const routes: [string, RegExp, Handler][] = [
  ['POST', /^\/auth\/login$/, (_, { body }) => {
    const { email, password } = body as Body
    const user = db.users.find((item) => item.email === String(email).toLowerCase())
    if (!user || user.password !== password) throw new ApiError(401, 'Неверный email или пароль')
    setSession(user.id)
    return { user: userDto(user) }
  }],
  ['POST', /^\/auth\/register$/, (_, { body }) => {
    const data = body as Body
    const email = String(data.email).toLowerCase()
    if (db.users.some((item) => item.email === email)) throw new ApiError(409, 'Пользователь с таким email уже существует')
    if (db.users.some((item) => item.username.toLowerCase() === String(data.username).toLowerCase())) {
      throw new ApiError(409, 'Пользователь с таким именем уже существует')
    }
    const user: UserRow = {
      id: nextId(db.users),
      username: String(data.username),
      email,
      fullName: String(data.fullName),
      bio: '',
      skills: [],
      password: String(data.password),
      createdAt: now(),
    }
    db.users.push(user)
    setSession(user.id)
    return { user: userDto(user) }
  }],
  ['POST', /^\/auth\/logout$/, () => {
    setSession(null)
  }],
  ['GET', /^\/users\/me$/, () => userDto(requireUser())],
  ['PATCH', /^\/users\/me$/, (_, { body }) => {
    const user = requireUser()
    Object.assign(user, body)
    return userDto(user)
  }],
  ['GET', /^\/tags$/, () => {
    const counts = new Map<string, number>()
    db.projects.forEach((project) => project.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)))
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, projectCount], index) => ({ id: index + 1, name, projectCount }))
  }],
  ['GET', /^\/projects$/, (_, { params = {} }) => {
    const search = String(params.search ?? '').trim().toLowerCase()
    const tags = (params.tags as string[] | undefined) ?? []
    let items = db.projects.filter((project) => {
      const text = `${project.title} ${project.summary} ${project.description}`.toLowerCase()
      const openRoles = db.roles.some((role) => role.projectId === project.id && role.isOpen)
      return (
        (!search || text.includes(search)) &&
        tags.every((tag) => project.tags.includes(tag)) &&
        (!params.status || project.status === params.status) &&
        (params.hasOpenRoles === undefined || openRoles === params.hasOpenRoles) &&
        (!params.ownerId || project.ownerId === Number(params.ownerId)) &&
        (!params.memberId || db.members.some((m) => m.projectId === project.id && m.userId === Number(params.memberId)))
      )
    })
    items = items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const offset = Number(params.offset ?? 0)
    const limit = Number(params.limit ?? 20)
    return { items: items.slice(offset, offset + limit).map(projectDto), total: items.length }
  }],
  ['GET', /^\/projects\/(\d+)$/, ([, id]) => projectDto(findProject(Number(id)))],
  ['POST', /^\/projects$/, (_, { body }) => {
    const user = requireUser()
    const data = body as Body
    validateProject(data, false)
    const project: ProjectRow = {
      id: nextId(db.projects),
      title: String(data.title).trim(),
      summary: String(data.summary).trim(),
      description: String(data.description ?? ''),
      status: (data.status as MockProjectStatus) ?? 'recruiting',
      tags: normalizeTags(data.tags ?? []),
      ownerId: user.id,
      createdAt: now(),
      updatedAt: now(),
    }
    db.projects.push(project)
    db.members.push({ id: nextId(db.members), projectId: project.id, userId: user.id, roleId: null, roleTitle: OWNER_ROLE_TITLE, joinedAt: now() })
    syncRoles(project.id, (data.roles as Body[]) ?? [])
    return projectDto(project)
  }],
  ['PATCH', /^\/projects\/(\d+)$/, ([, id], { body }) => {
    const user = requireUser()
    const project = findProject(Number(id))
    requireOwner(project, user)
    const data = body as Body
    validateProject(data, true)
    const { roles, tags, ...fields } = data
    Object.assign(project, fields, { updatedAt: now() })
    if (tags) project.tags = normalizeTags(tags)
    if (roles) syncRoles(project.id, roles as Body[])
    return projectDto(project)
  }],
  ['DELETE', /^\/projects\/(\d+)$/, ([, id]) => {
    const user = requireUser()
    const project = findProject(Number(id))
    requireOwner(project, user)
    db.projects = db.projects.filter((item) => item.id !== project.id)
    db.roles = db.roles.filter((item) => item.projectId !== project.id)
    db.members = db.members.filter((item) => item.projectId !== project.id)
    db.applications = db.applications.filter((item) => item.projectId !== project.id)
  }],
  ['GET', /^\/applications\/my$/, () => {
    const user = requireUser()
    return db.applications
      .filter((item) => item.userId === user.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(applicationDto)
  }],
  ['GET', /^\/applications\/incoming$/, () => {
    const user = requireUser()
    const own = new Set(db.projects.filter((p) => p.ownerId === user.id).map((p) => p.id))
    return db.applications
      .filter((item) => own.has(item.projectId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(applicationDto)
  }],
  ['POST', /^\/applications$/, (_, { body }) => {
    const user = requireUser()
    const { roleId, message } = body as Body
    const role = db.roles.find((item) => item.id === roleId)
    if (!role) throw new ApiError(404, 'Роль не найдена')
    const project = findProject(role.projectId)
    if (project.ownerId === user.id) throw new ApiError(400, 'Нельзя подать заявку в собственный проект')
    if (!role.isOpen) throw new ApiError(400, 'Набор на эту роль закрыт')
    if (db.members.some((m) => m.projectId === project.id && m.userId === user.id)) {
      throw new ApiError(400, 'Вы уже состоите в команде этого проекта')
    }
    if (db.applications.some((a) => a.roleId === role.id && a.userId === user.id && a.status === 'pending')) {
      throw new ApiError(409, 'Заявка на эту роль уже отправлена и ожидает решения')
    }
    const application = {
      id: nextId(db.applications),
      projectId: project.id,
      roleId: role.id,
      userId: user.id,
      message: String(message ?? '').trim(),
      status: 'pending' as MockApplicationStatus,
      createdAt: now(),
      updatedAt: now(),
    }
    db.applications.push(application)
    return applicationDto(application)
  }],
  ['PATCH', /^\/applications\/(\d+)$/, ([, id], { body }) => {
    const user = requireUser()
    const application = db.applications.find((item) => item.id === Number(id))
    if (!application) throw new ApiError(404, 'Заявка не найдена')
    requireOwner(findProject(application.projectId), user)
    if (application.status !== 'pending') throw new ApiError(400, 'Заявка уже рассмотрена')
    const status = (body as Body).status as MockApplicationStatus
    if (status === 'accepted') {
      const role = db.roles.find((item) => item.id === application.roleId)!
      if (!role.isOpen) throw new ApiError(400, 'Роль уже занята')
      db.members.push({ id: nextId(db.members), projectId: application.projectId, userId: application.userId, roleId: role.id, roleTitle: role.title, joinedAt: now() })
      role.isOpen = false
      db.applications
        .filter((item) => item.roleId === role.id && item.id !== application.id && item.status === 'pending')
        .forEach((item) => (item.status = 'rejected'))
    }
    Object.assign(application, { status, updatedAt: now() })
    return applicationDto(application)
  }],
  ['DELETE', /^\/applications\/(\d+)$/, ([, id]) => {
    const user = requireUser()
    const application = db.applications.find((item) => item.id === Number(id))
    if (!application) throw new ApiError(404, 'Заявка не найдена')
    if (application.userId !== user.id) throw new ApiError(403, 'Отозвать заявку может только её автор')
    if (application.status !== 'pending') throw new ApiError(400, 'Отозвать можно только заявку на рассмотрении')
    db.applications = db.applications.filter((item) => item.id !== application.id)
  }],
]

export async function handleMockRequest(method: string, path: string, options: RequestOptions): Promise<unknown> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
  for (const [routeMethod, pattern, handler] of routes) {
    const match = path.match(pattern)
    if (routeMethod === method && match) {
      return structuredClone(handler(match, options))
    }
  }
  throw new ApiError(404, 'Ресурс не найден')
}
