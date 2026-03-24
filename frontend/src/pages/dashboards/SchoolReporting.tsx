import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDonation } from '../../context/DonationContext';
import { useAuth } from '../../context/AuthContext';
import { 
    Camera, CheckCircle2, AlertCircle, 
    ArrowRight, Utensils, Users,
    QrCode, MapPin, Loader2, History as HistoryIcon,
    Building2, Star
} from 'lucide-react';

export default function SchoolReporting() {
    const { apiBaseUrl } = useDonation();
    const { token, user } = useAuth();
    const [pupilsFed, setPupilsFed] = useState('');
    const [menuServed, setMenuServed] = useState('');
    const [vendorName, setVendorName] = useState('');
    const [qualityScore, setQualityScore] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);
        
        try {
            const res = await fetch(`${apiBaseUrl}/api/dashboard/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    pupilsFedToday: pupilsFed, 
                    menuServed,
                    vendorName,
                    qualityScore
                })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit report');
            }

            setStatus({ type: 'success', message: 'Feeding report submitted successfully!' });
            setPupilsFed('');
            setMenuServed('');
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to submit report' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Sticky */}
            <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 leading-tight">Feeding Report</h1>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            <MapPin className="w-3 h-3" /> {user?.schoolName || 'St. Mary\'s Primary'}
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs ring-4 ring-green-50">
                        {new Date().getDate()}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-md mx-auto space-y-6">
                    
                    <AnimatePresence>
                        {status && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-4 rounded-2xl flex items-start gap-3 shadow-lg ${
                                    status.type === 'success' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-red-600 text-white'
                                }`}
                            >
                                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
                                <div className="flex-1">
                                    <p className="text-sm font-bold">{status.message}</p>
                                    {status.type === 'success' && (
                                        <button 
                                            onClick={() => setStatus(null)}
                                            className="mt-2 text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded"
                                        >
                                            Dismiss
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <FormInput 
                                    label="How many pupils were fed today?" 
                                    icon={<Users className="w-5 h-5" />}
                                    type="number" 
                                    placeholder="Total count..."
                                    value={pupilsFed}
                                    onChange={setPupilsFed}
                                />

                                <FormInput 
                                    label="What was on the menu?" 
                                    icon={<Utensils className="w-5 h-5" />}
                                    type="text" 
                                    placeholder="e.g. Rice & Beans..."
                                    value={menuServed}
                                    onChange={setMenuServed}
                                />

                                <FormInput 
                                    label="Vendor / Food Supplier" 
                                    icon={<Building2 className="w-5 h-5" />}
                                    type="text" 
                                    placeholder="Enter vendor name..."
                                    value={vendorName}
                                    onChange={setVendorName}
                                />

                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-gray-800 uppercase tracking-widest ml-1 text-center">Meal Quality Score</label>
                                    <div className="flex justify-center gap-4">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => setQualityScore(num)}
                                                className={`w-12 h-12 rounded-2xl font-black text-lg transition-all ${
                                                    qualityScore === num 
                                                    ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-110' 
                                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                                }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-black text-gray-800 uppercase tracking-widest ml-1">Proof of Feeding</label>
                                    <div className="group relative border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer overflow-hidden">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                            <Camera className="w-8 h-8 text-green-600" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-500">Tap to capture live photo</span>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Mandatory for verification</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full bg-black text-white py-5 rounded-[2rem] text-lg font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-black/10 ${isSubmitting ? 'opacity-70' : 'hover:bg-gray-800'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Submit Report
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Quick Action */}
                    <div className="flex items-center gap-4">
                        <button className="flex-1 bg-white border border-gray-200 p-4 rounded-3xl flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors shadow-sm">
                            <QrCode className="w-6 h-6 text-blue-600" />
                            <span className="text-[10px] font-black uppercase text-gray-500">Scan Delivery</span>
                        </button>
                        <button className="flex-1 bg-white border border-gray-200 p-4 rounded-3xl flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors shadow-sm">
                            <HistoryIcon className="w-6 h-6 text-purple-600" />
                            <span className="text-[10px] font-black uppercase text-gray-500">View History</span>
                        </button>
                    </div>

                    <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pt-4">
                        Powered by PBAT Digital Feeds Engine
                    </p>
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, icon, type, placeholder, value, onChange }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-black text-gray-800 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
                <input 
                    type={type} 
                    required
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-lg font-bold text-gray-900 outline-none ring-2 ring-transparent focus:ring-green-500 transition-all placeholder:text-gray-300 shadow-inner" 
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

