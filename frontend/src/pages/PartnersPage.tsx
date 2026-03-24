import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PartnerCardSkeleton } from '../components/SkeletonLoader'
import BackToTop from '../components/BackToTop'

type Partner = {
    id: string
    name: string
    logo: string
    supportedCauses: string[]
    testimonial: string
    website?: string
    industry: string
}

export default function PartnersPage() {
    const [isLoading, setIsLoading] = useState(true)

    // Mock partner data - in real app, this would come from API
    const partners: Partner[] = [
        {
            id: '1',
            name: 'Nasco Foods',
            logo: '/images/partners/nasco-logo.png',
            supportedCauses: ['Breakfast Programs', 'Nutrition Education', 'Healthy Snacks'],
            testimonial: 'We believe in nourishing young minds with quality, nutritious snacks. Our partnership with Snacks For Thoughts - PBAT Feeds helps us reach children across Nigeria with healthy breakfast options.',
            website: 'https://nasco.com.ng',
            industry: 'Food & Beverage'
        },
        {
            id: '2',
            name: 'Chivita',
            logo: '/images/partners/chivita-logo.png',
            supportedCauses: ['Juice Programs', 'Vitamin Enrichment', 'Student Nutrition'],
            testimonial: 'Providing essential vitamins and nutrients through our quality juice products. We\'re committed to supporting children\'s health and education through proper nutrition.',
            website: 'https://chivita.com',
            industry: 'Food & Beverage'
        },
        {
            id: '3',
            name: 'Cadbury Nigeria',
            logo: '/images/partners/cadbury-logo.png',
            supportedCauses: ['Breakfast Programs', 'Nutritional Support', 'Educational Materials'],
            testimonial: 'Building a better Nigeria starts with investing in our children\'s nutrition and education. We\'re proud to support schools through this initiative.',
            website: 'https://cadbury.com.ng',
            industry: 'Food & Beverage'
        },
        {
            id: '4',
            name: 'FrieslandCampina WAMCO',
            logo: '/images/partners/friesland-logo.png',
            supportedCauses: ['Dairy Nutrition', 'School Feeding', 'Health Education'],
            testimonial: 'Making quality dairy nutrition accessible to school children. We\'re committed to supporting educational initiatives that promote healthy growth and development.',
            website: 'https://frieslandcampina.com',
            industry: 'Dairy & Nutrition'
        },
        {
            id: '5',
            name: 'Nestlé Nigeria',
            logo: '/images/partners/nestle-logo.png',
            supportedCauses: ['Nutrition Education', 'Healthy Snacks', 'Student Wellness'],
            testimonial: 'Technology has the power to transform education. Our partnership helps schools embrace digital solutions for better learning outcomes.',
            website: 'https://nestle.com.ng',
            industry: 'Food & Nutrition'
        },
        {
            id: '6',
            name: 'Dangote Sugar',
            logo: '/images/partners/dangote-sugar-logo.png',
            supportedCauses: ['Breakfast Programs', 'Nutritional Support', 'Community Development'],
            testimonial: 'Education is the foundation of our nation\'s development. We\'re committed to supporting initiatives that improve children\'s nutrition and learning outcomes.',
            website: 'https://dangote.com',
            industry: 'Food & Agriculture'
        }
    ]

    const showcaseLogos = [
        '/images/partners/nasco-logo.png',
        '/images/partners/chivita-logo.png',
        '/images/partners/cadbury-logo.png',
        '/images/partners/friesland-logo.png',
        '/images/partners/nestle-logo.png',
        '/images/partners/dangote-sugar-logo.png',
        '/images/partners/access-bank.png',
        '/images/partners/mtn.png'
    ]

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Banner */}
            <div className="relative h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/office buildings.jpg')"
                    }}
                    role="img"
                    aria-label="Service providers and artisans working, representing partnership and collaboration"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 h-full flex items-end">
                    <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    Together, We're Building Brighter Futures
                                </h1>
                                <p className="text-xl text-white/90 mb-6 max-w-3xl">
                                    Join leading organizations committed to transforming education across Nigeria through strategic partnerships and collaborative impact.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="max-w-7xl mx-auto">
                    {/* Showcase Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-12 mb-16 border border-white"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 text-center md:text-left">
                            <div className="max-w-xl">
                                <h2 className="text-3xl font-black text-gray-900 mb-4 font-display">Strategic Alliance Network</h2>
                                <p className="text-lg text-gray-500 font-medium">
                                    Collaborating with industry leaders to institutionalize nutrition and quality education across Nigerian schools.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-blue-700">12+</p>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Global Partners</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
                            {showcaseLogos.map((logo, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="group flex flex-col items-center gap-3"
                                >
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-blue-400 group-hover:bg-white transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 relative overflow-hidden">
                                        <div className="text-2xl font-black text-gray-300 group-hover:text-blue-600">P</div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Partner {index+1}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Partners Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    >
                        {partners.map((partner, index) => (
                            <motion.div
                                key={partner.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="group"
                            >
                                <div className="relative bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-[0.02] group-hover:opacity-[0.05] rounded-bl-[5rem] transition-opacity`}></div>

                                    <div className="relative z-10">
                                        {/* Partner Logo and Name */}
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-gray-100 group-hover:bg-white transition-colors">
                                                <div className="text-blue-600 font-black text-2xl">{partner.name.charAt(0)}</div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-1 font-display leading-tight">{partner.name}</h3>
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-widest border border-blue-100">
                                                    {partner.industry}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Supported Causes */}
                                        <div className="mb-8">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Corporate Mandate</p>
                                            <div className="flex flex-wrap gap-2">
                                                {partner.supportedCauses.map((cause, causeIndex) => (
                                                    <span
                                                        key={causeIndex}
                                                        className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-xl border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100 transition-colors"
                                                    >
                                                        {cause}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Testimonial */}
                                        <div className="mb-10 relative">
                                            <div className="absolute top-0 left-0 text-4xl text-blue-100 font-serif leading-none -translate-x-2 -translate-y-2 opacity-50">"</div>
                                            <p className="text-sm text-gray-500 font-medium italic leading-relaxed relative z-10 pl-4">
                                                {partner.testimonial}
                                            </p>
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex flex-col gap-3">
                                            {partner.website && (
                                                <a
                                                    href={partner.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl text-center transition-all duration-300 hover:bg-gray-800 shadow-lg shadow-gray-300"
                                                >
                                                    Corporate Profile
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Become a Partner Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-center text-white relative overflow-hidden"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl font-bold mb-4">Become a Partner</h2>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Join our network of forward-thinking organizations committed to transforming education in Nigeria.
                                Together, we can create sustainable impact and build a brighter future for our children.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Measurable Impact</h3>
                                    <p className="text-sm text-blue-100">Track your CSR impact with detailed reporting and analytics</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Community Engagement</h3>
                                    <p className="text-sm text-blue-100">Connect with communities and build lasting relationships</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <h3 className="font-semibold mb-2">Recognition</h3>
                                    <p className="text-sm text-blue-100">Gain recognition for your commitment to education</p>
                                </div>
                            </div>

                            <Link
                                to="/register"
                                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50"
                            >
                                Start Your Partnership Journey
                            </Link>
                        </div>
                    </motion.div>

                    {/* Partnership Benefits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            {
                                title: 'Strategic Alignment',
                                description: 'Align your CSR goals with education impact'
                            },
                            {
                                title: 'Impact Reporting',
                                description: 'Comprehensive reports on your contributions'
                            },
                            {
                                title: 'Network Access',
                                description: 'Connect with other like-minded organizations'
                            },
                            {
                                title: 'Brand Recognition',
                                description: 'Showcase your commitment to education'
                            }
                        ].map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 + index * 0.1 }}
                                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/80 transition-all duration-300 border border-white/30"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-sm text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
            <BackToTop />
        </div>
    )
}