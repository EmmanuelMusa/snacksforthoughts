import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useDonation } from '../context/DonationContext'

export default function FeaturedSchools() {
    const { apiBaseUrl } = useDonation()
    const [featuredSchools, setFeaturedSchools] = useState<
        Array<{
            id: string
            name: string
            needs?: string
            raisedAmount: number
            targetAmount: number
            image?: string | null
            state?: string | null
            lga?: string | null
        }>
    >([])

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const res = await fetch(`${apiBaseUrl}/api/schools/search?limit=6&page=1`)
                    const json = await res.json()
                    const payload = (json as any).data ?? json
                    const list = (payload.schools || []).map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        needs: Array.isArray(s.needs) ? s.needs.slice(0, 2).join(', ') : s.needs,
                        raisedAmount: s.raisedAmount || 0,
                        targetAmount: s.targetAmount || 0,
                        image: s.image || null,
                        state: s.state || null,
                        lga: s.lga || null,
                    }))
                    if (!cancelled) setFeaturedSchools(list)
                } catch {
                    if (!cancelled) setFeaturedSchools([])
                }
            })()
        return () => {
            cancelled = true
        }
    }, [apiBaseUrl])

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

    const calculateProgress = (raised: number, target: number) =>
        Math.min(((raised || 0) / Math.max(1, target || 0)) * 100, 100)

    return (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-white">
            {/* Elegant Background Gradients */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
            <div className="absolute top-1/4 -right-64 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-green-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/50 text-blue-600 font-medium text-sm mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Make a Lasting Impact
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-display tracking-tight"
                    >
                        Adopt a School
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Join hundreds of others contributing to children’s education by choosing a school to support consistently. Your commitment changes lives.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 min-h-[400px]"
                >
                    {featuredSchools.map((school, index) => {
                        const progress = calculateProgress(school.raisedAmount, school.targetAmount)

                        return (
                            <motion.div
                                key={school.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
                            >
                                {/* School Image */}
                                <div className="relative h-60 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{
                                            backgroundImage: `url('${school.image || schoolImages[index % schoolImages.length]}')`
                                        }}
                                        role="img"
                                        aria-label={`${school.name} school building`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

                                    {/* Location Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                                        <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {school.state || 'Nigeria'}
                                        </p>
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-200 transition-colors">
                                            {school.name}
                                        </h3>
                                        <p className="text-gray-200 text-sm line-clamp-1 opacity-90">
                                            {school.needs || 'Breakfast Programs, Educational Materials'}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8">
                                    {/* Financials & Progress */}
                                    <div className="mb-8">
                                        <div className="flex justify-between items-end mb-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">Raised</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    ₦{school.raisedAmount.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-500 mb-1">Goal</p>
                                                <p className="text-lg font-bold text-gray-400">
                                                    ₦{school.targetAmount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${progress}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-green-400 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Support Button */}
                                    <Link to={`/donate?schoolId=${school.id}`} className="block">
                                        <motion.button
                                            className="w-full relative overflow-hidden bg-blue-600 text-white font-semibold py-3.5 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all duration-300"
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                Adopt This School
                                                <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </span>
                                        </motion.button>
                                    </Link>
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
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <Link to="/schools">
                        <motion.button
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 font-semibold text-lg rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Explore All Schools
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
