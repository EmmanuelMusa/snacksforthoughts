import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Package,
    Search,
    Filter,
    Download,
    Plus,
    Eye,
    Edit,
    Trash2,
    Star,
    MapPin,
    Phone,
    Mail,
    CheckCircle,
    AlertCircle,
    Clock
} from 'lucide-react'

interface SupplierData {
    id: string
    name: string
    logo: string
    description: string
    specialties: string[]
    rating: number
    deliveryAreas: string[]
    accountDetails: {
        bankName: string
        accountNumber: string
        accountName: string
    }
    contactInfo: {
        phone: string
        email: string
    }
    verified: boolean
    status: 'active' | 'inactive' | 'pending'
    totalOrders: number
    totalRevenue: number
    lastOrder: string
    createdAt: string
}

export default function SuppliersManagement() {
    const [suppliers, setSuppliers] = useState<SupplierData[]>([])
    const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')
    const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')

    useEffect(() => {
        // Mock data - in real app, this would come from API
        const mockSuppliers: SupplierData[] = [
            {
                id: '1',
                name: 'Nasco Foods',
                logo: '/images/partners/nasco-logo.png',
                description: 'Leading food and beverage company specializing in nutritious snacks for children',
                specialties: ['Biscuits', 'Cereals', 'Juices', 'Healthy Snacks'],
                rating: 4.8,
                deliveryAreas: ['Lagos', 'Ogun', 'Rivers', 'Abuja'],
                accountDetails: {
                    bankName: 'First Bank of Nigeria',
                    accountNumber: '1234567890',
                    accountName: 'Nasco Foods Limited'
                },
                contactInfo: {
                    phone: '+234 800 NASCO',
                    email: 'orders@nasco.com.ng'
                },
                verified: true,
                status: 'active',
                totalOrders: 23,
                totalRevenue: 690000,
                lastOrder: '2024-01-15',
                createdAt: '2023-06-01'
            },
            {
                id: '2',
                name: 'Chivita',
                logo: '/images/partners/chivita-logo.png',
                description: 'Premium juice and beverage company focused on healthy drinks for children',
                specialties: ['Juices', 'Healthy Drinks', 'Vitamin Enrichment'],
                rating: 4.6,
                deliveryAreas: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
                accountDetails: {
                    bankName: 'Guaranty Trust Bank',
                    accountNumber: '9876543210',
                    accountName: 'Chivita Nigeria Limited'
                },
                contactInfo: {
                    phone: '+234 800 CHIVITA',
                    email: 'orders@chivita.com'
                },
                verified: true,
                status: 'active',
                totalOrders: 18,
                totalRevenue: 540000,
                lastOrder: '2024-01-12',
                createdAt: '2023-07-15'
            },
            {
                id: '3',
                name: 'Cadbury Nigeria',
                logo: '/images/partners/cadbury-logo.png',
                description: 'Global confectionery company with focus on nutritious snacks and beverages',
                specialties: ['Chocolate', 'Biscuits', 'Beverages', 'Healthy Snacks'],
                rating: 4.7,
                deliveryAreas: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'],
                accountDetails: {
                    bankName: 'Access Bank',
                    accountNumber: '1122334455',
                    accountName: 'Cadbury Nigeria Plc'
                },
                contactInfo: {
                    phone: '+234 800 CADBURY',
                    email: 'orders@cadbury.com.ng'
                },
                verified: true,
                status: 'active',
                totalOrders: 15,
                totalRevenue: 450000,
                lastOrder: '2024-01-10',
                createdAt: '2023-05-20'
            },
            {
                id: '4',
                name: 'FrieslandCampina WAMCO',
                logo: '/images/partners/friesland-logo.png',
                description: 'Dairy nutrition company providing quality milk and dairy products for children',
                specialties: ['Milk', 'Dairy Products', 'Nutrition', 'Healthy Drinks'],
                rating: 4.5,
                deliveryAreas: ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
                accountDetails: {
                    bankName: 'United Bank for Africa',
                    accountNumber: '5566778899',
                    accountName: 'FrieslandCampina WAMCO Nigeria'
                },
                contactInfo: {
                    phone: '+234 800 FRIESLAND',
                    email: 'orders@frieslandcampina.com'
                },
                verified: true,
                status: 'active',
                totalOrders: 12,
                totalRevenue: 360000,
                lastOrder: '2024-01-08',
                createdAt: '2023-08-10'
            },
            {
                id: '5',
                name: 'Nestlé Nigeria',
                logo: '/images/partners/nestle-logo.png',
                description: 'Global nutrition company committed to healthy food and beverages for children',
                specialties: ['Cereals', 'Milk', 'Healthy Snacks', 'Nutrition'],
                rating: 4.9,
                deliveryAreas: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Kaduna'],
                accountDetails: {
                    bankName: 'Zenith Bank',
                    accountNumber: '9988776655',
                    accountName: 'Nestlé Nigeria Plc'
                },
                contactInfo: {
                    phone: '+234 800 NESTLE',
                    email: 'orders@nestle.com.ng'
                },
                verified: true,
                status: 'active',
                totalOrders: 10,
                totalRevenue: 300000,
                lastOrder: '2024-01-05',
                createdAt: '2023-04-15'
            },
            {
                id: '6',
                name: 'Dangote Sugar',
                logo: '/images/partners/dangote-sugar-logo.png',
                description: 'Leading sugar and food products company with focus on nutrition',
                specialties: ['Sugar', 'Cereals', 'Food Products', 'Nutrition'],
                rating: 4.4,
                deliveryAreas: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Kaduna'],
                accountDetails: {
                    bankName: 'First Bank of Nigeria',
                    accountNumber: '4433221100',
                    accountName: 'Dangote Sugar Refinery Plc'
                },
                contactInfo: {
                    phone: '+234 800 DANGOTE',
                    email: 'orders@dangote.com'
                },
                verified: false,
                status: 'pending',
                totalOrders: 0,
                totalRevenue: 0,
                lastOrder: '-',
                createdAt: '2024-01-01'
            }
        ]

        setSuppliers(mockSuppliers)
        setFilteredSuppliers(mockSuppliers)
        setLoading(false)
    }, [])

    useEffect(() => {
        let filtered = suppliers

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(supplier =>
                supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(supplier => supplier.status === statusFilter)
        }

        // Specialty filter
        if (specialtyFilter !== 'all') {
            filtered = filtered.filter(supplier =>
                supplier.specialties.some(s => s.toLowerCase().includes(specialtyFilter.toLowerCase()))
            )
        }

        setFilteredSuppliers(filtered)
    }, [suppliers, searchTerm, statusFilter, specialtyFilter])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'inactive':
                return <AlertCircle className="h-4 w-4 text-red-500" />
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'inactive':
                return 'bg-red-100 text-red-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const stats = {
        total: suppliers.length,
        active: suppliers.filter(s => s.status === 'active').length,
        pending: suppliers.filter(s => s.status === 'pending').length,
        verified: suppliers.filter(s => s.verified).length
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
                    <h1 className="text-3xl font-bold text-gray-900">Suppliers Management</h1>
                    <p className="mt-2 text-gray-600">
                        Manage and monitor registered snack suppliers
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Supplier
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Suppliers', value: stats.total, color: 'blue' },
                    { label: 'Active', value: stats.active, color: 'green' },
                    { label: 'Pending', value: stats.pending, color: 'yellow' },
                    { label: 'Verified', value: stats.verified, color: 'purple' }
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
                                <Package className={`h-6 w-6 text-${stat.color}-600`} />
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
                                placeholder="Search suppliers..."
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
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                        <select
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Specialties</option>
                            <option value="biscuits">Biscuits</option>
                            <option value="juices">Juices</option>
                            <option value="cereals">Cereals</option>
                            <option value="milk">Milk</option>
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

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSuppliers.map((supplier, index) => (
                    <motion.div
                        key={supplier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(supplier.rating)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                    fill={i < Math.floor(supplier.rating) ? 'currentColor' : 'none'}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">{supplier.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                                    {getStatusIcon(supplier.status)}
                                    <span className="ml-1 capitalize">{supplier.status}</span>
                                </span>
                                {supplier.verified && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                )}
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supplier.description}</p>

                        <div className="space-y-3 mb-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties</h4>
                                <div className="flex flex-wrap gap-1">
                                    {supplier.specialties.slice(0, 3).map((specialty, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                    {supplier.specialties.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{supplier.specialties.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Delivery Areas</h4>
                                <p className="text-sm text-gray-600">{supplier.deliveryAreas.slice(0, 3).join(', ')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                                <span className="text-gray-500">Orders:</span>
                                <span className="ml-1 font-medium text-gray-900">{supplier.totalOrders}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Revenue:</span>
                                <span className="ml-1 font-medium text-gray-900">₦{(supplier.totalRevenue / 1000).toFixed(0)}K</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-xs text-gray-500">
                                Joined {new Date(supplier.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredSuppliers.length}</span> of{' '}
                    <span className="font-medium">{filteredSuppliers.length}</span> results
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
