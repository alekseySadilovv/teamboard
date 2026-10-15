export type MockProjectStatus = 'idea' | 'recruiting' | 'in_progress' | 'completed'
export type MockApplicationStatus = 'pending' | 'accepted' | 'rejected'

export interface UserRow {
  id: number
  username: string
  email: string
  fullName: string
  bio: string
  skills: string[]
  createdAt: string
}

export interface RoleRow {
  id: number
  projectId: number
  title: string
  description: string
  isOpen: boolean
}

export interface MemberRow {
  id: number
  projectId: number
  userId: number
  roleId: number | null
  roleTitle: string
  joinedAt: string
}

export interface ProjectRow {
  id: number
  title: string
  summary: string
  description: string
  status: MockProjectStatus
  tags: string[]
  ownerId: number
  createdAt: string
  updatedAt: string
}

export interface ApplicationRow {
  id: number
  projectId: number
  roleId: number
  userId: number
  message: string
  status: MockApplicationStatus
  createdAt: string
  updatedAt: string
}

const date = (value: string) => new Date(value).toISOString()

export const db = {
  users: [
    { id: 1, username: 'asadilov', email: 'asadilov@example.com', fullName: 'Алексей Садилов', bio: 'Студент МТУСИ, frontend-разработчик.', skills: ['React', 'TypeScript', 'Python'], createdAt: date('2026-09-01') },
    { id: 2, username: 'mpetrova', email: 'mpetrova@example.com', fullName: 'Мария Петрова', bio: 'Backend-разработчик, люблю базы данных.', skills: ['Python', 'FastAPI', 'PostgreSQL'], createdAt: date('2026-09-01') },
    { id: 3, username: 'ismirnov', email: 'ismirnov@example.com', fullName: 'Иван Смирнов', bio: 'Занимаюсь машинным обучением.', skills: ['PyTorch', 'OpenCV'], createdAt: date('2026-09-02') },
    { id: 4, username: 'okuznetsova', email: 'okuznetsova@example.com', fullName: 'Ольга Кузнецова', bio: 'Дизайнер интерфейсов и иллюстратор.', skills: ['Figma', 'Pixel art'], createdAt: date('2026-09-03') },
    { id: 5, username: 'dorlov', email: 'dorlov@example.com', fullName: 'Дмитрий Орлов', bio: 'Fullstack, делаю учебные платформы.', skills: ['React', 'Node.js', 'SQL'], createdAt: date('2026-09-04') },
  ] as UserRow[],
  projects: [
    { id: 1, title: 'Расписание МТУСИ', summary: 'Мобильное приложение с расписанием занятий и уведомлениями о переносах.', description: 'Поиск по группе и преподавателю, push-уведомления об изменениях, офлайн-режим. Backend на FastAPI уже частично готов.', status: 'recruiting', tags: ['fastapi', 'mobile', 'python'], ownerId: 1, createdAt: date('2026-09-02'), updatedAt: date('2026-09-02') },
    { id: 2, title: 'Распознавание рукописных конспектов', summary: 'ML-сервис, который превращает фото конспекта в структурированный текст.', description: 'Обучаем модель распознавания рукописного текста на русском языке и делаем веб-интерфейс для загрузки фотографий.', status: 'recruiting', tags: ['ml', 'python', 'web'], ownerId: 3, createdAt: date('2026-09-10'), updatedAt: date('2026-09-10') },
    { id: 3, title: 'Пиксельный платформер', summary: 'Небольшая 2D-игра для участия в студенческом геймджеме.', description: 'Делаем платформер на Godot с ручной пиксельной графикой. Сюжет и механики уже продуманы.', status: 'in_progress', tags: ['design', 'gamedev'], ownerId: 4, createdAt: date('2026-08-21'), updatedAt: date('2026-08-21') },
    { id: 4, title: 'Умная теплица', summary: 'IoT-система мониторинга влажности и температуры с веб-панелью.', description: 'Датчики на ESP32 отправляют данные на сервер, а веб-панель показывает графики и присылает уведомления.', status: 'idea', tags: ['iot', 'web'], ownerId: 2, createdAt: date('2026-10-01'), updatedAt: date('2026-10-01') },
    { id: 5, title: 'Тренажёр по SQL', summary: 'Веб-платформа с интерактивными задачами по SQL для первокурсников.', description: 'Задачи с автоматической проверкой запросов и рейтингом. Первая версия уже используется на паре.', status: 'completed', tags: ['education', 'react', 'web'], ownerId: 5, createdAt: date('2026-05-14'), updatedAt: date('2026-05-14') },
  ] as ProjectRow[],
  roles: [
    { id: 1, projectId: 1, title: 'Мобильный разработчик', description: 'React Native или Flutter', isOpen: true },
    { id: 2, projectId: 1, title: 'UI/UX дизайнер', description: 'Макеты основных экранов в Figma', isOpen: true },
    { id: 3, projectId: 2, title: 'ML-инженер', description: 'PyTorch, опыт с OCR приветствуется', isOpen: true },
    { id: 4, projectId: 2, title: 'Frontend-разработчик', description: 'React + TypeScript', isOpen: true },
    { id: 5, projectId: 3, title: 'Художник', description: 'Пиксель-арт, анимация персонажей', isOpen: false },
    { id: 6, projectId: 5, title: 'Frontend-разработчик', description: 'React', isOpen: false },
  ] as RoleRow[],
  members: [
    { id: 1, projectId: 1, userId: 1, roleId: null, roleTitle: 'Автор проекта', joinedAt: date('2026-09-02') },
    { id: 2, projectId: 2, userId: 3, roleId: null, roleTitle: 'Автор проекта', joinedAt: date('2026-09-10') },
    { id: 3, projectId: 3, userId: 4, roleId: null, roleTitle: 'Автор проекта', joinedAt: date('2026-08-21') },
    { id: 4, projectId: 3, userId: 5, roleId: 5, roleTitle: 'Художник', joinedAt: date('2026-08-25') },
    { id: 5, projectId: 4, userId: 2, roleId: null, roleTitle: 'Автор проекта', joinedAt: date('2026-10-01') },
    { id: 6, projectId: 5, userId: 5, roleId: null, roleTitle: 'Автор проекта', joinedAt: date('2026-05-14') },
    { id: 7, projectId: 5, userId: 1, roleId: 6, roleTitle: 'Frontend-разработчик', joinedAt: date('2026-05-20') },
  ] as MemberRow[],
  applications: [
    { id: 1, projectId: 1, roleId: 1, userId: 2, message: 'Писала на Flutter, могу взять мобильную часть.', status: 'pending', createdAt: date('2026-10-08'), updatedAt: date('2026-10-08') },
    { id: 2, projectId: 1, roleId: 2, userId: 4, message: 'Покажу портфолио мобильных приложений.', status: 'pending', createdAt: date('2026-10-09'), updatedAt: date('2026-10-09') },
    { id: 3, projectId: 2, roleId: 4, userId: 1, message: 'Готов делать интерфейс загрузки фото.', status: 'pending', createdAt: date('2026-10-05'), updatedAt: date('2026-10-05') },
  ] as ApplicationRow[],
}

export function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1
}
