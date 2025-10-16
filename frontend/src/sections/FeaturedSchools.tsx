import { motion } from 'framer-motion'
import schoolsData from '../data/ng-schools.json'

export default function FeaturedSchools() {
    // Extract schools from the nested data structure
    const allSchools = schoolsData.flatMap(state =>
        state.lgas.flatMap(lga =>
            lga.wards.flatMap(ward => ward.schools)
        )
    )

    // Take first 6 schools for featured display
    const featuredSchools = allSchools.slice(0, 6)

    // Available school images
    const schoolImages = [
        '/images/a_school_in_nigeria.jpeg',
        '/images/a_school_in_nigeria (1).jpeg',
        '/images/a_school_in_nigeria (2).jpeg',
        '/images/a_school_in_nigeria (3).jpeg'
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

    const calculateProgress = (raised: number, target: number) => {
        return Math.min((raised / target) * 100, 100)
    }

    return (
        <section className="py-20 bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50">
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
                        Featured Schools
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Discover schools making a difference in their communities and help them reach their goals.
                        <br />
                        <span className="text-sm text-gray-500">Showing {featuredSchools.length} featured schools</span>
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto min-h-[400px]"
                >
                    {featuredSchools.map((school, index) => {
                        const progress = calculateProgress(school.raisedAmount, school.targetAmount)

                        return (
                            <motion.div
                                key={school.id}
                                variants={itemVariants}
                                className="card overflow-hidden"
                            >
                                {/* School Image */}
                                <div
                                    className="h-48 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('${schoolImages[index % schoolImages.length]}')`
                                    }}
                                    role="img"
                                    aria-label={`${school.name} school building`}
                                >
                                    <div className="h-full bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {school.name}
                                    </h3>

                                    <p className="text-gray-600 mb-4 text-sm">
                                        {school.needs}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Progress</span>
                                            <span>{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${progress}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Amount raised */}
                                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                                        <span>₦{school.raisedAmount.toLocaleString()}</span>
                                        <span>₦{school.targetAmount.toLocaleString()}</span>
                                    </div>

                                    {/* Support Button */}
                                    <motion.button
                                        className="w-full btn-primary"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Support This School
                                    </motion.button>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* View All Schools Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <motion.a
                        href="/schools"
                        className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-lg rounded-full transition-all duration-300 transform hover:-translate-y-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View All Schools
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}
