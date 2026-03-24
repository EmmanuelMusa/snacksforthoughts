import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDonation } from '../../context/DonationContext';
import { useAuth } from '../../context/AuthContext';
import { 
    Users, Building2, Package, Activity, 
    Search, Filter, Download, ArrowUpRight, 
    TrendingUp, Map as MapIcon, Calendar, AlertCircle
} from 'lucide-react';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { NIGERIAN_STATES } from '../../constants';

// Mock data for charts
const feedingTrendData = [
    { name: 'Mon', pupils: 1200000 },
    { name: 'Tue', pupils: 1350000 },
    { name: 'Wed', pupils: 1420000 },
    { name: 'Thu', pupils: 1380000 },
    { name: 'Fri', pupils: 1420000 },
    { name: 'Sat', pupils: 800000 },
    { name: 'Sun', pupils: 600000 },
];

const stateDistributionData = [
    { name: 'Lagos', schools: 1200, pupils: 240000 },
    { name: 'Kano', schools: 1500, pupils: 300000 },
    { name: 'Kaduna', schools: 900, pupils: 180000 },
    { name: 'Oyo', schools: 850, pupils: 170000 },
    { name: 'Rivers', schools: 700, pupils: 140000 },
    { name: 'Abuja', schools: 600, pupils: 120000 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function NationalCommandCenter() {
    const { apiBaseUrl } = useDonation();
    const { token } = useAuth();
    const [stats, setStats] = useState({ 
        pupilsFedToday: 1420000, 
        schoolsParticipating: 8500, 
        totalSchoolsCount: 8500,
        vendorsActive: 12000, 
        farmersLinked: 25000 
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('All States');
    const [isLoading, setIsLoading] = useState(true);
    const currentDate = new Date().toLocaleDateString('en-NG', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`${apiBaseUrl}/api/dashboard/national`, {
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
            if (data) setStats(data);
            setIsLoading(false);
        })
        .catch(err => {
            console.error("National Dashboard Fetch Error:", err);
            setError(err.message);
            setIsLoading(false);
        });
    }, [apiBaseUrl, token]);

    const filteredDistribution = useMemo(() => {
        return stateDistributionData.filter(item => 
            (selectedState === 'All States' || item.name === selectedState) &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, selectedState]);

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-display">National Command Center</h1>
                    <p className="text-gray-500 mt-1">Real-time overview of the National Digital School Feeding Programme</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                        {currentDate}
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-display print:hidden"
                        >
                            <Download className="w-4 h-4" />
                            Export PDF Report
                        </button>
                        <div className="h-10 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                            <span className="text-xs font-bold uppercase tracking-wider">Live System Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">System Error: {error}</p>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    title="Pupils Fed Today" 
                    value={stats.pupilsFedToday.toLocaleString()} 
                    icon={<Users className="w-6 h-6" />} 
                    trend="+12% from last week"
                    color="green" 
                    delay={0}
                />
                <MetricCard 
                    title="Active Schools Today" 
                    value={stats.schoolsParticipating.toLocaleString()} 
                    icon={<Building2 className="w-6 h-6" />} 
                    trend={`of ${stats.totalSchoolsCount.toLocaleString()} total schools`}
                    color="blue" 
                    delay={0.1}
                />
                <MetricCard 
                    title="Active Vendors" 
                    value={stats.vendorsActive.toLocaleString()} 
                    icon={<Package className="w-6 h-6" />} 
                    trend="98% delivery rate"
                    color="orange" 
                    delay={0.2}
                />
                <MetricCard 
                    title="Farmers Linked" 
                    value={stats.farmersLinked.toLocaleString()} 
                    icon={<Activity className="w-6 h-6" />} 
                    trend="Direct supply chain"
                    color="purple" 
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main feeding trend chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 font-display">Feeding Volume Trend</h3>
                            <p className="text-sm text-gray-500">Daily number of pupils fed nationwide</p>
                        </div>
                        <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Current Term</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={feedingTrendData}>
                                <defs>
                                    <linearGradient id="colorPupils" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#22c55e', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="pupils" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorPupils)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* State Distribution Pie */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 font-display mb-6">School Distribution</h3>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stateDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="schools"
                                >
                                    {stateDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-800">{stats.schoolsParticipating}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Schools</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {stateDistributionData.slice(0, 4).map((item, i) => (
                            <div key={item.name} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className="text-sm font-medium text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-800">{item.schools}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interactive Data Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 font-display">State Connectivity Matrix</h3>
                        <p className="text-sm text-gray-500">Monitoring performance and engagement across geopolitical zones</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search state..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select 
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="bg-transparent text-sm outline-none cursor-pointer"
                            >
                                <option>All States</option>
                                {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">State</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Active Schools</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pupils Enrolled</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Performance</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {NIGERIAN_STATES.filter(s => 
                                (selectedState === 'All States' || s === selectedState) &&
                                s.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((state, idx) => {
                                const mockData = stateDistributionData.find(d => d.name === state) || { schools: 450, pupils: 90000 };
                                return (
                                    <tr key={state} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                                                    {state.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gray-900">{state}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{mockData.schools}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{mockData.pupils.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[100px]">
                                                    <div 
                                                        className="h-full bg-green-500 rounded-full" 
                                                        style={{ width: `${85 + (idx % 15)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">{85 + (idx % 15)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Nigeria Map Placeholder Section - Revamped */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:hidden">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <MapIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">Live Geospatial Monitoring</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Track feeding activity across every LGA in Nigeria with GPS-verified reporting data.</p>
                    <div 
                        onClick={() => window.open('https://earth.google.com/', '_blank')}
                        className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center group cursor-pointer hover:border-green-400 transition-colors overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-map-pattern opacity-10"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center mb-3"
                            >
                                <ArrowUpRight className="w-6 h-6 text-green-600" />
                            </motion.div>
                            <span className="text-sm font-bold text-gray-600 group-hover:text-green-600">Open Interactive Engine</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">Governance & Audit Log</h3>
                    <div className="space-y-6">
                        <AuditItem title="Fund Disbursement" time="2 hours ago" status="Success" desc="NGN 2.5B released for Q1 Vendor settlements." />
                        <AuditItem title="New Vendor Onboarded" time="5 hours ago" status="Alert" desc="Quality inspection passed for Kano Aggregator." />
                        <AuditItem title="Daily Feeding Sync" time="12 hours ago" status="Success" desc="8.2M total reports reconciled across 36 states." />
                        <AuditItem title="System Performance" time="1 day ago" status="Success" desc="All servers operational with 99.9% uptime." />
                        <button className="w-full py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                            View Compliance Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Print-Only Report Header */}
            <div className="hidden print:block fixed inset-0 bg-white z-[200] p-6 font-sans overflow-hidden">
                <div className="flex items-center justify-between border-b-2 border-green-700 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                        <img src="/images/Nigeria Logo.jpeg" className="h-16 w-auto" alt="Coat of Arms" />
                        <div>
                            <h1 className="text-xl font-black text-gray-900 uppercase">National Digital School Feeding</h1>
                            <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest leading-none">Programme Performance Report</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Generated On</p>
                        <p className="text-sm font-black text-gray-900">{currentDate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <PrintStatCard label="Total Pupils Fed" value={stats.pupilsFedToday.toLocaleString()} />
                    <PrintStatCard label="Active Schools" value={stats.schoolsParticipating.toLocaleString()} />
                    <PrintStatCard label="Verified Vendors" value={stats.vendorsActive.toLocaleString()} />
                    <PrintStatCard label="Farmers Linked" value={stats.farmersLinked.toLocaleString()} />
                </div>

                <div className="border border-gray-100 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight">Geopolitical Zone Distribution</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-2 text-[10px] font-bold text-gray-500 uppercase">State</th>
                                <th className="py-2 text-[10px] font-bold text-gray-500 uppercase">Schools</th>
                                <th className="py-2 text-[10px] font-bold text-gray-500 uppercase">Pupils</th>
                                <th className="py-2 text-[10px] font-bold text-gray-500 uppercase text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stateDistributionData.slice(0, 8).map(state => (
                                <tr key={state.name}>
                                    <td className="py-2 text-xs font-bold text-gray-900">{state.name}</td>
                                    <td className="py-2 text-xs text-gray-600">{state.schools}</td>
                                    <td className="py-2 text-xs text-gray-600">{state.pupils.toLocaleString()}</td>
                                    <td className="py-4 text-right text-xs font-black text-green-600">92%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
                    <div>
                        <div className="w-24 h-[1px] bg-gray-400 mb-1"></div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Authorized Signature</p>
                        <p className="text-xs font-black text-gray-900">National Programme Director</p>
                    </div>
                    <div className="text-right flex items-center gap-4 scale-75 origin-right">
                        <img src="/images/rh_nhgsfp logo.png" className="h-8 w-auto" alt="NHGSFP" />
                        <img src="/images/NSIPA Logo.jpeg" className="h-8 w-auto" alt="NSIPA" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend, color, delay }: any) {
    const colorClasses: any = {
        green: 'bg-green-500 text-white shadow-green-200',
        blue: 'bg-blue-500 text-white shadow-blue-200',
        orange: 'bg-orange-500 text-white shadow-orange-200',
        purple: 'bg-purple-500 text-white shadow-purple-200'
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 group hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        Live
                    </div>
                </div>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-black text-gray-900">{value}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">{trend}</p>
            </div>
        </motion.div>
    );
}

function PrintStatCard({ label, value }: any) {
    return (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-gray-900">{value}</p>
        </div>
    );
}

function AuditItem({ title, time, status, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="relative">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${status === 'Success' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <div className="absolute top-6 bottom-0 left-[5.5px] w-[1px] bg-gray-100"></div>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{title}</span>
                    <span className="text-[10px] text-gray-400 font-display flex items-center gap-1 uppercase tracking-widest leading-none">
                        <Calendar className="w-3 h-3" /> {time}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
        </div>
    );
}
