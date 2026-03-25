import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DonationProvider } from './context/DonationContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.tsx'

import PublicPortal from './pages/transparency/PublicPortal'
import SupplierWorkbench from './pages/dashboards/SupplierWorkbench'
import VerifierPortal from './pages/dashboards/VerifierPortal'
import DonorDashboard from './pages/dashboards/DonorDashboard'
import ErrorBoundary from './components/ErrorBoundary'

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

// Admin imports
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import WeeksManagement from './pages/admin/WeeksManagement'
import SuppliersManagement from './pages/admin/SuppliersManagement'
import DonationsOverview from './pages/admin/DonationsOverview'
import SchoolsManagement from './pages/admin/SchoolsManagement'
import SchoolImportManagement from './pages/admin/SchoolImportManagement'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
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
      { path: 'transparency', element: <PublicPortal /> },
      { path: 'dashboard/supplier', element: <SupplierWorkbench /> },
      { path: 'dashboard/verifier', element: <VerifierPortal /> },
      { path: 'dashboard/donor', element: <DonorDashboard /> },
    ],
  },
  // Admin routes with separate layout
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin-panel',
    element: <AdminLayout />,
    children: [
      { path: 'weeks', element: <WeeksManagement /> },
      { path: 'suppliers', element: <SuppliersManagement /> },
      { path: 'donations', element: <DonationsOverview /> },
      { path: 'schools', element: <SchoolsManagement /> },
      { path: 'school-import', element: <SchoolImportManagement /> },
      { path: 'users', element: <div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1><p className="text-gray-600">Coming soon...</p></div> },
      { path: 'settings', element: <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Coming soon...</p></div> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DonationProvider>
        <RouterProvider router={router} />
      </DonationProvider>
    </AuthProvider>
  </StrictMode>,
)
