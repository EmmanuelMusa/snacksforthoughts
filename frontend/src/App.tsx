import './App.css'
import Footer from './sections/Footer'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import { LogOut, User as UserIcon, Activity } from 'lucide-react'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Don't show navbar on home page, login/register, or dashboards
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  if (location.pathname === '/' || isAuthPage || isDashboard) return null;

  const handleLogout = () => {
    logout()
    navigate('/')
    closeMobileMenu()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/transparency", label: "Public Data" },
    { to: "/schools", label: "Schools" },
    { to: "/vendors", label: "Vendors" },
    { to: "/partners", label: "Partners" },
    { to: "/about", label: "About" }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 py-1 transition-all duration-300">
      <div className="w-full px-2 sm:px-6 lg:px-8">
        <div className="min-h-[64px] flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 sm:gap-3 font-bold text-gray-900 hover:opacity-80 transition-opacity min-w-0"
            onClick={closeMobileMenu}
          >
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <img 
                src="/images/Nigeria Logo.jpeg" 
                alt="Nigeria Logo" 
                className="h-7 w-auto sm:h-10 object-contain" 
              />
              <img 
                src="/images/Ministry Logo.png" 
                alt="Ministry Logo" 
                className="h-7 w-auto sm:h-10 object-contain hidden xs:block" 
              />
              <img 
                src="/images/NSIPA Logo.jpeg" 
                alt="NSIPA Logo" 
                className="h-7 w-auto sm:h-10 object-contain hidden md:block" 
              />
              <img 
                src="/images/rh_nhgsfp logo.png" 
                alt="NHGSFP Logo" 
                className="h-7 w-auto sm:h-10 object-contain hidden lg:block" 
              />
            </div>
            <div className="flex flex-col ml-1 min-w-0 flex-1">
              <span className="text-[10px] sm:text-sm font-black text-[#006D3E] leading-none tracking-tight uppercase font-display truncate">
                PBAT FEEDS
              </span>
              <span className="text-[8px] sm:text-xs font-black italic text-[#00A859] leading-tight tracking-tighter uppercase font-display truncate">
                "SNACKS FOR THOUGHT"
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                    ? 'text-green-600'
                    : 'text-gray-700 hover:text-green-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                        layoutId="activeIndicator"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
                <NavLink
                  to={
                    user.role === 'ADMIN' ? '/admin' :
                    user.role === 'SUPPLIER' ? '/dashboard/supplier' :
                    user.role === 'VERIFIER' ? '/dashboard/verifier' :
                    '/dashboard/donor'
                  }
                  className="px-4 py-2 text-sm font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  My Dashboard
                </NavLink>
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 rounded-full">
                    <UserIcon className="w-4 h-4 text-green-700" />
                  </div>
                  {user.name} <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">{user.role.replace('_', ' ')}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-gray-100 bg-white"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-colors duration-200 ${isActive
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                {/* Mobile Auth Buttons */}
                <div className="px-4 pt-4 border-t border-gray-100 space-y-2">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                        <NavLink
                          to={
                            user.role === 'ADMIN' ? '/admin' :
                            user.role === 'SUPPLIER' ? '/dashboard/supplier' :
                            user.role === 'VERIFIER' ? '/dashboard/verifier' :
                            '/dashboard/donor'
                          }
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 w-full px-4 py-3 text-base font-bold text-green-700 bg-green-50 rounded-lg mb-3"
                        >
                          <Activity className="w-5 h-5" />
                          Go to My Dashboard
                        </NavLink>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role.replace('_', ' ')}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-center text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block w-full px-4 py-3 text-center text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/register"
                        onClick={closeMobileMenu}
                        className="block w-full px-4 py-3 text-center text-base font-medium btn-primary"
                      >
                        Register
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}



function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const isNavbarHidden = location.pathname === '/' || 
                         ['/login', '/register'].includes(location.pathname) || 
                         isDashboard;

  return (
    <div className="min-h-dvh flex flex-col">
      {!isNavbarHidden && <Navbar />}
      <main className={`flex-1 ${isNavbarHidden ? '' : 'pt-16'}`}>
        <Outlet />
      </main>
      {!isDashboard && <Footer />}
    </div>
  )
}

export default App
