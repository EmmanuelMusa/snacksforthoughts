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
    Truck
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'

interface SupplyRequest {
    id: string
    academicPeriod: string
    status: string
    items: any[]
    school: { name: string; state: string }
    supplier: { companyName: string; phone: string }
    createdAt: string
}

export default function DonorDashboard() {
    const { apiBaseUrl } = useDonation()
    const [requests, setRequests] = useState<SupplyRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`${apiBaseUrl}/api/donor/requests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const data = await res.json()
                setRequests(data)
            } catch (err) {
                console.error('Error fetching donor requests:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRequests()
    }, [apiBaseUrl])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            </div>
        )
    }

    const totalSchools = new Set(requests.map(r => r.school?.name)).size
    const totalItems = requests.reduce((acc, r) => acc + r.items.length, 0)

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 font-display">Your Impact</h1>
                    <p className="text-gray-500 font-medium">Tracking the nourishment you've provided to Nigeria's future.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Schools Helped</div>
                            <div className="text-2xl font-black text-gray-900">{totalSchools}</div>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Supplies</div>
                            <div className="text-2xl font-black text-gray-900">{totalItems}</div>
                        </div>
                    </div>
                </div>
            </div>

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
                                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:border-rose-200 transition-all"
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                            req.status === 'VERIFIED' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                            req.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            req.status === 'PAYMENT_CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                            {req.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{req.id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-rose-600 transition-colors uppercase">{req.school?.name}</h3>
                                        <div className="text-xs font-bold text-gray-400 flex items-center gap-2 mt-1">
                                            <Calendar className="w-3 h-3" /> {req.academicPeriod} — Requested {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {req.items.slice(0, 3).map((item: any, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-50 text-gray-500 font-bold text-[10px] rounded-lg">
                                                {item.quantity} × {item.name}
                                            </span>
                                        ))}
                                        {req.items.length > 3 && (
                                            <span className="px-3 py-1 bg-gray-50 text-gray-400 font-bold text-[10px] rounded-lg">
                                                +{req.items.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:w-72 p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Truck className="w-4 h-4" />
                                        <div className="text-[10px] font-black uppercase tracking-widest">Logistics Lead</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-gray-900">{req.supplier?.companyName}</div>
                                        <div className="text-xs font-bold text-blue-600">{req.supplier?.phone}</div>
                                    </div>
                                    <div className="h-px bg-gray-200" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Verification Level</span>
                                        {req.status === 'VERIFIED' ? (
                                            <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
            
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
