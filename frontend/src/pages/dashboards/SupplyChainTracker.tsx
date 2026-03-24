import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDonation } from '../../context/DonationContext';
import { useAuth } from '../../context/AuthContext';
import { 
    Truck, Search, Filter, ArrowUpRight, 
    ChevronRight, MapPin, Package, Calendar
} from 'lucide-react';

export default function SupplyChainTracker() {
    const { apiBaseUrl } = useDonation();
    const { token } = useAuth();
    const [supplies, setSupplies] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/supply-chain`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setSupplies(data);
        })
        .catch(console.error);
    }, [apiBaseUrl, token]);

    const displaySupplies = supplies.length > 0 ? supplies : [
        { id: 1, product: 'Eggs', quantity: 1200000, unit: 'units', state: 'Oyo', status: 'Delivered', date: '2026-03-24' },
        { id: 2, product: 'Millet', quantity: 85, unit: 'tonnes', state: 'Kano', status: 'In Transit', date: '2026-03-24' },
        { id: 3, product: 'Beans', quantity: 60, unit: 'tonnes', state: 'Benue', status: 'Loading', date: '2026-03-24' },
        { id: 4, product: 'Plantain', quantity: 40, unit: 'tonnes', state: 'Rivers', status: 'Delivered', date: '2026-03-23' },
    ];

    const filteredSupplies = displaySupplies.filter(s => 
        s.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Food Supply Chain</h1>
                    <p className="text-gray-500 font-medium">End-to-end logistics from local farms to school kitchens</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search products or states..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-900 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Shipment Detail</th>
                                <th className="px-8 py-5">Quantity</th>
                                <th className="px-8 py-5">Logistics Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSupplies.map((item: any, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={item.id} 
                                    className="group hover:bg-gray-50/80 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-green-600">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{item.product}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                                    <MapPin className="w-3 h-3" /> {item.state}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-800">{item.quantity.toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.unit || 'units'}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider ${
                                            item.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                            item.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : 
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                                item.status === 'Delivered' ? 'bg-green-600' : 
                                                item.status === 'In Transit' ? 'bg-blue-600' : 
                                                'bg-orange-600'
                                            }`}></div>
                                            {item.status}
                                        </div>
                                        <p className="text-[9px] text-gray-400 font-medium mt-1 pl-3.5">EST. {item.date}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-gray-300 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Showing {filteredSupplies.length} of {displaySupplies.length} segments
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">Previous</button>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

