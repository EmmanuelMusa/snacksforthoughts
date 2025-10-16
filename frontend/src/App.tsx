import './App.css'
import Footer from './sections/Footer'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/schools", label: "Schools" },
    { to: "/vendors", label: "Vendors" },
    { to: "/partners", label: "Partners" },
    { to: "/donate", label: "Donate" },
    { to: "/about", label: "About" }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-3 font-bold text-gray-900 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
              <div className="w-6 h-6 bg-white rounded"></div>
            </div>
            <span className="text-xl font-display">Snacks For Thoughts</span>
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="home" className="relative isolate bg-gradient-to-b from-white to-sky-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Make a Difference Today
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Help primary schools paint walls, fix furniture, and provide nutritious snacks and breakfasts. Partner with verified vendors to deliver impact where it matters most.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#donate" className="inline-flex items-center rounded-md bg-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">Donate Now</a>
              <a href="#vendors" className="inline-flex items-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Become a Vendor</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-tr from-sky-200 via-amber-200 to-white shadow-inner" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const items = [
    {
      title: 'Donate',
      desc: 'Contribute funds or supplies to targeted school projects.',
      iconBg: 'bg-sky-100 text-sky-600'
    },
    {
      title: 'Partner',
      desc: 'Collaborate as a company to sponsor school-wide initiatives.',
      iconBg: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Volunteer',
      desc: 'Offer your time and skills to support local schools.',
      iconBg: 'bg-amber-100 text-amber-600'
    }
  ] as const

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">How you can help</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.iconBg}`}>
                <span className="text-base font-bold">{item.title.charAt(0)}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
