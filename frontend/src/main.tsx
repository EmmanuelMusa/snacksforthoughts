import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DonationProvider } from './context/DonationContext'
import './index.css'
import App from './App.tsx'

import HomePage from './pages/HomePage'
import SchoolsPage from './pages/SchoolsPage'
import VendorsPage from './pages/VendorsPage'
import DonatePage from './pages/DonatePage'
import AboutPage from './pages/AboutPage'
import SchoolDetailPage from './pages/SchoolDetailPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import AdminVendorsPage from './pages/AdminVendorsPage'
import PartnersPage from './pages/PartnersPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'schools', element: <SchoolsPage /> },
      { path: 'schools/:id', element: <SchoolDetailPage /> },
      { path: 'vendors', element: <VendorsPage /> },
      { path: 'donate', element: <DonatePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'partners', element: <PartnersPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'admin/vendors', element: <AdminVendorsPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DonationProvider>
      <RouterProvider router={router} />
    </DonationProvider>
  </StrictMode>,
)
