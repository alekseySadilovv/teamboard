export type ProjectStatus = 'idea' | 'recruiting' | 'in_progress' | 'completed'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export interface User {
  id: number
  username: string
  fullName: string
  email: string
  bio: string
  skills: string[]
}

export interface Role {
  id: number
  title: string
  description: string
  isOpen: boolean
}

export interface Member {
  userId: number
  username: string
  fullName: string
  roleTitle: string
}

export interface Project {
  id: number
  title: string
  summary: string
  description: string
  status: ProjectStatus
  tags: string[]
  ownerId: number
  ownerName: string
  roles: Role[]
  members: Member[]
  createdAt: string
}

export interface Application {
  id: number
  projectId: number
  projectTitle: string
  roleTitle: string
  applicantName: string
  message: string
  status: ApplicationStatus
  createdAt: string
}

export const statusLabels: Record<ProjectStatus, string> = {
  idea: 'Идея',
  recruiting: 'Ищем роли',
  in_progress: 'В работе',
  completed: 'Завершён',
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  pending: 'На рассмотрении',
  accepted: 'Принята',
  rejected: 'Отклонена',
}

export const currentUser: User = {
  id: 1,
  username: 'asadilov',
  fullName: 'Алексей Садилов',
  email: 'asadilov@example.com',
  bio: 'Студент МТУСИ, frontend-разработчик. Интересуюсь веб-приложениями и командной разработкой.',
  skills: ['React', 'TypeScript', 'Python'],
}

export const tags = ['web', 'mobile', 'ml', 'gamedev', 'python', 'react', 'fastapi', 'design', 'iot', 'education']

export const projects: Project[] = [
  {
    id: 1,
    title: 'Расписание МТУСИ',
    summary: 'Мобильное приложение с расписанием занятий и уведомлениями о переносах.',
    description:
      'Хотим сделать удобное приложение с расписанием для студентов: поиск по группе и преподавателю, push-уведомления об изменениях, офлайн-режим. Backend на FastAPI уже частично готов.',
    status: 'recruiting',
    tags: ['mobile', 'fastapi', 'python'],
    ownerId: 1,
    ownerName: 'Алексей Садилов',
    roles: [
      { id: 1, title: 'Мобильный разработчик', description: 'React Native или Flutter', isOpen: true },
      { id: 2, title: 'UI/UX дизайнер', description: 'Макеты основных экранов в Figma', isOpen: true },
      { id: 3, title: 'Backend-разработчик', description: 'FastAPI, PostgreSQL', isOpen: false },
    ],
    members: [
      { userId: 1, username: 'asadilov', fullName: 'Алексей Садилов', roleTitle: 'Владелец' },
      { userId: 2, username: 'mpetrova', fullName: 'Мария Петрова', roleTitle: 'Backend-разработчик' },
    ],
    createdAt: '2026-09-02',
  },
  {
    id: 2,
    title: 'Распознавание рукописных конспектов',
    summary: 'ML-сервис, который превращает фото конспекта в структурированный текст.',
    description:
      'Обучаем модель распознавания рукописного текста на русском языке и делаем веб-интерфейс для загрузки фотографий. Нужны люди, которые разбираются в компьютерном зрении.',
    status: 'recruiting',
    tags: ['ml', 'python', 'web'],
    ownerId: 3,
    ownerName: 'Иван Смирнов',
    roles: [
      { id: 4, title: 'ML-инженер', description: 'PyTorch, опыт с OCR приветствуется', isOpen: true },
      { id: 5, title: 'Frontend-разработчик', description: 'React + TypeScript', isOpen: true },
    ],
    members: [{ userId: 3, username: 'ismirnov', fullName: 'Иван Смирнов', roleTitle: 'Владелец' }],
    createdAt: '2026-09-10',
  },
  {
    id: 3,
    title: 'Пиксельный платформер',
    summary: 'Небольшая 2D-игра для участия в студенческом геймджеме.',
    description: 'Делаем платформер на Godot с ручной пиксельной графикой. Сюжет и механики уже продуманы.',
    status: 'in_progress',
    tags: ['gamedev', 'design'],
    ownerId: 4,
    ownerName: 'Ольга Кузнецова',
    roles: [{ id: 6, title: 'Художник', description: 'Пиксель-арт, анимация персонажей', isOpen: false }],
    members: [
      { userId: 4, username: 'okuznetsova', fullName: 'Ольга Кузнецова', roleTitle: 'Владелец' },
      { userId: 5, username: 'dorlov', fullName: 'Дмитрий Орлов', roleTitle: 'Художник' },
    ],
    createdAt: '2026-08-21',
  },
  {
    id: 4,
    title: 'Умная теплица',
    summary: 'IoT-система мониторинга влажности и температуры с веб-панелью.',
    description: 'Идея: датчики на ESP32 отправляют данные на сервер, а веб-панель показывает графики и присылает уведомления.',
    status: 'idea',
    tags: ['iot', 'web'],
    ownerId: 2,
    ownerName: 'Мария Петрова',
    roles: [],
    members: [{ userId: 2, username: 'mpetrova', fullName: 'Мария Петрова', roleTitle: 'Владелец' }],
    createdAt: '2026-10-01',
  },
  {
    id: 5,
    title: 'Тренажёр по SQL',
    summary: 'Веб-платформа с интерактивными задачами по SQL для первокурсников.',
    description: 'Платформа с задачами, автоматической проверкой запросов и рейтингом. Первая версия уже используется на паре.',
    status: 'completed',
    tags: ['education', 'web', 'react'],
    ownerId: 5,
    ownerName: 'Дмитрий Орлов',
    roles: [],
    members: [
      { userId: 5, username: 'dorlov', fullName: 'Дмитрий Орлов', roleTitle: 'Владелец' },
      { userId: 1, username: 'asadilov', fullName: 'Алексей Садилов', roleTitle: 'Frontend-разработчик' },
    ],
    createdAt: '2026-05-14',
  },
]

export const myApplications: Application[] = [
  {
    id: 1,
    projectId: 2,
    projectTitle: 'Распознавание рукописных конспектов',
    roleTitle: 'Frontend-разработчик',
    applicantName: 'Алексей Садилов',
    message: 'Есть опыт с React и TypeScript, готов делать интерфейс загрузки фото.',
    status: 'pending',
    createdAt: '2026-10-05',
  },
  {
    id: 2,
    projectId: 3,
    projectTitle: 'Пиксельный платформер',
    roleTitle: 'Художник',
    applicantName: 'Алексей Садилов',
    message: 'Немного рисую пиксель-арт, могу помочь с фонами.',
    status: 'rejected',
    createdAt: '2026-09-01',
  },
]

export const incomingApplications: Application[] = [
  {
    id: 3,
    projectId: 1,
    projectTitle: 'Расписание МТУСИ',
    roleTitle: 'Мобильный разработчик',
    applicantName: 'Иван Смирнов',
    message: 'Писал приложения на Flutter, могу взять мобильную часть.',
    status: 'pending',
    createdAt: '2026-10-08',
  },
  {
    id: 4,
    projectId: 1,
    projectTitle: 'Расписание МТУСИ',
    roleTitle: 'UI/UX дизайнер',
    applicantName: 'Ольга Кузнецова',
    message: 'Покажу портфолио, делала дизайн для двух мобильных приложений.',
    status: 'pending',
    createdAt: '2026-10-09',
  },
]
