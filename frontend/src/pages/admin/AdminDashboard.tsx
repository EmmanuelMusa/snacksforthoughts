import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    Users, 
    Building2, 
    Package, 
    TrendingUp, 
    CheckCircle, 
    Clock, 
    Truck, 
    BarChart3, 
    ShieldCheck, 
    Filter,
    Search
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'

interface AdminStats {
    totalRequests: number
    pendingPayments: number
    paidRequests: number
    deliveredRequests: number
    verifiedRequests: number
    totalSchools: number
}

interface SupplyRequest {
    id: string
    academicPeriod: string
    status: string
    items: any[]
    school: { name: string; state: string }
    supplier: { companyName: string }
    donor: { name: string }
    createdAt: string
}

export default function AdminDashboard() {
    const { apiBaseUrl } = useDonation()
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [supplies, setSupplies] = useState<SupplyRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('ALL')

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token')
                const [statsRes, suppliesRes] = await Promise.all([
                    fetch(`${apiBaseUrl}/api/admin/overview`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${apiBaseUrl}/api/admin/supplies`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ])
                
                const statsData = await statsRes.json()
                const suppliesData = await suppliesRes.json()
                
                setStats(statsData)
                setSupplies(suppliesData)
            } catch (err) {
                console.error('Error fetching admin data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [apiBaseUrl])

    const filteredSupplies = filterStatus === 'ALL' 
        ? supplies 
        : supplies.filter(s => s.status === filterStatus)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const statCards = [
        { label: 'Total Volume', value: stats?.totalRequests || 0, icon: Package, color: 'bg-blue-600' },
        { label: 'Awaiting Payment', value: stats?.pendingPayments || 0, icon: Clock, color: 'bg-orange-500' },
        { label: 'Processing', value: stats?.paidRequests || 0, icon: Truck, color: 'bg-emerald-500' },
        { label: 'Verified Delivery', value: stats?.verifiedRequests || 0, icon: ShieldCheck, color: 'bg-indigo-600' }
    ]

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 font-display">Command Center</h1>
                    <p className="text-gray-500 font-medium">National Digital School Feeding Registry — Live Feed</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-50 text-green-700 text-xs font-black rounded-full border border-green-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        SYSTEM OPERATIONAL
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center gap-5"
                    >
                        <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{card.label}</div>
                            <div className="text-2xl font-black text-gray-900">{card.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Supply Tracker */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Supply Tracker</h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                            {['ALL', 'PENDING', 'PAYMENT_CONFIRMED', 'DELIVERED', 'VERIFIED'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                                        filterStatus === s ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {s.split('_')[0]}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search tracker..."
                                className="pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Request ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Target School / State</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Supplier</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Donor</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSupplies.map((supply) => (
                                <tr key={supply.id} className="hover:bg-blue-50/10 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-gray-900 text-xs">#{supply.id.slice(-8).toUpperCase()}</div>
                                        <div className="text-[10px] text-blue-600 font-bold">{supply.academicPeriod}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-gray-800 text-sm">{supply.school?.name}</div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-black uppercase">
                                            <Building2 className="w-3 h-3" /> {supply.school?.state}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-gray-800 text-sm">{supply.supplier?.companyName}</div>
                                    </td>
                                    <td className="px-8 py-6 font-medium text-sm text-gray-600">
                                        {supply.donor?.name}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border shrink-0 ${
                                            supply.status === 'VERIFIED' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                            supply.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            supply.status === 'PAYMENT_CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                            {supply.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right font-bold text-xs text-gray-400">
                                        {new Date(supply.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredSupplies.length === 0 && (
                        <div className="p-20 text-center font-bold text-gray-300">
                            No supply records found for this filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
