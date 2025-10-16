import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import data from '../data/ng-schools.json'
import { SchoolCardSkeleton } from '../components/SkeletonLoader'
import ScrollAnimation from '../components/ScrollAnimation'
import BackToTop from '../components/BackToTop'

type WardSchool = {
    id: string;
    name: string;
    image?: string;
    needs?: string;
    targetAmount?: number;
    raisedAmount?: number;
    state?: string;
    lga?: string;
    ward?: string;
}
type Ward = { name: string; schools: WardSchool[] }
type LGA = { name: string; wards: Ward[] }
type StateRec = { state: string; lgas: LGA[] }

export default function SchoolsPage() {
    const states: StateRec[] = data as any

    // Flatten all schools for easier filtering
    const allSchools: WardSchool[] = useMemo(() => {
        const schools: WardSchool[] = []
        states.forEach(state => {
            state.lgas.forEach(lga => {
                lga.wards.forEach(ward => {
                    ward.schools.forEach(school => {
                        schools.push({
                            ...school,
                            state: state.state,
                            lga: lga.name,
                            ward: ward.name
                        })
                    })
                })
            })
        })
        return schools
    }, [states])

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedState, setSelectedState] = useState('')
    const [selectedLga, setSelectedLga] = useState('')
    const [selectedWard, setSelectedWard] = useState('')
    const [sortBy, setSortBy] = useState<'name' | 'most-needed' | 'newest'>('most-needed')
    const [filteredSchools, setFilteredSchools] = useState<WardSchool[]>(allSchools)
    const [isLoading, setIsLoading] = useState(true)

    // Available school images
    const schoolImages = [
        '/images/a_school_in_nigeria.jpeg',
        '/images/a_school_in_nigeria (1).jpeg',
        '/images/a_school_in_nigeria (2).jpeg',
        '/images/a_school_in_nigeria (3).jpeg'
    ]

    // Get unique values for filters
    const uniqueStates = useMemo(() => [...new Set(allSchools.map(s => s.state))], [allSchools])
    const uniqueLgas = useMemo(() => {
        if (!selectedState) return [...new Set(allSchools.map(s => s.lga))]
        return [...new Set(allSchools.filter(s => s.state === selectedState).map(s => s.lga))]
    }, [allSchools, selectedState])
    const uniqueWards = useMemo(() => {
        if (!selectedState && !selectedLga) return [...new Set(allSchools.map(s => s.ward))]
        return [...new Set(allSchools.filter(s => s.state === selectedState && s.lga === selectedLga).map(s => s.ward))]
    }, [allSchools, selectedState, selectedLga])

    // Filter and sort schools
    useEffect(() => {
        let filtered = allSchools

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(school =>
                school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.needs?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.lga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.ward?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply location filters
        if (selectedState) {
            filtered = filtered.filter(school => school.state === selectedState)
        }
        if (selectedLga) {
            filtered = filtered.filter(school => school.lga === selectedLga)
        }
        if (selectedWard) {
            filtered = filtered.filter(school => school.ward === selectedWard)
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'most-needed':
                    const aProgress = (a.raisedAmount || 0) / (a.targetAmount || 1)
                    const bProgress = (b.raisedAmount || 0) / (b.targetAmount || 1)
                    return aProgress - bProgress
                case 'newest':
                    return 0 // For now, no date field
                default:
                    return 0
            }
        })

        setFilteredSchools(filtered)
        setIsLoading(false)
    }, [allSchools, searchTerm, selectedState, selectedLga, selectedWard, sortBy])

    // Reset dependent filters when parent changes
    useEffect(() => { setSelectedLga(''); setSelectedWard('') }, [selectedState])
    useEffect(() => { setSelectedWard('') }, [selectedLga])

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-gray-900 mb-4 font-display"
                        >
                            Schools in Need
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto"
                        >
                            Discover schools across Nigeria that need your support to provide quality education
                        </motion.p>
                    </div>

                    {/* Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Schools
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name, needs, or location..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            {/* State Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white text-gray-900"
                                >
                                    <option value="">All States</option>
                                    {uniqueStates.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            {/* LGA Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    LGA
                                </label>
                                <select
                                    value={selectedLga}
                                    onChange={(e) => setSelectedLga(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white text-gray-900"
                                >
                                    <option value="">All LGAs</option>
                                    {uniqueLgas.map(lga => (
                                        <option key={lga} value={lga}>{lga}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Ward Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ward
                                </label>
                                <select
                                    value={selectedWard}
                                    onChange={(e) => setSelectedWard(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white text-gray-900"
                                >
                                    <option value="">All Wards</option>
                                    {uniqueWards.map(ward => (
                                        <option key={ward} value={ward}>{ward}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                                <div className="flex gap-2">
                                    {[
                                        { value: 'most-needed', label: 'Most Needed' },
                                        { value: 'name', label: 'Name' },
                                        { value: 'newest', label: 'Newest' }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value as any)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${sortBy === option.value
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                {filteredSchools.length} school{filteredSchools.length !== 1 ? 's' : ''} found
                            </div>
                        </div>
                    </motion.div>

                    {/* Schools Grid */}
                    <AnimatePresence>
                        {isLoading ? (
                            <SchoolCardSkeleton count={6} />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredSchools.map((school, index) => {
                                    const progress = school.targetAmount ? (school.raisedAmount || 0) / school.targetAmount : 0
                                    const progressPercentage = Math.min(100, Math.round(progress * 100))

                                    return (
                                        <motion.div
                                            key={school.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="card overflow-hidden"
                                        >
                                            {/* School Image */}
                                            <div
                                                className="h-48 bg-cover bg-center relative overflow-hidden"
                                                style={{
                                                    backgroundImage: school.image ? `url(${school.image})` : `url('${schoolImages[index % schoolImages.length]}')`
                                                }}
                                                role="img"
                                                aria-label={`${school.name} school building in ${school.state}`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                <div className="absolute top-4 right-4 bg-white/90 bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                                                    {school.state}
                                                </div>
                                            </div>

                                            {/* School Info */}
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {[school.lga, school.ward].filter(Boolean).join(', ')}
                                                </p>

                                                {school.needs && (
                                                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{school.needs}</p>
                                                )}

                                                {/* Progress Bar */}
                                                {school.targetAmount && (
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                            <span>Progress</span>
                                                            <span>{progressPercentage}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${progressPercentage}%` }}
                                                                transition={{ duration: 1, delay: 0.5 }}
                                                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                                                            <span>₦{(school.raisedAmount || 0).toLocaleString()}</span>
                                                            <span>₦{school.targetAmount.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex gap-3">
                                                    <Link
                                                        to={`/donate?schoolId=${school.id}`}
                                                        className="flex-1 btn-primary py-2 px-4 text-center"
                                                    >
                                                        Support
                                                    </Link>
                                                    <Link
                                                        to={`/schools/${school.id}`}
                                                        className="flex-1 border border-gray-300 hover:bg-gray-50 hover:bg-gray-700 text-gray-700 font-semibold py-2 px-4 rounded-2xl text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 shadow-sm hover:shadow-md"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* No Results */}
                    {!isLoading && filteredSchools.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 bg-gray-100 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="w-8 h-8 bg-gray-400 bg-gray-600 rounded-full"></div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schools found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedState('')
                                    setSelectedLga('')
                                    setSelectedWard('')
                                }}
                                className="btn-primary"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
            <BackToTop />
        </section>
    )
}


