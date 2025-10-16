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
            content: "Our company's partnership with Snacks for Thoughts has been one of our most successful CSR initiatives. The transparency and impact tracking are excellent.",
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
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        What People Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Hear from our community of donors, schools, and partners about their experiences.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination-custom',
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="testimonial-swiper"
                    >
                        {testimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id}>
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                    {/* Rating Stars */}
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-xl">⭐</span>
                                        ))}
                                    </div>

                                    {/* Testimonial Content */}
                                    <blockquote className="text-gray-700 mb-6 leading-relaxed">
                                        "{testimonial.content}"
                                    </blockquote>

                                    {/* Author Info */}
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {testimonial.role}
                                            </div>
                                            <div className="text-sm text-blue-600 font-medium">
                                                {testimonial.company}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation */}
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <button className="swiper-button-prev-custom w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-300">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="swiper-pagination-custom"></div>

                        <button className="swiper-button-next-custom w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-300">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
