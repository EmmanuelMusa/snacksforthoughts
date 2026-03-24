import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDonation } from '../../context/DonationContext';
import { useAuth } from '../../context/AuthContext';
import { 
    Building2, Users, FileCheck, ShieldCheck, 
    AlertTriangle, ClipboardCheck, Info,
    History, MapPin, Search, AlertCircle
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Mock data for LGA tracking
const feedingComplianceData = [
    { name: 'Completed', value: 28, color: '#16a34a' },
    { name: 'Partial', value: 4, color: '#f59e0b' },
    { name: 'Pending', value: 2, color: '#94a3b8' },
];

const schoolActivityData = [
    { name: 'Ikeja High', pupils: 1200, status: 'Active' },
    { name: 'G.R.A Primary', pupils: 850, status: 'Active' },
    { name: 'Central Sec', pupils: 640, status: 'Partial' },
    { name: 'Maryland Sch', pupils: 1100, status: 'Active' },
];

export default function LGAMonitor() {
    const { apiBaseUrl } = useDonation();
    const { token, user } = useAuth();
    const [stats, setStats] = useState({ 
        schoolsFeeding: 34, 
        pupilsServed: 8450, 
        inspectionVisits: 12,
        schools: [] as any[],
        totalSchoolsInLga: 34
    });
    const lgaName = (user?.lga || 'IKEJA').toUpperCase();
    const [isLoading, setIsLoading] = useState(true);
    const currentDate = new Date().toLocaleDateString('en-NG', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`${apiBaseUrl}/api/dashboard/lga/${lgaName}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                let msg = text;
                try { msg = JSON.parse(text).error || text; } catch {}
                throw new Error(msg || `Server responded with ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data) setStats(prev => ({
                ...prev,
                schoolsFeeding: Number(data.schoolsFeeding ?? prev.schoolsFeeding),
                pupilsServed: Number(data.pupilsServed ?? prev.pupilsServed),
                inspectionVisits: Number(data.inspectionVisits ?? prev.inspectionVisits),
                schools: Array.isArray(data.schools) ? data.schools : prev.schools,
                totalSchoolsInLga: Number(data.totalSchoolsInLga ?? prev.totalSchoolsInLga),
            }));
            setIsLoading(false);
        })
        .catch(err => {
            console.error("LGA Monitor Fetch Error:", err);
            setError(err.message);
            setIsLoading(false);
        });
    }, [apiBaseUrl, token, lgaName]);

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center">
                        <MapPin className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">{lgaName} Monitoring Panel</h1>
                        <p className="text-sm text-gray-500 font-medium tracking-tight">Level 3: Local Government Monitoring Panel</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                        {currentDate}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                        <History className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Live System Active</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">System Error: {error}</p>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard 
                    label="Schools Feeding" 
                    value={stats.schoolsFeeding} 
                    icon={<Building2 />} 
                    color="blue" 
                    secondary={`of ${stats.totalSchoolsInLga} total`}
                />
                <MetricCard 
                    label="Pupils Served" 
                    value={stats.pupilsServed.toLocaleString()} 
                    icon={<Users />} 
                    color="green" 
                />
                <MetricCard 
                    label="Inspection Visits" 
                    value={stats.inspectionVisits} 
                    icon={<FileCheck />} 
                    color="purple" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Compliance Pie Chart */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Feeding Compliance</h3>
                            <p className="text-sm text-gray-500">Daily reporting status for all {stats.schoolsFeeding} schools</p>
                        </div>
                        <ShieldCheck className="text-green-600 w-6 h-6" />
                    </div>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={feedingComplianceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {feedingComplianceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-gray-800">82%</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Target Met</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        {feedingComplianceData.map((item) => (
                            <div key={item.name} className="bg-gray-50 rounded-2xl p-3 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.name}</p>
                                <p className="text-lg font-black text-gray-800">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Local Activity List */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Schools Performance</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Filter schools..." 
                                className="pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 w-48"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {stats.schools.length > 0 ? stats.schools.map((school, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-sm font-bold text-gray-700">
                                        🏫
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{school.name}</p>
                                        <p className="text-xs text-gray-500">{school.pupilsCount || 'N/A'} Pupils • {school.address || 'Local Area'}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700`}>
                                    ACTIVE
                                </div>
                            </div>
                        )) : schoolActivityData.map((school, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-sm font-bold text-gray-700">
                                        {school.name.substring(0, 1)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{school.name}</p>
                                        <p className="text-xs text-gray-500">{school.pupils.toLocaleString()} Pupils</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    school.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {school.status}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm font-bold text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                        View All {stats.schoolsFeeding} Local Schools
                    </button>
                </div>
            </div>

            {/* Inspections Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Recent Quality Assessments
                            <div className="bg-purple-100 text-purple-700 p-1.5 rounded-lg">
                                <ClipboardCheck className="w-4 h-4" />
                            </div>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Latest hygiene and safety reports from field officers</p>
                    </div>
                    <button className="btn-primary text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Log Critical Issue
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AssessmentCard name="Ikeja High" officer="Officer Musa" score="94%" />
                    <AssessmentCard name="Maryland Primary" officer="Officer Ade" score="88%" />
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-gray-300">
                        <Info className="w-8 h-8 text-gray-300 mb-2" />
                        <span className="text-sm text-gray-400 font-bold group-hover:text-gray-500">More data pending sync...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, color, secondary }: any) {
    const colorStyles: any = {
        blue: 'bg-blue-600 shadow-blue-200 text-white',
        green: 'bg-green-600 shadow-green-200 text-white',
        purple: 'bg-purple-600 shadow-purple-200 text-white',
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center gap-5"
        >
            <div className={`p-4 rounded-2xl ${colorStyles[color]} shadow-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{label}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-black text-gray-900 leading-none">{value}</p>
                    {secondary && <span className="text-[10px] font-bold text-gray-400 mb-0.5">{secondary}</span>}
                </div>
            </div>
        </motion.div>
    );
}

function AssessmentCard({ name, officer, score }: any) {
    return (
        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-900">{name}</span>
                <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">Score: {score}</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-bold">
                    OM
                </div>
                <div className="flex-1">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none">Filed By</p>
                    <p className="text-xs font-bold text-gray-700 mt-1">{officer}</p>
                </div>
            </div>
        </div>
    );
}

