import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDonation } from '../../context/DonationContext';
import { 
    Users, Building2, Leaf, ShieldCheck, 
    ArrowRight, Coins, BarChart3, Globe
} from 'lucide-react';

export default function PublicPortal() {
    const { apiBaseUrl } = useDonation();
    const [stats, setStats] = useState({ pupilsFed: 4260000, statesParticipating: 36, farmersEngaged: 125000 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${apiBaseUrl}/api/dashboard/public`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch public stats", err);
                setLoading(false);
            });
    }, [apiBaseUrl]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-50/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-8"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Transparency First: Live Data Feed
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight"
                    >
                        Feeding the <span className="text-green-600">Future</span> of <br/> Nigerian Excellence.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-xl text-gray-500 font-medium leading-relaxed mb-12"
                    >
                        Real-time transparency into the National Digital School Feeding Programme. 
                        Every meal, every school, every Naira accounted for.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <PublicMetricCard 
                            icon={<Users className="w-8 h-8" />} 
                            value={stats.pupilsFed.toLocaleString()} 
                            label="Pupils Fed To Date" 
                            delay={0.3}
                        />
                        <PublicMetricCard 
                            icon={<Globe className="w-8 h-8" />} 
                            value={stats.statesParticipating.toString()} 
                            label="States Covered" 
                            delay={0.4}
                        />
                        <PublicMetricCard 
                            icon={<Leaf className="w-8 h-8" />} 
                            value={stats.farmersEngaged.toLocaleString()} 
                            label="Farmers Engaged" 
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Impact Details */}
            <section className="bg-gray-50/50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black text-gray-900 leading-tight">
                                Accountability in <br />
                                <span className="text-green-600">Every Transaction.</span>
                            </h2>
                            <p className="text-lg text-gray-600 font-medium">
                                We've built a digital-first ecosystem where blockchain-grade tracking meets grassroots delivery. 
                                From farm gate procurement to the school kitchen, the data is live and verifiable.
                            </p>
                            <div className="space-y-6">
                                <FeatureItem 
                                    icon={<BarChart3 className="text-blue-600" />} 
                                    title="Dynamic Reporting" 
                                    desc="Daily digital records from over 8,500 schools participating nationwide."
                                />
                                <FeatureItem 
                                    icon={<Coins className="text-green-600" />} 
                                    title="Financial Integrity" 
                                    desc="Direct vendor payments ensure zero-leakage and immediate local economic impact."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-green-200 rounded-[3rem] blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Live Delivery Feed</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kano State Sector 4</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-green-600">+12,400 Units</span>
                                    </div>
                                    <div className="h-64 bg-gray-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
                                        <p className="text-gray-400 font-bold text-sm">Real-time Visualization Map</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto bg-black rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/20 blur-[100px] -z-0"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                            Join us in building a <br /> healthy, educated Nigeria.
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black flex items-center gap-2 transition-all">
                                Participate as Sponsor
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black transition-all">
                                View Full Report
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function PublicMetricCard({ icon, value, label, delay }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-green-400 transition-all text-center"
        >
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                {icon}
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">
                {value}
            </div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {label}
            </div>
        </motion.div>
    );
}

function FeatureItem({ icon, title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="w-12 h-12 flex-shrink-0 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center">
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-black text-gray-900">{title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

