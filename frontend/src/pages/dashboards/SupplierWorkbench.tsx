import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    Package, 
    Truck, 
    CheckCircle, 
    Clock, 
    DollarSign,
    MapPin,
    Building2,
    Search,
    TrendingUp
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'

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
    const [requests, setRequests] = useState<SupplyRequest[]>([])
    const [loading, setLoading] = useState(true)

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${apiBaseUrl}/api/supplier/requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setRequests(data)
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-gray-900 font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Supplier Workbench</h1>
                <p className="text-gray-500 font-medium">Manage your regional supply assignments and confirm direct payments.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Column */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        Active Requests
                    </h2>
                    
                    <div className="space-y-4">
                        {requests.filter(r => r.status !== 'VERIFIED').map((req, idx) => (
                            <motion.div 
                                key={req.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 group hover:border-blue-200 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                req.status === 'PAYMENT_CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                req.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                'bg-orange-50 text-orange-700 border-orange-100'
                                            }`}>
                                                {req.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{req.id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 leading-tight">
                                            {req.school?.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                            <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.school?.lga}, {req.school?.state}</div>
                                            <div className="flex items-center gap-1 text-blue-600"><Package className="w-3 h-3" /> {req.items.length} Category Items</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        {req.status === 'PENDING' && (
                                            <button 
                                                onClick={() => updateStatus(req.id, 'PAYMENT_CONFIRMED')}
                                                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                                            >
                                                Confirm Payment
                                            </button>
                                        )}
                                        {req.status === 'PAYMENT_CONFIRMED' && (
                                            <button 
                                                onClick={() => updateStatus(req.id, 'DELIVERED')}
                                                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                                            >
                                                Mark as Delivered <Truck className="w-4 h-4" />
                                            </button>
                                        )}
                                        {req.status === 'DELIVERED' && (
                                            <div className="text-emerald-600 font-black text-xs flex items-center gap-2 px-6 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                                Awaiting Verification <Clock className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {req.items.map((item: any, i) => (
                                        <div key={i} className="p-3 bg-gray-50 rounded-xl">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter line-clamp-1">{item.name}</div>
                                            <div className="text-sm font-black text-gray-900">{item.quantity} units</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                        
                        {requests.filter(r => r.status !== 'VERIFIED').length === 0 && (
                            <div className="p-12 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold">No active supply requests assigned.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Summary Panel */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-gray-900">Performance</h2>
                    <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-900/20">
                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Deliveries</div>
                                <div className="text-4xl font-black">{requests.filter(r => r.status === 'VERIFIED').length}</div>
                            </div>
                            <div className="h-0.5 bg-white/10" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">State Rank</div>
                                    <div className="text-xl font-black">#4 in {requests[0]?.school?.state || 'Nigeria'}</div>
                                </div>
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Payment Guide</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex-shrink-0 flex items-center justify-center font-black text-xs">1</div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">Donor contacts you for payment via your registered phone number.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center font-black text-xs">2</div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">Verify credit in your bank account before clicking 'Confirm Payment'.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex-shrink-0 flex items-center justify-center font-black text-xs">3</div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">Ensure physical delivery and take photos for regional verifier checks.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
