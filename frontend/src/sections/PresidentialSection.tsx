import { motion } from 'framer-motion'
import { Award, Heart, Shield, Star } from 'lucide-react'

export default function PresidentialSection() {
    return (
        <section className="relative py-24 bg-white overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50/50 -skew-x-12 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-50/50 skew-x-12 -translate-x-1/4" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Presidential Image Frame */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
                            <img
                                src="/images/President-Bola-Ahmed-Tinubu.jpg"
                                alt="His Excellency, President Bola Ahmed Tinubu"
                                className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Decorative Frames */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-600 rounded-full opacity-10 animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 border-4 border-green-600/20 rounded-3xl -z-10 rotate-12" />

                        <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                            <h4 className="text-2xl font-black font-display leading-tight">His Excellency,<br />President Bola Ahmed Tinubu</h4>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            <Star className="w-3 h-3 fill-current" />
                            A Renewed Hope Initiative
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8 font-display leading-[1.1]">
                            Driven by <span className="text-green-600 italic">Vision</span>,
                            <br />
                            Sustained by <span className="text-blue-600 underline decoration-yellow-400 decoration-4 underline-offset-8">Commitment</span>
                        </h2>

                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-10">
                            <p>
                                The <strong>PBAT Feeds - "Snacks For Thought"</strong> initiative stands as a testament to the presidential commitment to human capital development and social welfare. Under the visionary leadership of <strong>President Bola Ahmed Tinubu</strong>, this programme transcends traditional aid, evolving into a sustainable ecosystem of nutrition and education.
                            </p>
                            <p className="italic font-medium border-l-4 border-green-600 pl-6 bg-green-50/30 py-4 rounded-r-lg">
                                "Our children are the heartbeat of this nation. To invest in their nutrition today is to secure the prosperity of our tomorrow. A hungry child cannot learn; a nourished child will lead."
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900">National Priority</h5>
                                    <p className="text-sm text-gray-500">Pillar of the Renewed Hope Agenda.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900">Social Safety Net</h5>
                                    <p className="text-sm text-gray-500">Feeding over 10M pupils nationwide.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-12">
                                <img src="/images/Nigeria Logo.jpeg" alt="Government Seal" className="h-12 w-auto opacity-70" />
                                <img src="/images/NSIPA Logo.jpeg" alt="NSIPA Seal" className="h-12 w-auto opacity-70" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
