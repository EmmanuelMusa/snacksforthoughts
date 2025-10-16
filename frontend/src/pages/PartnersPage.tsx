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
            name: 'Access Bank',
            logo: '/images/partners/access-bank.png',
            supportedCauses: ['School Renovation', 'Feeding Programs', 'Digital Learning'],
            testimonial: 'We believe in empowering the next generation through quality education. Our partnership with Snacks for Thoughts allows us to make a meaningful impact in communities across Nigeria.',
            website: 'https://accessbankplc.com',
            industry: 'Banking'
        },
        {
            id: '2',
            name: 'MTN Nigeria',
            logo: '/images/partners/mtn.png',
            supportedCauses: ['Digital Infrastructure', 'Teacher Training', 'Student Scholarships'],
            testimonial: 'Connecting communities through technology and education. Our collaboration helps bridge the digital divide in Nigerian schools.',
            website: 'https://mtn.ng',
            industry: 'Telecommunications'
        },
        {
            id: '3',
            name: 'Dangote Group',
            logo: '/images/partners/dangote.png',
            supportedCauses: ['Infrastructure Development', 'Feeding Programs', 'Educational Materials'],
            testimonial: 'Building a better Nigeria starts with investing in our children\'s education. We\'re proud to support schools through this initiative.',
            website: 'https://dangote.com',
            industry: 'Manufacturing'
        },
        {
            id: '4',
            name: 'Flutterwave',
            logo: '/images/partners/flutterwave.png',
            supportedCauses: ['Digital Payments', 'Financial Literacy', 'School Management Systems'],
            testimonial: 'Making education accessible through innovative payment solutions. We\'re committed to supporting educational initiatives across Africa.',
            website: 'https://flutterwave.com',
            industry: 'Fintech'
        },
        {
            id: '5',
            name: 'Interswitch',
            logo: '/images/partners/interswitch.png',
            supportedCauses: ['Digital Learning', 'Payment Solutions', 'School Administration'],
            testimonial: 'Technology has the power to transform education. Our partnership helps schools embrace digital solutions for better learning outcomes.',
            website: 'https://interswitchgroup.com',
            industry: 'Technology'
        },
        {
            id: '6',
            name: 'Lagos State Government',
            logo: '/images/partners/lagos-state.png',
            supportedCauses: ['Policy Support', 'Infrastructure', 'Teacher Development'],
            testimonial: 'Education is the foundation of our state\'s development. We\'re committed to supporting initiatives that improve learning outcomes.',
            website: 'https://lagosstate.gov.ng',
            industry: 'Government'
        }
    ]

    const showcaseLogos = [
        '/images/partners/access-bank.png',
        '/images/partners/mtn.png',
        '/images/partners/dangote.png',
        '/images/partners/flutterwave.png',
        '/images/partners/interswitch.png',
        '/images/partners/lagos-state.png',
        '/images/partners/gtbank.png',
        '/images/partners/zenith-bank.png'
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
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Trusted Partners</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Leading organizations working together to create lasting impact in education
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
                            {showcaseLogos.map((logo, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-center justify-center p-4 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-transparent"></div>
                                        <div className="relative z-10 flex items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-blue-500 rounded-lg flex items-center justify-center">
                                                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                            </div>
                                        </div>
                                    </div>
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
                                <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
                                    {/* Gradient overlay for glassmorphism effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-100/20 rounded-2xl"></div>

                                    <div className="relative z-10">
                                        {/* Partner Logo and Name */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                                                <div className="text-blue-600 font-bold text-lg">{partner.name.charAt(0)}</div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h3>
                                                <p className="text-sm text-gray-600">{partner.industry}</p>
                                            </div>
                                        </div>

                                        {/* Supported Causes */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Supported Causes</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {partner.supportedCauses.map((cause, causeIndex) => (
                                                    <span
                                                        key={causeIndex}
                                                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm text-blue-700 text-xs font-medium rounded-full border border-blue-200/30"
                                                    >
                                                        {cause}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Testimonial */}
                                        <div className="mb-6">
                                            <blockquote className="text-sm text-gray-700 italic leading-relaxed">
                                                "{partner.testimonial}"
                                            </blockquote>
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex gap-3">
                                            {partner.website && (
                                                <a
                                                    href={partner.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-white/60 hover:bg-white/80 backdrop-blur-sm text-gray-700 font-semibold py-2 px-4 rounded-lg text-center transition-all duration-300 border border-white/30"
                                                >
                                                    Visit Website
                                                </a>
                                            )}
                                            <Link
                                                to="/donate"
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 shadow-md hover:shadow-lg"
                                            >
                                                Partner with Us
                                            </Link>
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