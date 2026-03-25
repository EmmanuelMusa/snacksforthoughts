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
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'FEED'>('OVERVIEW')

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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            </div>
        )
    }

    const totalSchools = new Set(requests.map(r => r.school?.name)).size
    const pupilsImpacted = requests.reduce((acc, r) => {
        return acc + (r.items?.length > 0 ? 250 : 0)
    }, 0)

    return (
        <div className="space-y-12 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 font-display tracking-tight">Your Impact</h1>
                    <p className="text-gray-500 font-medium">Tracking the nourishment you've provided to Nigeria's future.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                    
                    <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
                        {[
                            { id: 'OVERVIEW', icon: LayoutDashboard },
                            { id: 'HISTORY', icon: History },
                            { id: 'FEED', icon: Shield }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                                    activeTab === tab.id ? 'bg-white text-rose-600 shadow-md' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.id}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {activeTab === 'OVERVIEW' && (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-2xl shadow-gray-200/30 flex flex-col justify-between group hover:border-rose-200 transition-all duration-500">
                            <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20 mb-6 group-hover:scale-110 transition-transform">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Schools Helped</div>
                                <div className="text-4xl font-black text-gray-900 font-display">{totalSchools}</div>
                            </div>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-2xl shadow-gray-200/30 flex flex-col justify-between group hover:border-blue-200 transition-all duration-500">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Pupils Impacted</div>
                                <div className="text-4xl font-black text-gray-900 font-display">{pupilsImpacted.toLocaleString()}+</div>
                            </div>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-2xl shadow-gray-200/30 flex flex-col justify-between group hover:border-emerald-200 transition-all duration-500">
                            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Success Rate</div>
                                <div className="text-4xl font-black text-gray-900 font-display">100%</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="px-4 py-1.5 bg-rose-600 rounded-full text-[8px] font-black uppercase tracking-[0.2em] w-fit">Live Impact Tracking</div>
                            <h2 className="text-5xl font-black font-display tracking-tight max-w-2xl leading-[0.95]">Nourishing the leaders of tomorrow.</h2>
                            <p className="text-gray-400 font-medium text-lg max-w-xl">Every meal provided is a direct investment in the educational future of young Nigerians.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 blur-[100px] rounded-full group-hover:bg-rose-600/30 transition-all" />
                    </div>
                </div>
            )}

            {activeTab === 'HISTORY' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-gray-900">Supply Timeline</h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {requests.length === 0 ? (
                            <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                                <Heart className="w-12 h-12 text-rose-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">No donations yet</h3>
                                <p className="text-gray-400 text-sm mb-6">Start your first supply request from the homepage.</p>
                                <a href="/" className="px-8 py-3 bg-gray-900 text-white font-black rounded-xl text-xs hover:bg-rose-600 transition-all">Find a School</a>
                            </div>
                        ) : (
                            requests.map((req, idx) => (
                                <motion.div 
                                    key={req.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/40 shadow-xl shadow-gray-200/30 group hover:border-rose-400/30 transition-all duration-500 overflow-hidden relative"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                                                    req.status === 'VERIFIED' ? 'bg-indigo-50/50 text-indigo-700 border-indigo-200' :
                                                    req.status === 'DELIVERED' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200' :
                                                    req.status === 'PAYMENT_CONFIRMED' ? 'bg-blue-50/50 text-blue-700 border-blue-200' :
                                                    'bg-orange-50/50 text-orange-700 border-orange-200'
                                                }`}>
                                                    {req.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">REF: {req.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                            
                                            <div>
                                                <h3 className="text-3xl font-black text-gray-900 font-display group-hover:text-rose-600 transition-colors tracking-tight">{req.school?.name}</h3>
                                                <div className="text-xs font-bold text-gray-400 flex items-center gap-2 mt-2">
                                                    <Calendar className="w-3.5 h-3.5" /> {req.academicPeriod} — Requested {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {(req.items || []).slice(0, 3).map((item: any, i: number) => (
                                                    <span key={i} className="px-4 py-2 bg-gray-50/50 border border-gray-100/50 text-gray-600 font-bold text-[10px] rounded-xl">
                                                        {item.quantity || 1} × {item.name}
                                                    </span>
                                                ))}
                                                {req.items?.length > 3 && (
                                                    <button 
                                                        onClick={() => setExpandedRequest(expandedRequest === req.id ? null : req.id)}
                                                        className="px-4 py-2 bg-rose-50 text-rose-600 font-black text-[10px] rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-2"
                                                    >
                                                        +{req.items.length - 3} more {expandedRequest === req.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                    </button>
                                                )}
                                            </div>

                                            {expandedRequest === req.id && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="pt-4 grid grid-cols-2 md:grid-cols-3 gap-3"
                                                >
                                                    {req.items?.slice(3).map((item: any, i: number) => (
                                                        <div key={i} className="p-3 bg-gray-50/30 rounded-xl border border-gray-100/30 text-[10px] font-bold text-gray-500">
                                                            {item.quantity || 1} × {item.name}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="lg:w-80 p-8 bg-gray-50/50 backdrop-blur-sm rounded-[2rem] border border-gray-100/80 space-y-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                                <Truck className="w-24 h-24" />
                                            </div>
                                            
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                                    <Truck className="w-4 h-4 text-rose-500" />
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-widest">Logistics Lead</div>
                                            </div>
                                            
                                            <div>
                                                <div className="text-lg font-black text-gray-900 font-display">{req.supplier?.companyName}</div>
                                                <div className="text-xs font-bold text-blue-600 mt-1">{req.supplier?.phone}</div>
                                            </div>
                                            
                                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Verification</span>
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase italic">LGA Authority</span>
                                                </div>
                                                {req.status === 'VERIFIED' ? (
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 shadow-sm shadow-indigo-100">
                                                        <ShieldCheck className="w-6 h-6 text-indigo-600" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 animate-pulse">
                                                        <Clock className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[40px] rounded-full pointer-events-none" />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'FEED' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                <img src={`https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop`} alt="School" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Abuja, Nigeria
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                <h3 className="text-xl font-black text-gray-900 font-display">Primary School Impact #{i}</h3>
                                <p className="text-sm text-gray-500 font-medium">Weekly supply of high-protein snacks delivered successfully.</p>
                                <div className="flex items-center gap-2 pt-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified by Local Authority</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-500 p-12 rounded-[3rem] text-white shadow-2xl shadow-rose-900/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-3xl font-black">Want to do more?</h3>
                        <p className="text-rose-100 font-medium max-w-md">Every snack counts. You can start another supply request for a different school or period right now.</p>
                    </div>
                    <a href="/#find-school" className="px-10 py-5 bg-white text-rose-600 font-black rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 group whitespace-nowrap">
                        New Donation Flow <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
                <Heart className="absolute -bottom-12 -right-12 w-64 h-64 text-white/10 rotate-12" />
            </div>
        </div>
    )
}
