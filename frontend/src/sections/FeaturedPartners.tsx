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
        <section className="py-32 bg-gray-50/30 overflow-hidden">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <motion.div variants={itemVariants} className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
                        Strategic Alliance
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl font-black text-gray-900 mb-6 font-display"
                    >
                        Institutional Partners
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-500 max-w-2xl mx-auto font-medium"
                    >
                        We collaborate with Nigeria's leading corporate entities to build sustainable feeding infrastructures for our future leaders.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity duration-700"
                >
                    {partners.map((partner, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative"
                        >
                            <div className="w-24 h-24 bg-white rounded-3xl flex flex-col items-center justify-center border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group-hover:border-blue-200">
                                <div className="text-4xl mb-1 group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">
                                    {partner.logo}
                                </div>
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter group-hover:text-blue-600">
                                    Verified
                                </span>
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
                    className="text-center mt-24"
                >
                    <Link to="/register">
                        <motion.button
                            className="text-lg font-bold text-gray-900 flex items-center gap-3 mx-auto px-10 py-5 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 hover:bg-gray-50 hover:border-blue-200 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Become a Strategic Partner
                            <span className="text-xl">🤝</span>
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
