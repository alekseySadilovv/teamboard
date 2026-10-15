import { createBrowserRouter } from 'react-router-dom'
import { ApplicationsPage } from '../pages/applications'
import { LoginPage, RegisterPage } from '../pages/auth'
import { NotFoundPage } from '../pages/not-found'
import { ProfilePage } from '../pages/profile'
import { ProjectDetailsPage } from '../pages/project-details'
import { ProjectEditPage } from '../pages/project-edit'
import { ProjectsPage } from '../pages/projects'
import { Layout } from './layout/Layout'
import { RequireAuth } from './RequireAuth'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <ProjectsPage /> },
      { path: '/projects/:id', element: <ProjectDetailsPage /> },
      {
        path: '/projects/new',
        element: (
          <RequireAuth>
            <ProjectEditPage />
          </RequireAuth>
        ),
      },
      {
        path: '/projects/:id/edit',
        element: (
          <RequireAuth>
            <ProjectEditPage />
          </RequireAuth>
        ),
      },
      {
        path: '/applications',
        element: (
          <RequireAuth>
            <ApplicationsPage />
          </RequireAuth>
        ),
      },
      {
        path: '/profile',
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        ),
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
