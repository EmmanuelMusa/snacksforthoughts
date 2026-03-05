import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Building2,
    Search,
    Filter,
    Download,
    Plus,
    Eye,
    Edit,
    Trash2,
    Users,
    DollarSign,
    TrendingUp,
    MapPin,
    Phone,
    Mail,
    Calendar
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'

interface SchoolData {
    id: string
    name: string
    location: string
    state: string
    lga: string
    ward: string
    studentCount: number
    targetAmount: number
    raisedAmount: number
    needs: string[]
    image?: string
    email?: string
    phone?: string
    address?: string
    principalName?: string
    schoolType?: string
    isActive?: boolean
    totalDonations: number
    activeWeeks: number
    reservedWeeks: number
    lastDonation?: string
    createdAt: string
}

export default function SchoolsManagement() {
    const { apiBaseUrl } = useDonation()
    const [schools, setSchools] = useState<SchoolData[]>([])
    const [filteredSchools, setFilteredSchools] = useState<SchoolData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [stateFilter, setStateFilter] = useState<string>('all')
    const [progressFilter, setProgressFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'complete'>('all')
    const [availableStates, setAvailableStates] = useState<string[]>([])
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [total, setTotal] = useState(0)
    const limit = 50

    useEffect(() => {
        let cancelled = false

        async function loadStates() {
            try {
                const res = await fetch(`${apiBaseUrl}/api/schools/states`)
                const json = await res.json()
                const list = (json as any).data ?? json
                if (!cancelled) setAvailableStates(Array.isArray(list) ? list : [])
            } catch {
                if (!cancelled) setAvailableStates([])
            }
        }

        async function loadSchools(nextPage: number) {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                params.set('page', String(nextPage))
                params.set('limit', String(limit))
                if (searchTerm.trim()) params.set('search', searchTerm.trim())
                if (stateFilter !== 'all') params.set('state', stateFilter)

                const res = await fetch(`${apiBaseUrl}/api/schools/search?${params.toString()}`)
                const json = await res.json()
                const payload = (json as any).data ?? json
                const list = Array.isArray(payload.schools) ? payload.schools : []

                const mapped: SchoolData[] = list.map((school: any) => ({
                    id: school.id,
                    name: school.name,
                    location: school.location || `${school.lga || ''}, ${school.state || ''}`.trim(),
                    state: school.state || '',
                    lga: school.lga || '',
                    ward: school.ward || '',
                    studentCount: school.studentCount || 0,
                    targetAmount: school.targetAmount || 0,
                    raisedAmount: school.raisedAmount || 0,
                    needs: Array.isArray(school.needs) ? school.needs : [],
                    image: school.image,
                    email: school.email,
                    phone: school.phone,
                    address: school.address,
                    principalName: school.principalName,
                    schoolType: school.schoolType,
                    isActive: school.isActive,
                    totalDonations: 0,
                    activeWeeks: 0,
                    reservedWeeks: 0,
                    lastDonation: undefined,
                    createdAt: school.createdAt || new Date().toISOString(),
                }))

                if (cancelled) return
                setSchools(mapped)
                setPage(payload.pagination?.page || nextPage)
                setPages(payload.pagination?.pages || 1)
                setTotal(payload.pagination?.total || 0)
                setLoading(false)
            } catch {
                if (!cancelled) {
                    setSchools([])
                    setLoading(false)
                }
            }
        }

        loadStates()
        loadSchools(1)

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiBaseUrl, searchTerm, stateFilter])

    useEffect(() => {
        let filtered = schools

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(school =>
                school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                school.lga.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // State filter
        if (stateFilter !== 'all') {
            filtered = filtered.filter(school => school.state === stateFilter)
        }

        // Progress filter
        if (progressFilter !== 'all') {
            filtered = filtered.filter(school => {
                const progress = (school.raisedAmount / school.targetAmount) * 100
                switch (progressFilter) {
                    case 'low':
                        return progress < 25
                    case 'medium':
                        return progress >= 25 && progress < 75
                    case 'high':
                        return progress >= 75 && progress < 100
                    case 'complete':
                        return progress >= 100
                    default:
                        return true
                }
            })
        }

        setFilteredSchools(filtered)
    }, [schools, searchTerm, stateFilter, progressFilter])

    const getProgressColor = (progress: number) => {
        if (progress < 25) return 'bg-red-500'
        if (progress < 50) return 'bg-yellow-500'
        if (progress < 75) return 'bg-blue-500'
        return 'bg-green-500'
    }

    const getProgressLabel = (progress: number) => {
        if (progress < 25) return 'Low'
        if (progress < 50) return 'Medium'
        if (progress < 75) return 'High'
        return 'Complete'
    }

    const uniqueStates = [...new Set(schools.map(school => school.state))].sort()

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white rounded-lg shadow-md"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Schools Management</h1>
                    <p className="text-gray-600">Manage and monitor all schools in the system</p>
                </div>
                <div className="flex space-x-3 mt-4 lg:mt-0">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </button>
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Plus className="h-4 w-4 mr-2" />
                        Add School
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Schools</p>
                            <p className="text-3xl font-bold">{schools.length.toLocaleString()}</p>
                        </div>
                        <Building2 className="h-8 w-8 text-blue-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Students</p>
                            <p className="text-3xl font-bold">
                                {schools.reduce((sum, school) => sum + school.studentCount, 0).toLocaleString()}
                            </p>
                        </div>
                        <Users className="h-8 w-8 text-green-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Target</p>
                            <p className="text-3xl font-bold">
                                ₦{(schools.reduce((sum, school) => sum + school.targetAmount, 0) / 1000000).toFixed(1)}M
                            </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Total Raised</p>
                            <p className="text-3xl font-bold">
                                ₦{(schools.reduce((sum, school) => sum + school.raisedAmount, 0) / 1000000).toFixed(1)}M
                            </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search schools..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All States</option>
                            {availableStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                        <select
                            value={progressFilter}
                            onChange={(e) => setProgressFilter(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Progress</option>
                            <option value="low">Low (0-25%)</option>
                            <option value="medium">Medium (25-75%)</option>
                            <option value="high">High (75-100%)</option>
                            <option value="complete">Complete (100%+)</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setStateFilter('all')
                                setProgressFilter('all')
                            }}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Schools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.map((school, index) => {
                    const progress = (school.raisedAmount / school.targetAmount) * 100
                    return (
                        <motion.div
                            key={school.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* School Image and Basic Info */}
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                    {school.image ? (
                                        <img
                                            src={school.image}
                                            alt={school.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Building2 className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{school.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {school.location}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            {school.studentCount} students
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {school.totalDonations} donations
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-medium">{progress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${getProgressColor(progress)}`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>₦{school.raisedAmount.toLocaleString()}</span>
                                    <span>₦{school.targetAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* School Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">State:</span>
                                    <span>{school.state}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">LGA:</span>
                                    <span>{school.lga}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">Ward:</span>
                                    <span>{school.ward}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-2">Type:</span>
                                    <span>{school.schoolType}</span>
                                </div>
                            </div>

                            {/* Needs */}
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Needs:</p>
                                <div className="flex flex-wrap gap-1">
                                    {school.needs.slice(0, 3).map((need, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            {need}
                                        </span>
                                    ))}
                                    {school.needs.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{school.needs.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                </button>
                                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </button>
                                <button className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* No Results */}
            {filteredSchools.length === 0 && (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                </div>
            )}

            {/* Pagination */}
            {filteredSchools.length > 0 && (
                <div className="flex items-center justify-between mt-8">
                    <p className="text-sm text-gray-700">
                        Showing {filteredSchools.length} of {schools.length} schools
                    </p>
                    <div className="flex space-x-2">
                        <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            1
                        </button>
                        <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}