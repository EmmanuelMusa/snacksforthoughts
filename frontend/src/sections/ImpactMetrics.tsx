import { motion } from 'framer-motion'

export default function ImpactMetrics() {
    const metrics = [
        {
            number: "66,000+",
            label: "Schools Served",
            description: "Providing coverage across all 36 States & FCT",
            color: "from-blue-500 to-blue-600"
        },
        {
            number: "10M+",
            label: "Pupils Nourished",
            description: "Daily nutritious meals for every child",
            color: "from-green-500 to-green-600"
        },
        {
            number: "₦1.2B+",
            label: "Investment Leveraged",
            description: "Federal, State & CSR-driven funding",
            color: "from-red-500 to-red-600"
        },
        {
            number: "5,000+",
            label: "Smallholder Farmers",
            description: "Directly engaged in the local supply chain",
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
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-white shadow-xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                {index === 0 && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                                {index === 1 && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-1.5-.454M21 12.773c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-1.5-.454M21 9.999c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 01-1.5-.454M16 5h1a1 1 0 011 1v3a1 1 0 01-1 1h-1m-4-5H5a1 1 0 00-1 1v3a1 1 0 001 1h4m4 0h1a1 1 0 011 1v3a1 1 0 01-1 1h-1m-4-5H5a1 1 0 00-1 1v3a1 1 0 001 1h4" /></svg>}
                                {index === 2 && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                {index === 3 && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
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
