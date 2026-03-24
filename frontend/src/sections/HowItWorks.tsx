import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Find a School",
            description: "Browse our verified list of primary schools in need of support across Nigeria.",
            color: "from-blue-500 to-blue-600"
        },
        {
            number: "02",
            title: "Donate",
            description: "Choose to donate funds, supplies, or sponsor specific school projects and programs.",
            color: "from-green-500 to-green-600"
        },
        {
            number: "03",
            title: "See the Impact",
            description: "Track your contribution and see real-time updates on how your donation is making a difference.",
            color: "from-purple-500 to-purple-600"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as any
            }
        }
    }

    return (
        <section className="py-24 bg-gray-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 blur-3xl rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/30 blur-3xl rounded-full -ml-48 -mb-48"></div>
            
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <motion.div variants={itemVariants} className="text-green-600 font-bold text-sm uppercase tracking-widest mb-4">
                        Step-by-Step Guide
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl font-black text-gray-900 mb-6 font-display"
                    >
                        Empowering Change in <span className="text-blue-600">3 Steps</span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-500 max-w-2xl mx-auto font-medium"
                    >
                        We've simplified the process of supporting schools to ensure maximum transparency and direct impact for every child.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative"
                        >
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-3">
                                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-3xl font-black shadow-lg mb-8 group-hover:rotate-6 transition-transform`}>
                                    {step.number}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                                    {step.title}
                                </h3>

                                <p className="text-gray-500 font-medium leading-relaxed mb-6">
                                    {step.description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
                                    Learn More <span className="text-lg">→</span>
                                </div>
                            </div>
                            
                            {/* Decorative divider for desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gray-200"></div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-20"
                >
                    <Link to="/register">
                        <motion.button
                            className="px-10 py-5 bg-gray-900 text-white text-lg font-bold rounded-2xl shadow-xl shadow-gray-300 hover:bg-gray-800 transition-colors flex items-center gap-3 mx-auto"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Join the Movement Today
                            <span className="text-xl">✨</span>
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
