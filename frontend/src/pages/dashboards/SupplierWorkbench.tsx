import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Package, 
    Truck, 
    CheckCircle, 
    Clock, 
    DollarSign,
    MapPin,
    Building2,
    Search,
    TrendingUp,
    LogOut,
    User as UserIcon,
    AlertCircle,
    ArrowRight,
    Activity,
    ClipboardCheck,
    Camera
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface SupplyRequest {
    id: string
    academicPeriod: string
    status: string
    items: any[]
    school: { name: string; state: string; lga: string }
    donor: { name: string }
    createdAt: string
}

export default function SupplierWorkbench() {
    const { apiBaseUrl } = useDonation()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [requests, setRequests] = useState<SupplyRequest[]>([])
    const [loading, setLoading] = useState(true)

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${apiBaseUrl}/api/supplier/requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setRequests(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching supplier requests:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [apiBaseUrl])

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${apiBaseUrl}/api/supplier/request/${id}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status })
            })
            if (res.ok) fetchRequests()
        } catch (err) {
            console.error('Error updating status:', err)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
                </div>
                <p className="text-emerald-800 font-bold animate-pulse">Syncing logistics data...</p>
            </div>
        )
    }

    const activeRequests = requests.filter(r => r.status !== 'VERIFIED')
    const completedCount = requests.filter(r => r.status === 'VERIFIED').length

    return (
        <div className="min-h-screen pb-20 space-y-8 max-w-7xl mx-auto px-4 pt-4">
            {/* Premium Glass Header */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-900/5 group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-500">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-md">Verified Supplier</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.state} SECTOR</span>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600">{user?.name || 'Partner'}</span>
                            </h1>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-6 py-3 bg-white/50 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold rounded-2xl border border-white/60 hover:border-red-100 transition-all duration-300 shadow-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Confirm Logout
                    </button>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Metrics Stats Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] text-white shadow-xl shadow-gray-900/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ClipboardCheck className="w-20 h-20" />
                            </div>
                            <div className="relative">
                                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Total Completed</p>
                                <div className="text-5xl font-black mb-2">{completedCount}</div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <Activity className="w-3 h-3" /> Over {requests.length} Total Assignments
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50"
                        >
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Active Pipeline</p>
                            <div className="text-5xl font-black text-emerald-600 mb-2">{activeRequests.length}</div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <Clock className="w-3 h-3 text-orange-400" /> Awaiting Fulfillment
                            </div>
                        </motion.div>
                    </div>

                    <div className="bg-emerald-50/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-emerald-100 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-black text-emerald-900 leading-tight">Supply Protocol</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { icon: DollarSign, text: "Wait for direct payment from Donors before shipping." },
                                { icon: Truck, text: "Mark as 'Delivered' immediately upon physical drop-off." },
                                { icon: Camera, text: "Take evidence photos for the platform verifiers." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <p className="text-xs text-emerald-800/70 font-bold leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-black text-gray-900 font-display">Active Supply Queue</h2>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter by School</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {activeRequests.length > 0 ? (
                                activeRequests.map((req, idx) => (
                                    <motion.div 
                                        key={req.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-emerald-900/5 group hover:border-emerald-200 transition-all duration-500 overflow-hidden relative"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl -mr-16 -mt-16 rounded-full group-hover:bg-emerald-500/10 transition-colors" />
                                        
                                        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border shadow-sm ${
                                                        req.status === 'PAYMENT_CONFIRMED' ? 'bg-blue-600 text-white border-blue-600' :
                                                        req.status === 'DELIVERED' ? 'bg-emerald-600 text-white border-emerald-600' :
                                                        'bg-orange-500 text-white border-orange-500'
                                                    }`}>
                                                        {req.status?.replace(/_/g, ' ')}
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {req.id.slice(-6).toUpperCase()}</span>
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{req.school?.name}</h3>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                                            <MapPin className="w-3.5 h-3.5" /> {req.school?.lga}, {req.school?.state}
                                                        </div>
                                                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                                                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                                            <Package className="w-3.5 h-3.5" /> {req.items.length} Category Items
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                                {req.status === 'PENDING' && (
                                                    <button 
                                                        onClick={() => updateStatus(req.id, 'PAYMENT_CONFIRMED')}
                                                        className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-black text-xs rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        Confirm Payment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                )}
                                                {req.status === 'PAYMENT_CONFIRMED' && (
                                                    <button 
                                                        onClick={() => updateStatus(req.id, 'DELIVERED')}
                                                        className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-black text-xs rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-950/30 flex items-center justify-center gap-2"
                                                    >
                                                        Dispatch to Site <Truck className="w-5 h-5 animate-bounce-slow" />
                                                    </button>
                                                )}
                                                {req.status === 'DELIVERED' && (
                                                    <div className="flex items-center gap-3 px-8 py-4 bg-emerald-50 text-emerald-700 font-black text-xs rounded-2xl border border-emerald-100 shadow-sm">
                                                        Pending Verification <Clock className="w-5 h-5 animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Item Breakdown Grid */}
                                        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-wrap gap-3">
                                            {req.items.map((item: any, i) => (
                                                <div key={i} className="px-4 py-3 bg-gray-50/50 rounded-2xl border border-gray-50 min-w-[140px] group-hover:bg-white transition-colors">
                                                    <div className="text-[10px] font-black text-gray-400 underline decoration-emerald-200 uppercase tracking-tighter mb-1">{item.name}</div>
                                                    <div className="text-base font-black text-gray-900">{item.quantity || 135} Units</div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-16 text-center bg-white/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <Package className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 font-bold">No active supply requests currently assigned to you.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
