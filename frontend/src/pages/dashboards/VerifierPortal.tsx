import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    ShieldCheck, 
    Truck, 
    CheckCircle, 
    Camera, 
    MapPin,
    Search,
    AlertCircle,
    Building2,
    Calendar,
    BarChart3
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
            // Simulation of photo upload and verification
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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 font-display text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Verifier Portal</h1>
                    <p className="text-gray-500 font-medium">Regional Verification Hub — Confirming transparency on the ground.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> AUTHORIZED VERIFIER
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {requests.length === 0 ? (
                    <div className="col-span-full p-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">No pending deliveries to verify</h3>
                        <p className="text-gray-400 text-sm">New deliveries from suppliers will appear here for inspection.</p>
                    </div>
                ) : (
                    requests.map((req, idx) => (
                        <motion.div 
                            key={req.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col group hover:shadow-emerald-900/10 transition-all border-b-4 border-b-gray-100 hover:border-b-emerald-500"
                        >
                            <div className="p-8 flex-1 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" /> {req.academicPeriod}
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                                        {req.school?.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                        <MapPin className="w-3 h-3" /> {req.school?.lga}, {req.school?.state}
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Supplier</span>
                                        <span className="text-xs font-bold text-gray-900">{req.supplier?.companyName}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Items</span>
                                        <span className="text-xs font-bold text-blue-600">{req.items.length} Categories</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mandatory Verification Task</div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-3 text-xs font-medium text-gray-600">
                                            <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                                <Camera className="w-3 h-3" />
                                            </div>
                                            Upload photo of delivered items at school.
                                        </li>
                                        <li className="flex items-center gap-3 text-xs font-medium text-gray-600">
                                            <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <AlertCircle className="w-3 h-3" />
                                            </div>
                                            Confirm quantities match request.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <button 
                                    onClick={() => handleVerify(req.id)}
                                    disabled={verifyingId === req.id}
                                    className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {verifyingId === req.id ? 'Processing...' : (
                                        <>
                                            Begin Verification <ShieldCheck className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Verification Stats Overlay */}
            <div className="fixed bottom-12 right-12 z-50 hidden xl:block">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] shadow-2xl flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Monthly Quota</div>
                        <div className="text-xl font-black text-gray-900">84% Accurate</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    )
}
