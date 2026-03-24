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
        <section className="relative py-32 overflow-hidden bg-white">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-left mb-24"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
                        Institutional Support
                    </motion.div>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <motion.h2
                                variants={itemVariants}
                                className="text-5xl md:text-6xl font-black text-gray-900 mb-8 font-display leading-[1.1] tracking-tight"
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Adopt a School.</span> <br/>
                                Transform a Community.
                            </motion.h2>
                            <motion.p
                                variants={itemVariants}
                                className="text-xl text-gray-500 font-medium leading-relaxed"
                            >
                                Our verified "Adopt-a-School" initiative allows organizations and individuals to provide consistent, long-term support to primary schools, ensuring no child goes hungry.
                            </motion.p>
                        </div>
                        <motion.div variants={itemVariants} className="flex-shrink-0">
                            <Link to="/schools" className="group flex items-center gap-3 text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                View Full Registry
                                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
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
                                 className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50 hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-4"
                             >
                                 {/* School Image Section */}
                                 <div className="relative h-72 overflow-hidden">
                                     <div
                                         className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                         style={{
                                             backgroundImage: `url('${school.image || schoolImages[index % schoolImages.length]}')`
                                         }}
                                         role="img"
                                         aria-label={`${school.name} school building`}
                                     />
                                     <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/10 to-transparent opacity-80" />

                                     {/* State Overlay */}
                                     <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-xl rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                                         <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                         {school.state || 'National Port'}
                                     </div>

                                     <div className="absolute bottom-8 left-8 right-8 text-white">
                                         <h3 className="text-2xl font-black mb-2 font-display leading-[1.1]">
                                             {school.name}
                                         </h3>
                                         <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
                                             <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                             {school.lga || 'Verified District'}
                                         </div>
                                     </div>
                                 </div>

                                 <div className="p-8 sm:p-10">
                                     {/* Performance Metrics */}
                                     <div className="mb-10">
                                         <div className="flex justify-between items-end mb-4">
                                             <div>
                                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Funded Progress</p>
                                                 <p className="text-2xl font-black text-gray-900">
                                                     ₦{school.raisedAmount.toLocaleString()}
                                                 </p>
                                             </div>
                                             <div className="text-right">
                                                 <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
                                                     {Math.round(progress)}% Reach
                                                 </p>
                                             </div>
                                         </div>

                                         <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                             <motion.div
                                                 initial={{ width: 0 }}
                                                 whileInView={{ width: `${progress}%` }}
                                                 viewport={{ once: true }}
                                                 transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                 className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                                             >
                                                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite] -translate-x-full"></div>
                                             </motion.div>
                                         </div>
                                     </div>

                                     {/* Action Row */}
                                     <div className="flex items-center gap-4 pt-2 border-t border-gray-50 mt-2">
                                         <Link to={`/donate?schoolId=${school.id}`} className="flex-1">
                                             <motion.button
                                                 className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-200 transition-all duration-300 hover:bg-gray-800 hover:shadow-gray-300"
                                                 whileTap={{ scale: 0.96 }}
                                             >
                                                 Support School
                                             </motion.button>
                                         </Link>
                                     </div>
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
