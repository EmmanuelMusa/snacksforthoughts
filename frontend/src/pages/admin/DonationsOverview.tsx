import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart3,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    Clock,
    AlertCircle,
    DollarSign,
    TrendingUp,
    Users,
    Calendar
} from 'lucide-react'

interface DonationData {
    id: string
    donorName: string
    schoolName: string
    schoolId: string
    supplierName: string
    selectedWeeks: string[]
    totalAmount: number
    costPerStudent: number
    studentCount: number
    paymentConfirmed: boolean
    paymentReference: string
    status: 'pending' | 'payment_confirmed' | 'supplier_notified' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'
    createdAt: string
    paymentDate?: string
    deliveryDate?: string
    state: string
    lga: string
}

export default function DonationsOverview() {
    const [donations, setDonations] = useState<DonationData[]>([])
    const [filteredDonations, setFilteredDonations] = useState<DonationData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'payment_confirmed' | 'supplier_notified' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'>('all')
    const [dateFilter, setDateFilter] = useState<string>('all')

    useEffect(() => {
        // Mock data - in real app, this would come from API
        const mockDonations: DonationData[] = [
            {
                id: '1',
                donorName: 'John Doe',
                schoolName: 'Sunrise Primary School',
                schoolId: 's1',
                supplierName: 'Nasco Foods',
                selectedWeeks: ['First Term-2024-09-09', 'First Term-2024-09-16'],
                totalAmount: 15000,
                costPerStudent: 50,
                studentCount: 150,
                paymentConfirmed: true,
                paymentReference: 'PAY-001-2024',
                status: 'supplier_notified',
                createdAt: '2024-01-15',
                paymentDate: '2024-01-15',
                state: 'Lagos',
                lga: 'Ikeja'
            },
            {
                id: '2',
                donorName: 'Jane Smith',
                schoolName: 'Unity Primary School',
                schoolId: 's2',
                supplierName: 'Chivita',
                selectedWeeks: ['First Term-2024-09-02'],
                totalAmount: 8000,
                costPerStudent: 50,
                studentCount: 160,
                paymentConfirmed: true,
                paymentReference: 'PAY-002-2024',
                status: 'completed',
                createdAt: '2024-01-12',
                paymentDate: '2024-01-12',
                deliveryDate: '2024-01-20',
                state: 'Lagos',
                lga: 'Surulere'
            },
            {
                id: '3',
                donorName: 'Mike Johnson',
                schoolName: 'Greenfield School',
                schoolId: 's3',
                supplierName: 'Cadbury Nigeria',
                selectedWeeks: ['First Term-2024-09-16', 'First Term-2024-09-23'],
                totalAmount: 20000,
                costPerStudent: 50,
                studentCount: 200,
                paymentConfirmed: false,
                paymentReference: '',
                status: 'pending',
                createdAt: '2024-01-18',
                state: 'Lagos',
                lga: 'Victoria Island'
            },
            {
                id: '4',
                donorName: 'Sarah Wilson',
                schoolName: 'Harmony Primary School',
                schoolId: 's4',
                supplierName: 'FrieslandCampina',
                selectedWeeks: ['First Term-2024-09-09'],
                totalAmount: 10000,
                costPerStudent: 50,
                studentCount: 200,
                paymentConfirmed: true,
                paymentReference: 'PAY-003-2024',
                status: 'in_progress',
                createdAt: '2024-01-10',
                paymentDate: '2024-01-10',
                state: 'Lagos',
                lga: 'Lekki'
            },
            {
                id: '5',
                donorName: 'David Brown',
                schoolName: 'Bright Future Academy',
                schoolId: 's5',
                supplierName: 'Nestlé Nigeria',
                selectedWeeks: ['Second Term-2025-01-06', 'Second Term-2025-01-13'],
                totalAmount: 18000,
                costPerStudent: 50,
                studentCount: 180,
                paymentConfirmed: true,
                paymentReference: 'PAY-004-2024',
                status: 'delivered',
                createdAt: '2024-01-05',
                paymentDate: '2024-01-05',
                deliveryDate: '2024-01-25',
                state: 'Lagos',
                lga: 'Alimosho'
            },
            {
                id: '6',
                donorName: 'Lisa Davis',
                schoolName: 'Riverside Elementary',
                schoolId: 's6',
                supplierName: 'Dangote Sugar',
                selectedWeeks: ['First Term-2024-09-30'],
                totalAmount: 7500,
                costPerStudent: 50,
                studentCount: 150,
                paymentConfirmed: false,
                paymentReference: '',
                status: 'cancelled',
                createdAt: '2024-01-01',
                state: 'Lagos',
                lga: 'Eti-Osa'
            }
        ]

        setDonations(mockDonations)
        setFilteredDonations(mockDonations)
        setLoading(false)
    }, [])

    useEffect(() => {
        let filtered = donations

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(donation =>
                donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.paymentReference.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(donation => donation.status === statusFilter)
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date()
            const filterDate = new Date()

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0)
                    filtered = filtered.filter(donation => new Date(donation.createdAt) >= filterDate)
                    break
                case 'week':
                    filterDate.setDate(now.getDate() - 7)
                    filtered = filtered.filter(donation => new Date(donation.createdAt) >= filterDate)
                    break
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1)
                    filtered = filtered.filter(donation => new Date(donation.createdAt) >= filterDate)
                    break
            }
        }

        setFilteredDonations(filtered)
    }, [donations, searchTerm, statusFilter, dateFilter])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />
            case 'payment_confirmed':
                return <CheckCircle className="h-4 w-4 text-blue-500" />
            case 'supplier_notified':
                return <AlertCircle className="h-4 w-4 text-indigo-500" />
            case 'in_progress':
                return <Clock className="h-4 w-4 text-orange-500" />
            case 'delivered':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-emerald-500" />
            case 'cancelled':
                return <AlertCircle className="h-4 w-4 text-red-500" />
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'payment_confirmed':
                return 'bg-blue-100 text-blue-800'
            case 'supplier_notified':
                return 'bg-indigo-100 text-indigo-800'
            case 'in_progress':
                return 'bg-orange-100 text-orange-800'
            case 'delivered':
                return 'bg-green-100 text-green-800'
            case 'completed':
                return 'bg-emerald-100 text-emerald-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pending Payment'
            case 'payment_confirmed':
                return 'Payment Confirmed'
            case 'supplier_notified':
                return 'Supplier Notified'
            case 'in_progress':
                return 'In Progress'
            case 'delivered':
                return 'Delivered'
            case 'completed':
                return 'Completed'
            case 'cancelled':
                return 'Cancelled'
            default:
                return status
        }
    }

    const stats = {
        total: donations.length,
        totalAmount: donations.reduce((sum, d) => sum + d.totalAmount, 0),
        pending: donations.filter(d => d.status === 'pending').length,
        completed: donations.filter(d => d.status === 'completed').length,
        averageAmount: donations.length > 0 ? donations.reduce((sum, d) => sum + d.totalAmount, 0) / donations.length : 0,
        totalStudents: donations.reduce((sum, d) => sum + d.studentCount, 0)
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
                    <h1 className="text-3xl font-bold text-gray-900">Donations Overview</h1>
                    <p className="mt-2 text-gray-600">
                        Monitor and track all breakfast donations and their progress
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Donations', value: stats.total.toString(), icon: BarChart3, color: 'blue' },
                    { label: 'Total Amount', value: `₦${(stats.totalAmount / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'green' },
                    { label: 'Pending', value: stats.pending.toString(), icon: Clock, color: 'yellow' },
                    { label: 'Completed', value: stats.completed.toString(), icon: CheckCircle, color: 'emerald' },
                    { label: 'Avg Amount', value: `₦${stats.averageAmount.toLocaleString()}`, icon: TrendingUp, color: 'purple' },
                    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: Users, color: 'indigo' },
                    { label: 'Success Rate', value: `${((stats.completed / stats.total) * 100).toFixed(1)}%`, icon: CheckCircle, color: 'green' },
                    { label: 'Avg Students', value: Math.round(stats.totalStudents / stats.total).toString(), icon: Users, color: 'blue' }
                ].map((stat, index) => {
                    const Icon = stat.icon
                    const colorClasses = {
                        blue: 'bg-blue-500 text-white',
                        green: 'bg-green-500 text-white',
                        yellow: 'bg-yellow-500 text-white',
                        emerald: 'bg-emerald-500 text-white',
                        purple: 'bg-purple-500 text-white',
                        indigo: 'bg-indigo-500 text-white'
                    }

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
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
                                placeholder="Search donations..."
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
                            <option value="pending">Pending Payment</option>
                            <option value="payment_confirmed">Payment Confirmed</option>
                            <option value="supplier_notified">Supplier Notified</option>
                            <option value="in_progress">In Progress</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
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

            {/* Donations Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Donor & School
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Supplier & Weeks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount & Students
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDonations.map((donation, index) => (
                                <motion.tr
                                    key={donation.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                                            <div className="text-sm text-gray-500">{donation.schoolName}</div>
                                            <div className="text-xs text-gray-400">{donation.state}, {donation.lga}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{donation.supplierName}</div>
                                            <div className="text-sm text-gray-500">{donation.selectedWeeks.length} week{donation.selectedWeeks.length !== 1 ? 's' : ''}</div>
                                            <div className="text-xs text-gray-400">
                                                {donation.selectedWeeks.slice(0, 2).join(', ')}
                                                {donation.selectedWeeks.length > 2 && '...'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">₦{donation.totalAmount.toLocaleString()}</div>
                                            <div className="text-sm text-gray-500">{donation.studentCount} students</div>
                                            <div className="text-xs text-gray-400">₦{donation.costPerStudent}/student</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                                            {getStatusIcon(donation.status)}
                                            <span className="ml-1">{getStatusLabel(donation.status)}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            {donation.paymentConfirmed ? (
                                                <div>
                                                    <div className="text-sm font-medium text-green-600">Confirmed</div>
                                                    <div className="text-xs text-gray-500">{donation.paymentReference}</div>
                                                    {donation.paymentDate && (
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(donation.paymentDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500">Pending</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {donation.status === 'pending' && (
                                                <button className="text-green-600 hover:text-green-900">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
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
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDonations.length}</span> of{' '}
                    <span className="font-medium">{filteredDonations.length}</span> results
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
