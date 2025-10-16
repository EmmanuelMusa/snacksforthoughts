import { motion } from 'framer-motion'

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
                ease: "easeOut"
            }
        }
    }

    return (
        <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
                        How It Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Making a difference is simple. Follow these three easy steps to start supporting education in Nigeria.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative text-center"
                        >
                            {/* Connection line for desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-6" />
                            )}

                            <div className="relative">
                                {/* Step number background */}
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-500 border-2 border-gray-200">
                                    {step.number}
                                </div>

                                {/* Main card */}
                                <div className="card border border-gray-100">
                                    <div className={`w-16 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color}`}></div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                                        {step.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <motion.a
                        href="/schools"
                        className="btn-primary text-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Making a Difference
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}
