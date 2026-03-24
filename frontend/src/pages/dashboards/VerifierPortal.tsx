import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShieldCheck,
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
    Building2
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'

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
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-emerald-600/60 font-medium animate-pulse">Initializing Verification Hub...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 pt-8">
            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Request List */}
                <div className="xl:col-span-3 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {requests.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 bg-white/30 backdrop-blur-md rounded-[3rem] border border-dashed border-gray-300"
                            >
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-300 rounded-[2rem] flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-400">All clear!</h3>
                                <p className="text-gray-500 font-medium">No pending deliveries require verification at this time.</p>
                            </motion.div>
                        ) : (
                            requests.map((req, idx) => (
                                <motion.div
                                    key={req.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative bg-white/60 backdrop-blur-lg border border-white/40 rounded-[2rem] p-1 shadow-xl hover:shadow-2xl hover:shadow-emerald-900/5 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row items-stretch gap-6 p-6">
                                        {/* Status & Meta */}
                                        <div className="lg:w-48 shrink-0 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    <Clock className="w-3 h-3" /> PENDING INSPECTION
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request ID</p>
                                                    <p className="text-xs font-mono font-bold text-gray-600">#{req.id.slice(-8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <div className="hidden lg:block pt-4 text-emerald-600/30">
                                                <Layers className="w-8 h-8" />
                                            </div>
                                        </div>

                                        {/* Main Details */}
                                        <div className="flex-1 space-y-6">
                                            <div className="flex flex-wrap items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                        {req.school?.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mt-1">
                                                        <MapPin className="w-4 h-4 text-rose-500" />
                                                        {req.school?.lga}, {req.school?.state}
                                                    </div>
                                                </div>
                                                <div className="bg-white/80 px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Supplier</p>
                                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-emerald-500" />
                                                        {req.supplier?.companyName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                <div className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Inventory</p>
                                                    <p className="text-sm font-bold text-gray-900 mt-1">{req.items.length} Categories</p>
                                                </div>
                                                <div className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Academic Period</p>
                                                    <p className="text-sm font-bold text-gray-900 mt-1">{req.academicPeriod}</p>
                                                </div>
                                                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Verification Status</p>
                                                    <p className="text-sm font-bold text-emerald-700 mt-1">Ready for Site Visit</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="lg:w-64 shrink-0 flex flex-col justify-center">
                                            <button
                                                onClick={() => handleVerify(req.id)}
                                                disabled={verifyingId === req.id}
                                                className="relative group/btn w-full py-4 bg-gray-900 text-white font-black rounded-2xl overflow-hidden transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 disabled:opacity-50"
                                            >
                                                <div className="relative z-10 flex items-center justify-center gap-2">
                                                    {verifyingId === req.id ? (
                                                        <>Submitting...</>
                                                    ) : (
                                                        <>Verify Delivery <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
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
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl -mr-16 -mt-16" />
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-lg">Region Insights</h4>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                                        <span>Verification Rate</span>
                                        <span>94%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-[94%] bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[10px] font-black text-gray-500 uppercase">This Month</p>
                                        <p className="text-2xl font-black mt-1">128</p>
                                    </div>
                                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Avg Time</p>
                                        <p className="text-2xl font-black mt-1">4.2h</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] p-8 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-600">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-black uppercase tracking-widest text-[10px]">Verification Protocol</span>
                        </div>
                        <p className="text-sm font-medium text-emerald-800/70">
                            Remote verification requires one geolocated photo and digital confirmation from the school representative.
                        </p>
                        <button className="w-full py-3 bg-white text-emerald-600 font-bold text-sm rounded-xl border border-emerald-100 shadow-sm hover:bg-emerald-50 transition-colors">
                            View Guidelines
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
