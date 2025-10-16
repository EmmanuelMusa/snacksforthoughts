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
        <section className="py-20 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl font-bold text-gray-900 mb-4 font-display"
                    >
                        Our Impact
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Together, we're making a real difference in the lives of children across Nigeria
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="card"
                        >
                            <div className={`w-16 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r ${metric.color}`}></div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">
                                {metric.number}
                            </div>
                            <div className="text-lg text-gray-600 font-medium mb-2">
                                {metric.label}
                            </div>
                            <div className="text-sm text-gray-500">
                                {metric.description}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
