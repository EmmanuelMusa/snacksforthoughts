import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Activity } from 'lucide-react'

export default function Hero() {
    const { isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/children_in_a_classroom_in_nigeria_smiling.jpeg')"
                }}
                role="img"
                aria-label="Children in a Nigerian classroom smiling, representing the mission of Snacks For Thoughts"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-900/80" />

            {/* Top Navigation / Logo Bar */}
            <div className="absolute top-0 left-0 right-0 z-50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Official Logos */}
                <div className="flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <img
                        src="/images/Coat_of_arms_of_Nigeria.svg.png"
                        alt="Nigeria Coat of Arms"
                        className="h-10 md:h-12 w-auto object-contain"
                    />
                    <img
                        src="/images/Fed. Min. of Humanitarian Affairs logo.png"
                        alt="Ministry Logo"
                        className="h-10 md:h-12 w-auto object-contain"
                    />
                    <img
                        src="/images/RH-NHGSFP.png"
                        alt="NHGSFP Logo"
                        className="h-10 md:h-12 w-auto object-contain"
                    />
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-3">
                            <Link to={
                                user.role === 'ADMIN' ? '/admin' :
                                user.role === 'SUPPLIER' ? '/dashboard/supplier' :
                                user.role === 'VERIFIER' ? '/dashboard/verifier' :
                                '/dashboard/donor'
                            }>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-bold text-xs tracking-[0.1em] uppercase px-5 py-3 rounded-full border border-green-500/30 backdrop-blur-sm transition-all"
                                >
                                    <Activity className="w-4 h-4" />
                                    Visit Dashboard
                                </motion.button>
                            </Link>
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 font-bold text-xs tracking-[0.1em] uppercase px-5 py-3 rounded-full border border-white/10 backdrop-blur-sm transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </motion.button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05, opacity: 1 }}
                                className="text-white/60 hover:text-white font-bold text-xs tracking-[0.3em] uppercase transition-all bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm"
                            >
                                Login / Register
                            </motion.button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >

                    <div className="space-y-4 mb-12">
                        <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-black text-white font-display leading-none tracking-tight">
                            PBAT FEEDS
                        </h1>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-[#00A859] font-display">
                            "SNACKS FOR THOUGHT"
                        </h2>
                        <h3 className="text-xl sm:text-2xl font-medium text-white/80 uppercase tracking-[0.3em] font-display">
                            (A PILOT BREAKFAST INITIATIVE)
                        </h3>
                    </div>

                    <p className="text-lg sm:text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Nourishing Nigeria's future through verified school breakfast programs. Support local schools and fund nutritious snacks directly through vetted community suppliers.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => document.getElementById('donation-flow')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-10 py-5 bg-yellow-400 text-gray-900 font-black text-lg rounded-2xl shadow-2xl shadow-yellow-400/20 hover:bg-yellow-300 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Find Your School & Support
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300"
                        >
                            How It Works
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                </div>
            </motion.div>
        </section>
    )
}
