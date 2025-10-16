import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDonation } from '../context/DonationContext'
import { VendorCardSkeleton } from '../components/SkeletonLoader'
import ScrollAnimation from '../components/ScrollAnimation'
import BackToTop from '../components/BackToTop'

type Vendor = {
    id?: string;
    name: string;
    category?: string;
    service?: string;
    verified: boolean;
    contact?: string;
    location?: string;
    rating?: number;
    description?: string;
}

export default function VendorsPage() {
    const { apiBaseUrl } = useDonation()
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Mock data for demonstration - in real app, this would come from API
    const mockVendors: Vendor[] = [
        {
            id: '1',
            name: 'Adebayo Construction',
            category: 'Carpenter',
            service: 'Furniture & Repairs',
            verified: true,
            contact: '+234 801 234 5678',
            location: 'Lagos',
            rating: 4.8,
            description: 'Expert carpenter specializing in school furniture and classroom repairs.'
        },
        {
            id: '2',
            name: 'Mama Grace Catering',
            category: 'Cook',
            service: 'School Meals',
            verified: true,
            contact: '+234 802 345 6789',
            location: 'Abuja',
            rating: 4.9,
            description: 'Nutritious meals for schools with focus on local ingredients.'
        },
        {
            id: '3',
            name: 'Bright Colors Painting',
            category: 'Painter',
            service: 'Interior & Exterior',
            verified: true,
            contact: '+234 803 456 7890',
            location: 'Kano',
            rating: 4.7,
            description: 'Professional painting services for schools and educational facilities.'
        },
        {
            id: '4',
            name: 'Tech Solutions Ltd',
            category: 'IT Services',
            service: 'Computer Setup & Maintenance',
            verified: true,
            contact: '+234 804 567 8901',
            location: 'Lagos',
            rating: 4.6,
            description: 'Computer lab setup and IT support for educational institutions.'
        },
        {
            id: '5',
            name: 'Green Thumb Landscaping',
            category: 'Gardener',
            service: 'School Gardens & Landscaping',
            verified: true,
            contact: '+234 805 678 9012',
            location: 'Port Harcourt',
            rating: 4.5,
            description: 'Creating beautiful and educational school gardens.'
        },
        {
            id: '6',
            name: 'Clean Water Solutions',
            category: 'Plumber',
            service: 'Water Systems & Plumbing',
            verified: true,
            contact: '+234 806 789 0123',
            location: 'Kaduna',
            rating: 4.8,
            description: 'Clean water systems and plumbing for schools.'
        },
        {
            id: '7',
            name: 'EduSupplies Nigeria',
            category: 'Supplier',
            service: 'Educational Materials & Equipment',
            verified: true,
            contact: '+234 807 890 1234',
            location: 'Lagos',
            rating: 4.9,
            description: 'Comprehensive supplier of educational materials, books, and school equipment.'
        }
    ]

    useEffect(() => {
        // In real app, fetch from API
        // fetch(`${apiBaseUrl}/api/vendors`).then(r => r.json()).then((data: Vendor[]) => {
        //     setVendors((data || []).filter(v => v.verified))
        // }).catch(() => { })
        setVendors(mockVendors.filter(v => v.verified))

        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [apiBaseUrl])

    // Get unique categories and locations for filters
    const categories = useMemo(() => [...new Set(vendors.map(v => v.category).filter(Boolean))], [vendors])
    const locations = useMemo(() => [...new Set(vendors.map(v => v.location).filter(Boolean))], [vendors])

    const filteredVendors = useMemo(() => {
        let filtered = vendors

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(vendor =>
                vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vendor.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vendor.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vendor.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(vendor => vendor.category === selectedCategory)
        }

        // Apply location filter
        if (selectedLocation) {
            filtered = filtered.filter(vendor => vendor.location === selectedLocation)
        }

        return filtered
    }, [vendors, searchTerm, selectedCategory, selectedLocation])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="relative h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/service_providers_landscape.jpeg')"
                    }}
                    role="img"
                    aria-label="Service providers and artisans working, representing the vendor community"
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
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                                    Become a Trusted Artisan and Support Our Schools
                                </h1>
                                <p className="text-xl text-white/90 mb-6">
                                    Connect with verified service providers who are committed to improving education infrastructure
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="max-w-7xl mx-auto">
                    {/* Search and Filters with CTA */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {/* Search and Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search Vendors
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name, category, or service..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white text-gray-900"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white text-gray-900"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white text-gray-900"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(location => (
                                            <option key={location} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Results Counter */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    All vendors are verified
                                </div>
                            </div>
                        </motion.div>

                        {/* Call to Action - Become a Vendor */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-1 flex items-center justify-center"
                        >
                            <div className="w-full max-w-xs mx-auto">
                                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="text-white">
                                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base md:text-lg font-bold mb-2">Become a Registered Vendor</h3>
                                        <p className="text-xs md:text-sm text-green-100 mb-3 md:mb-4 leading-relaxed">
                                            Join our network of trusted service providers and connect with schools in need
                                        </p>
                                        <Link
                                            to="/register"
                                            className="inline-block bg-white text-green-600 font-semibold px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm hover:bg-green-50 transition-colors duration-200 shadow-md hover:shadow-lg"
                                        >
                                            Register Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Vendors Grid */}
                    <AnimatePresence>
                        {isLoading ? (
                            <VendorCardSkeleton count={6} />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                            >
                                {filteredVendors.map((vendor, index) => (
                                    <motion.div
                                        key={vendor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                                    >
                                        {/* Vendor Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm font-medium text-mint-600">{vendor.category}</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="text-sm text-gray-600">{vendor.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        Verified
                                                    </span>
                                                    {vendor.rating && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-sm font-medium text-gray-700">{vendor.rating}/5</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Service Description */}
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {vendor.description}
                                            </p>

                                            {/* Service Type */}
                                            <div className="bg-mint-50 rounded-lg p-3 mb-4">
                                                <div className="text-sm font-medium text-mint-700 mb-1">Service</div>
                                                <div className="text-sm text-mint-600">{vendor.service}</div>
                                            </div>

                                            {/* Contact Info */}
                                            {vendor.contact && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                                    <span className="text-gray-400">📞</span>
                                                    <span>{vendor.contact}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <div className="px-6 pb-6">
                                            <Link
                                                to={`/donate?vendorId=${vendor.id}`}
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 shadow-md hover:shadow-lg block"
                                            >
                                                Request Service
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* No Results */}
                    {!isLoading && filteredVendors.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedCategory('')
                                    setSelectedLocation('')
                                }}
                                className="bg-mint-500 hover:bg-mint-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}

                    {/* Become a Vendor Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg p-8 text-center"
                    >
                        <div className="max-w-2xl mx-auto">
                            <div className="text-4xl mb-4">🛠️</div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Vendor</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Join our network of trusted service providers and help improve education infrastructure across Nigeria.
                                Connect with schools that need your expertise.
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Register as Vendor
                            </Link>
                        </div>
                    </motion.div>

                    {/* Verification Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-amber-600 text-xl">⚠️</div>
                            <div>
                                <h4 className="font-semibold text-amber-800 mb-1">Verification Required</h4>
                                <p className="text-sm text-amber-700">
                                    Vendors must undergo verification before being listed. This includes background checks,
                                    service quality assessment, and commitment to educational support standards.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <BackToTop />
        </div>
    )
}


