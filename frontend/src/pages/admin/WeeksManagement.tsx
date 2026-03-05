import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar,
    Search,
    Filter,
    Download,
    Plus,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react'

interface WeekData {
    id: string
    schoolName: string
    schoolId: string
    term: string
    weekNumber: number
    startDate: string
    endDate: string
    status: 'available' | 'reserved' | 'completed'
    donorName?: string
    supplierName?: string
    amount?: number
    studentCount: number
    state: string
    lga: string
}

export default function WeeksManagement() {
    const [weeks, setWeeks] = useState<WeekData[]>([])
    const [filteredWeeks, setFilteredWeeks] = useState<WeekData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved' | 'completed'>('all')
    const [termFilter, setTermFilter] = useState<string>('all')

    useEffect(() => {
        // Mock data - in real app, this would come from API
        const mockWeeks: WeekData[] = [
            {
                id: '1',
                schoolName: 'Sunrise Primary School',
                schoolId: 's1',
                term: 'First Term',
                weekNumber: 1,
                startDate: '2024-09-02',
                endDate: '2024-09-06',
                status: 'available',
                studentCount: 150,
                state: 'Lagos',
                lga: 'Ikeja'
            },
            {
                id: '2',
                schoolName: 'Sunrise Primary School',
                schoolId: 's1',
                term: 'First Term',
                weekNumber: 2,
                startDate: '2024-09-09',
                endDate: '2024-09-13',
                status: 'reserved',
                donorName: 'John Doe',
                supplierName: 'Nasco Foods',
                amount: 7500,
                studentCount: 150,
                state: 'Lagos',
                lga: 'Ikeja'
            },
            {
                id: '3',
                schoolName: 'Unity Primary School',
                schoolId: 's2',
                term: 'First Term',
                weekNumber: 1,
                startDate: '2024-09-02',
                endDate: '2024-09-06',
                status: 'completed',
                donorName: 'Jane Smith',
                supplierName: 'Chivita',
                amount: 8000,
                studentCount: 160,
                state: 'Lagos',
                lga: 'Surulere'
            },
            {
                id: '4',
                schoolName: 'Greenfield School',
                schoolId: 's3',
                term: 'First Term',
                weekNumber: 3,
                startDate: '2024-09-16',
                endDate: '2024-09-20',
                status: 'available',
                studentCount: 200,
                state: 'Lagos',
                lga: 'Victoria Island'
            },
            {
                id: '5',
                schoolName: 'Harmony Primary School',
                schoolId: 's4',
                term: 'First Term',
                weekNumber: 2,
                startDate: '2024-09-09',
                endDate: '2024-09-13',
                status: 'reserved',
                donorName: 'Mike Johnson',
                supplierName: 'Cadbury Nigeria',
                amount: 10000,
                studentCount: 200,
                state: 'Lagos',
                lga: 'Lekki'
            },
            {
                id: '6',
                schoolName: 'Bright Future Academy',
                schoolId: 's5',
                term: 'Second Term',
                weekNumber: 1,
                startDate: '2025-01-06',
                endDate: '2025-01-10',
                status: 'available',
                studentCount: 180,
                state: 'Lagos',
                lga: 'Alimosho'
            }
        ]

        setWeeks(mockWeeks)
        setFilteredWeeks(mockWeeks)
        setLoading(false)
    }, [])

    useEffect(() => {
        let filtered = weeks

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(week =>
                week.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                week.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                week.lga.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (week.donorName && week.donorName.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(week => week.status === statusFilter)
        }

        // Term filter
        if (termFilter !== 'all') {
            filtered = filtered.filter(week => week.term === termFilter)
        }

        setFilteredWeeks(filtered)
    }, [weeks, searchTerm, statusFilter, termFilter])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'available':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'reserved':
                return <Clock className="h-4 w-4 text-yellow-500" />
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-blue-500" />
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800'
            case 'reserved':
                return 'bg-yellow-100 text-yellow-800'
            case 'completed':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const stats = {
        total: weeks.length,
        available: weeks.filter(w => w.status === 'available').length,
        reserved: weeks.filter(w => w.status === 'reserved').length,
        completed: weeks.filter(w => w.status === 'completed').length
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Weeks Management</h1>
                    <p className="mt-2 text-gray-600">
                        Monitor and manage school week availability and reservations
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Week
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Weeks', value: stats.total, color: 'blue' },
                    { label: 'Available', value: stats.available, color: 'green' },
                    { label: 'Reserved', value: stats.reserved, color: 'yellow' },
                    { label: 'Completed', value: stats.completed, color: 'blue' }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                                <Calendar className={`h-6 w-6 text-${stat.color}-600`} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search schools, donors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                        <select
                            value={termFilter}
                            onChange={(e) => setTermFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Terms</option>
                            <option value="First Term">First Term</option>
                            <option value="Second Term">Second Term</option>
                            <option value="Third Term">Third Term</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <Filter className="h-4 w-4 mr-2" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Weeks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    School
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Week Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Donor/Supplier
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredWeeks.map((week, index) => (
                                <motion.tr
                                    key={week.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{week.schoolName}</div>
                                            <div className="text-sm text-gray-500">{week.state}, {week.lga}</div>
                                            <div className="text-xs text-gray-400">{week.studentCount} students</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{week.term} - Week {week.weekNumber}</div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(week.status)}`}>
                                            {getStatusIcon(week.status)}
                                            <span className="ml-1 capitalize">{week.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            {week.donorName && (
                                                <div className="text-sm font-medium text-gray-900">{week.donorName}</div>
                                            )}
                                            {week.supplierName && (
                                                <div className="text-sm text-gray-500">{week.supplierName}</div>
                                            )}
                                            {!week.donorName && !week.supplierName && (
                                                <div className="text-sm text-gray-400">-</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {week.amount ? `₦${week.amount.toLocaleString()}` : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-gray-600 hover:text-gray-900">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredWeeks.length}</span> of{' '}
                    <span className="font-medium">{filteredWeeks.length}</span> results
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">
                        1
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}
