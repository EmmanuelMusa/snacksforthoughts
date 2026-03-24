import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function TestimonialCarousel() {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Donor",
            company: "Tech Solutions Ltd",
            content: "Supporting schools through this platform has been incredibly rewarding. Seeing the direct impact of my donations on children's lives is truly heartwarming.",
            avatar: "",
            rating: 5
        },
        {
            id: 2,
            name: "Michael Adebayo",
            role: "School Principal",
            company: "Unity Primary School",
            content: "The support we've received has transformed our school. Our students now have proper meals and better learning facilities. Thank you for making this possible.",
            avatar: "",
            rating: 5
        },
        {
            id: 3,
            name: "Grace Okafor",
            role: "Vendor",
            company: "Fresh Foods Nigeria",
            content: "Being a verified vendor on this platform has allowed me to reach more schools and make a meaningful contribution to education in Nigeria.",
            avatar: "",
            rating: 5
        },
        {
            id: 4,
            name: "David Thompson",
            role: "Corporate Donor",
            company: "Global Impact Corp",
            content: "Our company's partnership with Snacks For Thoughts - PBAT Feeds has been one of our most successful CSR initiatives. The transparency and impact tracking are excellent.",
            avatar: "",
            rating: 5
        },
        {
            id: 5,
            name: "Aisha Mohammed",
            role: "Parent",
            company: "Community Member",
            content: "My children's school has improved so much since joining this program. The meals and resources have made a real difference in their education.",
            avatar: "",
            rating: 5
        }
    ]

    return (
        <section className="py-32 bg-white overflow-hidden relative">
            {/* Artistic accents */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 -skew-x-12 translate-x-1/2 pointer-events-none" />
            
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-3 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-1"
                    >
                        <div className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-6">
                            Voices of Impact
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 font-display leading-tight">
                            Community <br/> Reflections.
                        </h2>
                        <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
                            Transparent. Accountable. Life-changing. Hear from the ecosystem stakeholders driving Nigeria's school feeding revolution.
                        </p>
                        
                        {/* Custom Navigation Desktop */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button className="swiper-button-prev-custom w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button className="swiper-button-next-custom w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={40}
                            slidesPerView={1}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            pagination={{
                                clickable: true,
                                bulletClass: 'testimonial-dot',
                                bulletActiveClass: 'testimonial-dot-active',
                            }}
                            autoplay={{
                                delay: 6000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                768: { slidesPerView: 1.5 },
                                1280: { slidesPerView: 2 },
                            }}
                            className="testimonial-swiper !pb-20"
                        >
                            {testimonials.map((testimonial) => (
                                <SwiperSlide key={testimonial.id}>
                                    <div className="bg-white rounded-[3rem] p-10 sm:p-12 border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-blue-900/10 transition-all duration-500 h-full flex flex-col">
                                        {/* Quote Icon */}
                                        <div className="text-6xl text-blue-600/10 font-serif absolute top-8 right-12">
                                            “
                                        </div>
                                        
                                        {/* Rating */}
                                        <div className="flex gap-1 mb-8">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-4 h-4 rounded-full bg-blue-600/20 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                </div>
                                            ))}
                                        </div>

                                        <blockquote className="text-xl font-medium text-gray-700 mb-12 leading-relaxed flex-grow italic">
                                            &ldquo;{testimonial.content}&rdquo;
                                        </blockquote>

                                        <div className="flex items-center gap-5 mt-auto pt-8 border-t border-gray-50">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20">
                                                {testimonial.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 text-lg leading-tight mb-1">
                                                    {testimonial.name}
                                                </div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="text-blue-600">{testimonial.role}</span>
                                                    <span>•</span>
                                                    <span>{testimonial.company}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        {/* Mobile Navigation */}
                        <div className="flex lg:hidden justify-center items-center mt-8 space-x-6">
                            <button className="swiper-button-prev-custom w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button className="swiper-button-next-custom w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            <style>{`
                .testimonial-dot {
                    width: 8px;
                    height: 8px;
                    background: #e5e7eb;
                    border-radius: 10px;
                    margin: 0 4px;
                    cursor: pointer;
                    display: inline-block;
                    transition: all 0.3s ease;
                }
                .testimonial-dot-active {
                    width: 24px;
                    background: #2563eb;
                }
                .swiper-pagination-bullets {
                    bottom: 0 !important;
                }
            `}</style>
        </section>
    )
}
