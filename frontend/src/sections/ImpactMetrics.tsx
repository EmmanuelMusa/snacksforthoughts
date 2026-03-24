import { motion } from 'framer-motion'

export default function ImpactMetrics() {
    const metrics = [
        {
            number: "150+",
            label: "Schools Helped",
            description: "Primary schools across Nigeria",
            color: "from-blue-500 to-blue-600"
        },
        {
            number: "25,000+",
            label: "Meals Served",
            description: "Nutritious meals provided",
            color: "from-green-500 to-green-600"
        },
        {
            number: "500+",
            label: "Donors Engaged",
            description: "Active supporters",
            color: "from-red-500 to-red-600"
        },
        {
            number: "50+",
            label: "Vendors Verified",
            description: "Trusted service providers",
            color: "from-purple-500 to-purple-600"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    }

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-20"></div>
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="text-left mb-20"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest mb-4 border border-green-100">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Impact Tracking
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl font-black text-gray-900 mb-6 font-display lg:max-w-3xl leading-tight"
                    >
                        Transforming Lives <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Through Every Meal.</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-500 max-w-2xl font-medium"
                    >
                        Our data-driven approach ensures that every donation reaches the children who need it most, creating a measurable ripple effect across Nigeria.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
                >
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group p-8 rounded-3xl bg-gray-50 border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2 overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity`}></div>
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform`}>
                                <span className="text-lg font-bold">{metric.number.substring(0, 1)}</span>
                            </div>
                            <div className="text-4xl font-black text-gray-900 mb-2">
                                {metric.number}
                            </div>
                            <div className="text-base font-bold text-gray-800 mb-2 uppercase tracking-wide">
                                {metric.label}
                            </div>
                            <div className="text-sm text-gray-500 leading-relaxed">
                                {metric.description}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
