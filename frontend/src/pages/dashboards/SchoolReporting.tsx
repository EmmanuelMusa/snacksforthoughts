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
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);
        
        try {
            const formData = new FormData();
            formData.append('pupilsFedToday', pupilsFed);
            formData.append('menuServed', menuServed);
            formData.append('vendorName', vendorName);
            formData.append('qualityScore', qualityScore.toString());
            if (selectedImage) {
                formData.append('evidence', selectedImage);
            }

            const res = await fetch(`${apiBaseUrl}/api/dashboard/report`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const text = await res.text();
            let data: any = {};
            try { data = JSON.parse(text); } catch {}

            if (!res.ok) {
                throw new Error(data.error || data.message || `Server responded with ${res.status}: ${text.substring(0, 50)}`);
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
            {/* Premium Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 sticky top-0 z-50 shadow-sm">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white shadow-lg shadow-green-200">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight uppercase font-display">School Portal</h1>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">
                                <MapPin className="w-3 h-3 text-green-500" /> 
                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{user?.schoolName || 'St. Mary\'s Primary'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-gray-900 font-black ring-1 ring-gray-100 border border-white shadow-inner">
                            <span className="text-[10px] text-gray-400 -mb-1">MAR</span>
                            <span className="text-lg leading-none">{new Date().getDate()}</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
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

                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-white p-10 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl pointer-events-none" />
                        
                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="space-y-8">
                                <FormInput 
                                    label="Daily Feeding Count" 
                                    icon={<Users className="w-5 h-5" />}
                                    type="number" 
                                    placeholder="Enter total pupils fed today..."
                                    value={pupilsFed}
                                    onChange={setPupilsFed}
                                />

                                <FormInput 
                                    label="Today's Menu" 
                                    icon={<Utensils className="w-5 h-5" />}
                                    type="text" 
                                    placeholder="What was served today?"
                                    value={menuServed}
                                    onChange={setMenuServed}
                                />

                                <FormInput 
                                    label="Assigned Vendor" 
                                    icon={<Star className="w-5 h-5" />}
                                    type="text" 
                                    placeholder="Name of food supplier..."
                                    value={vendorName}
                                    onChange={setVendorName}
                                />

                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 text-center">Meal Quality Audit</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setQualityScore(star)}
                                                className="group relative focus:outline-none transition-transform active:scale-90"
                                            >
                                                <Star 
                                                    className={`w-10 h-10 transition-all duration-300 ${
                                                        qualityScore >= star 
                                                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                                                        : 'text-gray-200 fill-gray-50 group-hover:text-yellow-200'
                                                    }`} 
                                                />
                                                {qualityScore === star && (
                                                    <motion.div 
                                                        layoutId="star-label"
                                                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase text-gray-400 tracking-tighter"
                                                    >
                                                        {star === 1 ? 'Poor' : star === 2 ? 'Fair' : star === 3 ? 'Good' : star === 4 ? 'Great' : 'Excellent'}
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Evidence Portfolio</label>
                                    <input 
                                        type="file" 
                                        id="evidence-upload"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="evidence-upload"
                                        className="group relative border-2 border-dashed border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer overflow-hidden bg-gray-50/30"
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white shadow-xl">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="w-8 h-8 text-white" />
                                                    <span className="ml-2 text-white font-bold text-xs">Retake Photo</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="bg-white p-5 rounded-2xl shadow-sm mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                                    <Camera className="w-10 h-10 text-green-600" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-600">Capture Proof of Delivery</span>
                                                <p className="text-[10px] text-gray-400 mt-2 uppercase font-black tracking-widest">Geo-tagged live photo required</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full bg-gradient-to-r from-gray-900 to-black text-white py-6 rounded-3xl text-xl font-black flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-black/20 ${isSubmitting ? 'opacity-70' : 'hover:shadow-black/30 hover:-translate-y-1'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin text-green-400" />
                                        Submitting Report...
                                    </>
                                ) : (
                                    <>
                                        Authorize & Submit
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
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
        <div className="space-y-3">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                    {icon}
                </div>
                <input 
                    type={type} 
                    required
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] py-6 pl-16 pr-8 text-lg font-black text-gray-900 outline-none ring-4 ring-transparent focus:ring-green-100 focus:bg-white focus:border-green-400 transition-all placeholder:text-gray-300 shadow-sm" 
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

