import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDonation } from '../../context/DonationContext';
import { useAuth } from '../../context/AuthContext';
import { 
    Building2, Users, Package, TrendingUp, 
    ArrowUpRight, Download, Calendar, 
    MapPin, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell,
    LineChart, Line, AreaChart, Area 
} from 'recharts';

// Mock data for State performance
const lgaPerformanceData = [
    { name: 'Ikeja', schools: 45, pupils: 12500, status: '98%' },
    { name: 'Alimosho', schools: 82, pupils: 28400, status: '95%' },
    { name: 'Oshodi', schools: 38, pupils: 11200, status: '92%' },
    { name: 'Epe', schools: 25, pupils: 7800, status: '88%' },
    { name: 'Badagry', schools: 30, pupils: 9500, status: '94%' },
];

const weeklyFeedingData = [
    { day: 'Mon', count: 14500 },
    { day: 'Tue', count: 15200 },
    { day: 'Wed', count: 14800 },
    { day: 'Thu', count: 15600 },
    { day: 'Fri', count: 15100 },
];

export default function StateDashboard() {
    const { apiBaseUrl } = useDonation();
    const { token, user } = useAuth();
    const [stats, setStats] = useState({ 
        pupilsFedToday: 15100, 
        schoolsParticipating: 220, 
        vendorsActive: 45,
        totalSchoolsInState: 220
    });
    const stateName = user?.state || 'Lagos';
    const [isLoading, setIsLoading] = useState(true);
    const currentDate = new Date().toLocaleDateString('en-NG', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`${apiBaseUrl}/api/dashboard/state/${stateName}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(async res => {
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Server responded with ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data) setStats(prev => ({
                ...prev,
                pupilsFedToday: Number(data.pupilsFedToday ?? prev.pupilsFedToday),
                schoolsParticipating: Number(data.schoolsParticipating ?? prev.schoolsParticipating),
                vendorsActive: Number(data.vendorsActive ?? prev.vendorsActive),
                totalSchoolsInState: Number(data.totalSchoolsInState ?? prev.totalSchoolsInState),
            }));
            setIsLoading(false);
        })
        .catch(err => {
            console.error("State Dashboard Fetch Error:", err);
            setError(err.message);
            setIsLoading(false);
        });
    }, [apiBaseUrl, token, stateName]);

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-xl uppercase tracking-tighter">
                            {stateName.substring(0, 3)}
                        </span>
                        {stateName} State Control
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Monitoring Operational Excellence across all LGAs</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                        {currentDate}
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">System Error: {error}</p>
                </div>
            )}

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard 
                    label="Active Schools" 
                    value={stats.schoolsParticipating} 
                    icon={<Building2 className="w-6 h-6" />} 
                    color="blue" 
                    trend={`of ${stats.totalSchoolsInState} total`}
                />
                <MetricCard 
                    label="Pupils Fed Today" 
                    value={stats.pupilsFedToday.toLocaleString()} 
                    icon={<Users className="w-6 h-6" />} 
                    color="green" 
                    trend="94% attendance"
                />
                <MetricCard 
                    label="Verified Vendors" 
                    value={stats.vendorsActive} 
                    icon={<Package className="w-6 h-6" />} 
                    color="orange" 
                    trend="All zones covered"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LGA Performance Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">LGA Performance Matrix</h3>
                            <p className="text-sm text-gray-500">Comparing pupil engagement across top regions</p>
                        </div>
                        <button className="text-blue-600 font-bold text-sm hover:underline">View Detailed Rankings</button>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lgaPerformanceData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#475569', fontSize: 13, fontWeight: 600}} 
                                />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="pupils" radius={[0, 8, 8, 0]} barSize={32}>
                                    {lgaPerformanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#16a34a' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status and Alerts Column */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">State Health Check</h3>
                        <div className="space-y-4">
                            <StatusRow icon={<CheckCircle2 className="text-green-500" />} label="Data Reporting" value="On-Time" />
                            <StatusRow icon={<CheckCircle2 className="text-green-500" />} label="Fund Utilization" value="Optimized" />
                            <StatusRow icon={<AlertCircle className="text-orange-500" />} label="Vendor Compliance" value="Reviewing 2" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                         <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="text-blue-600 w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Performance Tracking</h3>
                        <p className="text-sm text-gray-500 mb-4">Real-time monitoring of operational excellence across all geopolitical zones.</p>
                        <div className="w-full bg-blue-600 text-white p-4 rounded-2xl">
                             <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Impact Goal</p>
                             <p className="text-2xl font-black">+1.2M Meals</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Weekly Flow</h3>
                            <ArrowUpRight className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weeklyFeedingData}>
                                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, color, trend }: any) {
    const colorMap: any = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600'
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${colorMap[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{label}</p>
                    <p className="text-3xl font-black text-gray-900">{value}</p>
                    <p className="text-xs font-bold text-gray-500 mt-1">{trend}</p>
                </div>
            </div>
        </motion.div>
    );
}

function StatusRow({ icon, label, value }: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{value}</span>
        </div>
    );
}

