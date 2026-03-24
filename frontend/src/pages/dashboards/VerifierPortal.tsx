import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    ShieldCheck,
    Package,
    Truck,
    CheckCircle,
    Camera,
    MapPin,
    AlertCircle,
    Calendar,
    BarChart3,
    ArrowRight,
    Layers,
    Clock,
    FileText,
    Building2,
    LogOut,
    User,
    Settings,
    Bell
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'
import { useAuth } from '../../context/AuthContext'

interface SupplyRequest {
    id: string
    academicPeriod: string
    status: string
    items: any[]
    school: { name: string; state: string; lga: string }
    supplier: { companyName: string }
    donor: { name: string }
    createdAt: string
}

export default function VerifierPortal() {
    const { apiBaseUrl } = useDonation()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [requests, setRequests] = useState<SupplyRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [verifyingId, setVerifyingId] = useState<string | null>(null)

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${apiBaseUrl}/api/verifier/requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setRequests(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching verifier requests:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [apiBaseUrl])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleVerify = async (id: string) => {
        setVerifyingId(id)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${apiBaseUrl}/api/verifier/request/${id}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    verificationPhoto: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80',
                    notes: 'Delivery inspected and confirmed at school premises.'
                })
            })
            if (res.ok) fetchRequests()
        } catch (err) {
            console.error('Error verifying request:', err)
        } finally {
            setVerifyingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-emerald-700 font-bold tracking-widest uppercase text-xs animate-pulse">Initializing Secure Portal...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 px-4 sm:px-6 lg:px-8 pt-6">
            {/* Header Section */}
            <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200">
                            <ShieldCheck className="w-8 h-8" />
                        </span>
                        Verification Hub
                    </h1>
                    <p className="mt-2 text-slate-500 font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        Monitoring school feeding deliveries nationwide.
                    </p>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Signed in as</span>
                            <span className="text-sm font-bold text-slate-900">{user?.name || 'Verifier'}</span>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-4 bg-white border border-rose-100 text-rose-500 rounded-[1.5rem] shadow-sm hover:bg-rose-50 transition-all group"
                        title="Logout"
                    >
                        <LogOut className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Request List */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-emerald-500" />
                            Pending Actions
                            <span className="ml-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                {requests.length}
                            </span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {requests.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200"
                            >
                                <div className="w-24 h-24 bg-emerald-50 text-emerald-300 rounded-[2.5rem] flex items-center justify-center mb-8">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-400">System Balanced</h3>
                                <p className="text-slate-500 font-medium mt-2">All scheduled deliveries have been verified.</p>
                            </motion.div>
                        ) : (
                            requests.map((req, idx) => (
                                <motion.div
                                    key={req.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group bg-white border border-slate-200 rounded-[2.5rem] p-2 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                                >
                                    <div className="flex flex-col lg:flex-row items-stretch gap-6 p-6">
                                        {/* Meta Section */}
                                        <div className="lg:w-48 shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6">
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    <Clock className="w-3 h-3" /> ACTION REQUIRED
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                                                    <p className="text-sm font-mono font-black text-slate-700">#{req.id.slice(-8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center gap-2 text-slate-300">
                                                <Layers className="w-6 h-6" />
                                                <div className="h-1 flex-1 bg-slate-50 rounded-full" />
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 space-y-8">
                                            <div className="flex flex-wrap items-start justify-between gap-6">
                                                <div>
                                                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                        {req.school?.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mt-2">
                                                        <MapPin className="w-4 h-4 text-rose-500" />
                                                        {req.school?.lga}, {req.school?.state}
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                                        <Building2 className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Supplier</p>
                                                        <p className="text-sm font-black text-slate-800">{req.supplier?.companyName}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Package className="w-4 h-4 text-emerald-500" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contents</p>
                                                    </div>
                                                    <p className="text-sm font-black text-slate-800">{req.items.length} Supply Categories</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Term</p>
                                                    </div>
                                                    <p className="text-sm font-black text-slate-800">{req.academicPeriod}</p>
                                                </div>
                                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 col-span-2 md:col-span-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Inspection</p>
                                                    </div>
                                                    <p className="text-sm font-black text-emerald-800">Ready for Verification</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="lg:w-72 shrink-0 flex flex-col justify-center gap-4 lg:pl-6">
                                            <button
                                                onClick={() => handleVerify(req.id)}
                                                disabled={verifyingId === req.id}
                                                className="relative group/verify overflow-hidden bg-slate-900 text-white p-5 rounded-3xl font-black text-sm tracking-tight transition-all hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-200 disabled:opacity-50"
                                            >
                                                <div className="relative z-10 flex items-center justify-center gap-3">
                                                    {verifyingId === req.id ? (
                                                        <>Processing...</>
                                                    ) : (
                                                        <>Verify Delivery <ArrowRight className="w-5 h-5 group-hover/verify:translate-x-1 transition-transform" /></>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 opacity-0 group-hover/verify:opacity-100 transition-opacity duration-500" />
                                            </button>
                                            <button className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-400 hover:text-rose-500 transition-all">
                                                <AlertCircle className="w-4 h-4" /> Report Issue
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl -mr-24 -mt-24 group-hover:bg-emerald-500/20 transition-colors" />
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg leading-none">Operations</h4>
                                    <p className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest mt-1">Efficiency Metrics</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Regional Coverage</span>
                                        <span className="text-emerald-400">94.2%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: "94.2%" }}
                                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Verified</p>
                                        <p className="text-3xl font-black mt-3 text-white">128</p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Avg Hrs</p>
                                        <p className="text-3xl font-black mt-3 text-white">4.2</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[3rem] p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-4 text-emerald-600">
                            <div className="p-3 bg-emerald-50 rounded-2xl">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-xs">Strict Protocol</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                            Site verification necessitates physical presence, a synchronized geolocated capture, and an authorized signature from the school lead.
                        </p>
                        <button className="w-full py-4 bg-emerald-50 text-emerald-700 font-black text-sm rounded-2xl transition-all hover:bg-emerald-100">
                            Download Compliance PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
