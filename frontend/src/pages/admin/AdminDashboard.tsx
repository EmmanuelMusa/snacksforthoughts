import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    Building2,
    Calendar,
    Package,
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    BarChart3,
    PieChart
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'

interface DashboardStats {
    totalSchools: number
    totalSuppliers: number
    totalDonations: number
    totalAmount: number
    activeWeeks: number
    reservedWeeks: number
    pendingDonations: number
    completedDonations: number
}

interface WeeklyData {
    week: string
    available: number
    reserved: number
    total: number
}

interface SupplierData {
    id: string
    name: string
    orders: number
    revenue: number
    rating: number
}

export default function AdminDashboard() {
    const { apiBaseUrl } = useDonation()
    const [stats, setStats] = useState<DashboardStats>({
        totalSchools: 0,
        totalSuppliers: 0,
        totalDonations: 0,
        totalAmount: 0,
        activeWeeks: 0,
        reservedWeeks: 0,
        pendingDonations: 0,
        completedDonations: 0
    })

    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
    const [topSuppliers, setTopSuppliers] = useState<SupplierData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const [schoolsRes, suppliersRes, donationsRes] = await Promise.all([
                    fetch(`${apiBaseUrl}/api/schools/search?limit=1&page=1`),
                    fetch(`${apiBaseUrl}/api/suppliers`),
                    fetch(`${apiBaseUrl}/api/donations?limit=100`),
                ])

                const schoolsJson = await schoolsRes.json()
                const suppliersJson = await suppliersRes.json()
                const donationsJson = await donationsRes.json()

                const schoolsPayload = (schoolsJson as any).data ?? schoolsJson
                const totalSchools = schoolsPayload.pagination?.total || 0

                const suppliers = Array.isArray(suppliersJson) ? suppliersJson : (suppliersJson.data ?? [])
                const totalSuppliers = Array.isArray(suppliers) ? suppliers.length : 0

                const donations = Array.isArray(donationsJson) ? donationsJson : (donationsJson.data ?? [])
                const totalDonations = Array.isArray(donations) ? donations.length : 0
                const totalAmount = Array.isArray(donations)
                    ? donations.reduce((sum: number, d: any) => sum + (typeof d.amount === 'number' ? d.amount : 0), 0)
                    : 0

                const nextStats: DashboardStats = {
                    totalSchools,
                    totalSuppliers,
                    totalDonations,
                    totalAmount,
                    activeWeeks: 0,
                    reservedWeeks: 0,
                    pendingDonations: 0,
                    completedDonations: 0,
                }

                if (!cancelled) {
                    setStats(nextStats)
                    setWeeklyData([])
                    setTopSuppliers(
                        Array.isArray(suppliers)
                            ? suppliers.slice(0, 5).map((s: any) => ({
                                id: s.id,
                                name: s.name,
                                orders: 0,
                                revenue: 0,
                                rating: s.rating || 0,
                            }))
                            : [],
                    )
                    setLoading(false)
                }
            } catch {
                if (!cancelled) setLoading(false)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [apiBaseUrl])

    const statCards = [
        {
            title: 'Total Schools',
            value: stats.totalSchools.toLocaleString(),
            icon: Building2,
            color: 'blue',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Active Suppliers',
            value: stats.totalSuppliers.toString(),
            icon: Package,
            color: 'green',
            change: '+2',
            changeType: 'positive'
        },
        {
            title: 'Total Donations',
            value: stats.totalDonations.toString(),
            icon: TrendingUp,
            color: 'purple',
            change: '+23%',
            changeType: 'positive'
        },
        {
            title: 'Total Amount',
            value: `₦${(stats.totalAmount / 1000000).toFixed(1)}M`,
            icon: DollarSign,
            color: 'yellow',
            change: '+18%',
            changeType: 'positive'
        },
        {
            title: 'Available Weeks',
            value: stats.activeWeeks.toString(),
            icon: Calendar,
            color: 'indigo',
            change: '-5',
            changeType: 'negative'
        },
        {
            title: 'Reserved Weeks',
            value: stats.reservedWeeks.toString(),
            icon: Clock,
            color: 'orange',
            change: '+8',
            changeType: 'positive'
        },
        {
            title: 'Pending Donations',
            value: stats.pendingDonations.toString(),
            icon: AlertCircle,
            color: 'red',
            change: '+3',
            changeType: 'negative'
        },
        {
            title: 'Completed',
            value: stats.completedDonations.toString(),
            icon: CheckCircle,
            color: 'emerald',
            change: '+15',
            changeType: 'positive'
        }
    ]

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
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Monitor and manage the Snacks For Thoughts - PBAT Feeds initiative
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon
                    const colorClasses = {
                        blue: 'bg-blue-500 text-white',
                        green: 'bg-green-500 text-white',
                        purple: 'bg-purple-500 text-white',
                        yellow: 'bg-yellow-500 text-white',
                        indigo: 'bg-indigo-500 text-white',
                        orange: 'bg-orange-500 text-white',
                        red: 'bg-red-500 text-white',
                        emerald: 'bg-emerald-500 text-white'
                    }

                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Availability Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Weekly Availability</h3>
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {weeklyData.map((week, index) => (
                            <div key={week.week} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">{week.week}</span>
                                    <span className="text-gray-500">{week.available}/{week.total} available</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(week.available / week.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Suppliers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Top Suppliers</h3>
                        <PieChart className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {topSuppliers.map((supplier, index) => (
                            <div key={supplier.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{supplier.name}</p>
                                        <p className="text-sm text-gray-500">{supplier.orders} orders</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">₦{(supplier.revenue / 1000).toFixed(0)}K</p>
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-500">⭐ {supplier.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {[
                        { action: 'New donation received', school: 'Sunrise Primary', amount: '₦15,000', time: '2 hours ago' },
                        { action: 'Week reserved', school: 'Unity Primary', amount: 'Week 3', time: '4 hours ago' },
                        { action: 'Payment confirmed', school: 'Greenfield School', amount: '₦22,500', time: '6 hours ago' },
                        { action: 'New supplier registered', school: 'Nestlé Nigeria', amount: 'Food & Nutrition', time: '1 day ago' },
                        { action: 'Donation completed', school: 'Harmony Primary', amount: '₦18,000', time: '2 days ago' },
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-500">{activity.school}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-900">{activity.amount}</p>
                                <p className="text-sm text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
