import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function FeaturedPartners() {
    const partners = [
        { name: "Nasco Foods", logo: "🥨" },
        { name: "Chivita", logo: "🧃" },
        { name: "Cadbury", logo: "🍫" },
        { name: "FrieslandCampina", logo: "🥛" },
        { name: "Nestlé", logo: "🍪" },
        { name: "Dangote Sugar", logo: "🍯" },
        { name: "Access Bank", logo: "🏦" },
        { name: "MTN Nigeria", logo: "📱" }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5
            }
        }
    }

    return (
        <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-gray-900 mb-4 font-display"
                    >
                        Our Trusted Partners
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Leading organizations that share our commitment to education and community development.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8"
                >
                    {partners.map((partner, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group flex flex-col items-center justify-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
                        >
                            <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                                {partner.logo}
                            </div>
                            <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                                {partner.name}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Partnership CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <Link to="/partners">
                        <motion.button
                            className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-semibold text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Become a Partner
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
