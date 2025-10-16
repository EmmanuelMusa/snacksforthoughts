import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDonation } from '../context/DonationContext'
import ScrollAnimation from '../components/ScrollAnimation'
import BackToTop from '../components/BackToTop'
import StickyDonateButton from '../components/StickyDonateButton'

type School = {
    id: string;
    name: string;
    description?: string;
    raisedAmount: number;
    targetAmount: number;
    image?: string;
    state?: string;
    lga?: string;
    ward?: string;
    email?: string;
    phone?: string;
    address?: string;
    needs?: string[];
    gallery?: string[];
}
type Donation = {
    id: string;
    donorName: string;
    amount?: number;
    type: 'CASH' | 'IN_KIND';
    kindType?: string;
    kindDesc?: string;
    date: string
}

export default function SchoolDetailPage() {
    const { id } = useParams()
    const { apiBaseUrl } = useDonation()
    const [school, setSchool] = useState<School | null>(null)
    const [donations, setDonations] = useState<Donation[]>([])
    const [tab, setTab] = useState<'overview' | 'needs' | 'donations' | 'gallery' | 'contact'>('overview')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        fetch(`${apiBaseUrl}/api/schools/${id}`).then(r => r.json()).then(setSchool).catch(() => { })
        fetch(`${apiBaseUrl}/api/donations`).then(r => r.json()).then((all: Donation[]) => {
            setDonations(all.filter(d => (d as any).schoolId === id))
        }).catch(() => { })
    }, [apiBaseUrl, id])

    const progress = school ? school.raisedAmount / school.targetAmount : 0
    const progressPercentage = Math.min(100, Math.round(progress * 100))

    // Mock gallery images for demonstration
    const galleryImages = school?.gallery || [
        '/images/children_in_a_classroom_in_nigeria_smiling.jpeg',
        '/images/service_providers_landscape.jpeg',
        '/images/service_providers_tile.jpeg'
    ]

    const needs = school?.needs || [
        'Classroom Renovation',
        'Desks and Chairs',
        'Books and Learning Materials',
        'School Meals',
        'Clean Water',
        'Toilet Facilities',
        'Playground Equipment',
        'Computer Lab'
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-mint-50 to-sky-50">
            {/* Hero Banner */}
            <div className="relative h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: school?.image
                            ? `url(${school.image})`
                            : "url('/images/children_in_a_classroom_in_nigeria_smiling.jpeg')"
                    }}
                    role="img"
                    aria-label={`${school?.name || 'School'} hero banner showing students in classroom`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="relative z-10 h-full flex items-end">
                    <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    {school?.name || 'School'}
                                </h1>
                                <p className="text-xl text-white/90 mb-6">
                                    {[school?.state, school?.lga, school?.ward].filter(Boolean).join(' • ')}
                                </p>

                                {/* CTA Button */}
                                <Link
                                    to={`/donate?schoolId=${school?.id || ''}`}
                                    className="inline-flex items-center px-8 py-4 bg-mint-500 hover:bg-mint-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Support This School
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="max-w-7xl mx-auto">
                    {/* Progress Card */}
                    {school && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                {/* Circular Progress */}
                                <div className="flex justify-center">
                                    <div className="relative w-32 h-32">
                                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="50"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                className="text-gray-200"
                                            />
                                            <motion.circle
                                                cx="60"
                                                cy="60"
                                                r="50"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                                className="text-mint-500"
                                                initial={{ strokeDasharray: "0 314" }}
                                                animate={{ strokeDasharray: `${314 * progress} 314` }}
                                                transition={{ duration: 2, delay: 0.5 }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-900">{progressPercentage}%</div>
                                                <div className="text-sm text-gray-600">Complete</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Info */}
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Fundraising Progress</h3>
                                    <p className="text-gray-600 mb-4">
                                        Help us reach our goal to support this school's needs
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Raised</span>
                                            <span className="font-semibold text-mint-600">₦{school.raisedAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Target</span>
                                            <span className="font-semibold text-gray-900">₦{school.targetAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Remaining</span>
                                            <span className="font-semibold text-gray-900">₦{(school.targetAmount - school.raisedAmount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="text-center">
                                    <Link
                                        to={`/donate?schoolId=${school.id}`}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                    >
                                        Make a Donation
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex overflow-x-auto">
                                {[
                                    { key: 'overview', label: 'Overview', icon: '📋' },
                                    { key: 'needs', label: 'Needs', icon: '🎯' },
                                    { key: 'donations', label: 'Donations', icon: '💝' },
                                    { key: 'gallery', label: 'Gallery', icon: '📸' },
                                    { key: 'contact', label: 'Contact', icon: '📞' }
                                ].map((tabItem) => (
                                    <button
                                        key={tabItem.key}
                                        onClick={() => setTab(tabItem.key as any)}
                                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${tab === tabItem.key
                                            ? 'border-mint-500 text-mint-600 bg-mint-50'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>{tabItem.icon}</span>
                                        {tabItem.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {tab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">About This School</h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                {school?.description || 'This school is dedicated to providing quality education to children in the community. With your support, we can help improve facilities, provide learning materials, and ensure every child has access to nutritious meals.'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-mint-50 rounded-xl p-6 text-center">
                                                <div className="w-8 h-1 bg-gradient-to-r from-mint-500 to-mint-600 rounded-full mx-auto mb-4"></div>
                                                <div className="font-semibold text-gray-900">Primary School</div>
                                                <div className="text-sm text-gray-600">Education Level</div>
                                            </div>
                                            <div className="bg-sky-50 rounded-xl p-6 text-center">
                                                <div className="w-8 h-1 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full mx-auto mb-4"></div>
                                                <div className="font-semibold text-gray-900">200+</div>
                                                <div className="text-sm text-gray-600">Students</div>
                                            </div>
                                            <div className="bg-green-50 rounded-xl p-6 text-center">
                                                <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4"></div>
                                                <div className="font-semibold text-gray-900">15+</div>
                                                <div className="text-sm text-gray-600">Teachers</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'needs' && (
                                    <motion.div
                                        key="needs"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Current Needs</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {needs.map((need, index) => (
                                                <motion.div
                                                    key={need}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                                                >
                                                    <div className="w-6 h-1 bg-gradient-to-r from-mint-500 to-mint-600 rounded-full mb-3"></div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">{need}</h4>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        This area needs immediate support to improve the learning environment.
                                                    </p>
                                                    <Link
                                                        to={`/donate?schoolId=${school?.id || ''}`}
                                                        className="inline-flex items-center px-4 py-2 bg-mint-500 hover:bg-mint-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                                    >
                                                        Support This Need
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'donations' && (
                                    <motion.div
                                        key="donations"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {donations.slice(0, 8).map((donation, index) => (
                                                <motion.div
                                                    key={donation.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-white border border-gray-200 rounded-xl p-6"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-semibold text-gray-900">{donation.donorName}</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${donation.type === 'CASH'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {donation.type === 'CASH' ? 'Cash' : 'In-Kind'}
                                                        </span>
                                                    </div>
                                                    {donation.type === 'CASH' ? (
                                                        <div className="text-lg font-semibold text-gray-900 mb-2">
                                                            ₦{(donation.amount || 0).toLocaleString()}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-700 mb-2">
                                                            {donation.kindType} — {donation.kindDesc}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(donation.date).toLocaleDateString()}
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {donations.length === 0 && (
                                                <div className="col-span-full text-center py-12">
                                                    <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <div className="w-8 h-8 bg-mint-500 rounded-full"></div>
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No donations yet</h4>
                                                    <p className="text-gray-600 mb-6">Be the first to support this school!</p>
                                                    <Link
                                                        to={`/donate?schoolId=${school?.id || ''}`}
                                                        className="inline-flex items-center px-6 py-3 bg-mint-500 hover:bg-mint-600 text-white font-semibold rounded-lg transition-colors duration-200"
                                                    >
                                                        Make First Donation
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'gallery' && (
                                    <motion.div
                                        key="gallery"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">School Gallery</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {galleryImages.map((image, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                                    onClick={() => setSelectedImage(image)}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`${school?.name || 'School'} gallery image ${index + 1} showing school facilities`}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'contact' && (
                                    <motion.div
                                        key="contact"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-mint-100 to-mint-200 rounded-full flex items-center justify-center">
                                                        <div className="w-4 h-4 bg-gradient-to-br from-mint-500 to-mint-600 rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Email</h4>
                                                        <p className="text-gray-600">{school?.email || 'contact@school.edu.ng'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-mint-100 to-mint-200 rounded-full flex items-center justify-center">
                                                        <div className="w-4 h-4 bg-gradient-to-br from-mint-500 to-mint-600 rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Phone</h4>
                                                        <p className="text-gray-600">{school?.phone || '+234 800 000 0000'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-mint-100 to-mint-200 rounded-full flex items-center justify-center">
                                                        <div className="w-4 h-4 bg-gradient-to-br from-mint-500 to-mint-600 rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Address</h4>
                                                        <p className="text-gray-600">{school?.address || 'School Address, City, State'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-mint-50 rounded-xl p-6">
                                                <h4 className="font-semibold text-gray-900 mb-4">Get Involved</h4>
                                                <p className="text-gray-600 mb-4">
                                                    Want to learn more about how you can help? Contact us directly or make a donation today.
                                                </p>
                                                <Link
                                                    to={`/donate?schoolId=${school?.id || ''}`}
                                                    className="inline-flex items-center px-6 py-3 bg-mint-500 hover:bg-mint-600 text-white font-semibold rounded-lg transition-colors duration-200"
                                                >
                                                    Support This School
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="max-w-4xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt={`${school?.name || 'School'} gallery image in full view`}
                                className="w-full h-full object-contain rounded-lg"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
                            >
                                ✕
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <BackToTop />
            <StickyDonateButton schoolId={school?.id} />
        </div>
    )
}


