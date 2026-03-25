import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    Heart, 
    Package, 
    CheckCircle, 
    Clock, 
    Building2,
    Calendar,
    ArrowRight,
    ShieldCheck,
    Truck,
    Users,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    LogOut,
    MapPin,
    LayoutDashboard,
    History,
    Shield
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDonation } from '../../context/DonationContext'

export default function DonorDashboard() {
    const { apiBaseUrl } = useDonation()
    const navigate = useNavigate()
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DONATIONS' | 'SETTINGS'>('OVERVIEW')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`${apiBaseUrl}/api/donor/requests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const data = await res.json()
                setRequests(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Error fetching donor requests:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRequests()
    }, [apiBaseUrl])

    const [expandedRequest, setExpandedRequest] = useState<string | null>(null)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            </div>
        )
    }

    const totalSchools = new Set(requests.map(r => r.school?.name)).size
    const totalPupils = requests.reduce((acc, r) => acc + (r.school?.studentCount || 250), 0)

    const getTrailProgress = (status: string) => {
        const statuses = [
            'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'ADMIN_APPROVED', 
            'SUPPLIER_ALLOCATED', 'DISPATCHED', 'DELIVERED', 
            'RECEIVED', 'VERIFIED'
        ]
        const idx = statuses.indexOf(status)
        if (idx === -1) return 0
        return Math.round(((idx + 1) / statuses.length) * 100)
    }

    return (
        <div className="min-h-screen bg-[#FDFCFD] flex">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-rose-50/50 flex flex-col fixed h-full z-50">
                <div className="p-8 border-b border-gray-50 flex items-center gap-4">
                    <img src="/images/Snacks for Thoughts Logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                    <div>
                        <h2 className="text-sm font-black text-[#006D3E] leading-none uppercase tracking-tighter">PBAT FEEDS</h2>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-nowrap">Donor Dashboard</h3>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 mt-4">
                    {[
                        { id: 'OVERVIEW', icon: LayoutDashboard },
                        { id: 'DONATIONS', icon: Heart },
                        { id: 'SETTINGS', icon: CheckCircle }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20' : 'text-gray-400 hover:bg-rose-50 hover:text-gray-600'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.id.replace('DONATIONS', 'MY DONATIONS')}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-rose-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-80 p-10 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 font-display tracking-tight flex items-center gap-4">
                            {activeTab} <span className="text-gray-300">/</span> <span className="text-rose-600">IMPACT HUB</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Nourishing the Leaders of Tomorrow</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="px-6 py-3 bg-white border border-rose-100 rounded-2xl shadow-sm flex items-center gap-3">
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Premium Supporter</span>
                        </div>
                    </div>
                </div>

                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-12">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Schools Sponsored', value: totalSchools, icon: Building2, color: 'text-rose-600', bg: 'bg-rose-50' },
                                { label: 'Pupils Impacted', value: totalPupils.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Success Rate', value: '100%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all group"
                                >
                                    <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{stat.label}</div>
                                    <div className="text-4xl font-black text-gray-900 font-display">{stat.value}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Impact Hero */}
                        <div className="bg-gray-900 p-12 rounded-[4rem] text-white relative overflow-hidden group">
                            <div className="relative z-10 max-w-2xl space-y-8">
                                <div className="px-5 py-2 bg-rose-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] w-fit">Live Impact Update</div>
                                <h2 className="text-6xl font-black font-display tracking-tighter leading-[0.9]">Transforming Hunger into Hope.</h2>
                                <p className="text-gray-400 text-lg font-medium">Your contributions are currently funding 4 states across Nigeria. We've reached over {totalPupils.toLocaleString()} children today.</p>
                                <button className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-rose-50 transition-all flex items-center gap-3">
                                    View Full Impact Report <ArrowRight className="w-5 h-5 text-rose-600" />
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/20 blur-[120px] rounded-full group-hover:bg-rose-600/30 transition-all duration-700" />
                            <Heart className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 rotate-12" />
                        </div>
                    </div>
                )}

                {activeTab === 'DONATIONS' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 font-display">Donation Timeline</h3>
                            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                                {['ALL', 'ACTIVE', 'COMPLETED'].map(s => (
                                    <button key={s} className="px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600">{s}</button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {requests.map((req, idx) => (
                                <motion.div 
                                    key={req.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="px-4 py-1.5 bg-gray-50 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                                                    REF: {req.id.slice(-8).toUpperCase()}
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    req.status === 'VERIFIED' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                    req.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                    {req.status.replace('_', ' ')}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-3xl font-black text-gray-900 font-display mb-2">{req.school?.name}</h3>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {req.school?.state} / {req.school?.lga}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {[...Array(8)].map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`h-2 w-8 rounded-full ${i < (getTrailProgress(req.status) / 12.5) ? 'bg-rose-500 shadow-sm' : 'bg-gray-100'}`} 
                                                        title={`Point ${i+1}`} 
                                                    />
                                                ))}
                                                <span className="ml-4 text-[10px] font-black text-rose-600 uppercase tracking-widest">{getTrailProgress(req.status)}% TRACKED</span>
                                            </div>
                                        </div>

                                        <div className="lg:w-72 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between gap-6">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Academic Period</span>
                                                <span className="text-sm font-black text-gray-900 uppercase font-display">{req.academicPeriod}</span>
                                            </div>
                                            <div className="h-px bg-gray-100" />
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Supplier Assigned</span>
                                                <span className="text-sm font-black text-blue-600 uppercase font-display">{req.supplier?.companyName || 'Awaiting Allocation'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}


                {activeTab === 'SETTINGS' && (
                    <div className="max-w-2xl bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm">
                        <h3 className="text-2xl font-black text-gray-900 font-display mb-8">Profile Settings</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Display Name</label>
                                <input type="text" placeholder="Donor Account Name" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:border-rose-300 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input type="email" placeholder="donor@example.com" disabled className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed" />
                            </div>
                            <div className="pt-6">
                                <button className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20">
                                    Refresh Account Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
