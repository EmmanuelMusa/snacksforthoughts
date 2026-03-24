import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/children_in_a_classroom_in_nigeria_smiling.jpeg')"
                }}
                role="img"
                aria-label="Children in a Nigerian classroom smiling, representing the mission of Snacks For Thoughts - PBAT Feeds"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-900/80" />

            {/* Content */}
            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Main Tagline Section */}
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-full text-lg sm:text-xl font-bold shadow-lg mb-6"
                        >
                            PBAT Feeds - 'Snacks For Thought': A Federal, State, CSR and Private Sector-Driven Breakfast Initiative for School Children
                        </motion.div>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 font-display">
                        Nourishing Minds,
                        <br />
                        <span className="text-yellow-400">One Snack at a Time</span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join us in transforming education by providing nutritious meals and essential resources to primary schools across Nigeria.
                    </p>

                    <Link to="/register">
                        <motion.button
                            className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            List Your School
                        </motion.button>
                    </Link>
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
