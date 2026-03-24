import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Calendar,
    Users,
    Building2,
    Package,
    BarChart3,
    Settings,
    Menu,
    X,
    LogOut,
    Bell,
    Search,
    Upload
} from 'lucide-react'

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Weeks Management', href: '/admin/weeks', icon: Calendar },
        { name: 'Suppliers', href: '/admin/suppliers', icon: Package },
        { name: 'Schools', href: '/admin/schools', icon: Building2 },
        { name: 'School Import', href: '/admin/school-import', icon: Upload },
        { name: 'Donations', href: '/admin/donations', icon: BarChart3 },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin'
        }
        return location.pathname.startsWith(path)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
                    <div className="flex h-16 items-center justify-between px-4">
                        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                        {/* Logout for mobile */}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </button>
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <h1 className="text-xl font-bold text-gray-900 font-display">Snacks <span className="text-blue-600">Admin</span></h1>
                    </div>
                    <nav className="mt-8 flex-1 px-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                    <div className="mt-auto px-4 pb-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="relative flex flex-1 items-center">
                            <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                            </button>
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
                            <div className="flex items-center gap-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900">Admin User</p>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">M&E Officer</p>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <span className="text-sm font-black text-white">AU</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-10 bg-gray-50/50 min-h-[calc(100vh-64px)]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
