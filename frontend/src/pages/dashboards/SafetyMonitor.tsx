import { motion } from 'framer-motion';
import { 
    ShieldAlert, FileText, Frown, 
    CheckCircle, AlertTriangle, Info,
    ChevronRight, Search, Filter, ShieldCheck
} from 'lucide-react';

export default function SafetyMonitor() {
    const alerts = [
        { id: 1, type: 'hygiene', text: 'Vendor hygiene certification expired', vendor: 'Mama T Foods', date: '2026-03-22', status: 'Pending', severity: 'medium' },
        { id: 2, type: 'inspection', text: 'Routine inspection failed due to missing supplies', vendor: 'Chivita', date: '2026-03-20', status: 'Resolved', severity: 'low' },
        { id: 3, type: 'complaint', text: 'Health complaint regarding spoiled food delivery', vendor: 'Benue Central Primary', date: '2026-03-23', status: 'Urgent', severity: 'high' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Safety & Quality Hub</h1>
                    <p className="text-gray-500 font-medium">Compliance monitoring, health alerts, and inspection audits</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-red-200 hover:bg-red-700 transition-all">
                        <AlertTriangle className="w-4 h-4" />
                        Report Incident
                    </button>
                </div>
            </div>

            {/* Health Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <HealthCard icon={<ShieldAlert />} label="Critical Issues" value="1" color="red" />
                <HealthCard icon={<Frown />} label="Open Complaints" value="3" color="amber" />
                <HealthCard icon={<ShieldCheck />} label="Inspections Passed" value="142" color="green" />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-gray-900">Incident & Audit Log</h3>
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search incidents..." 
                            className="w-full pl-12 pr-6 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none"
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {alerts.map((alert, idx) => (
                        <motion.div 
                            key={alert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-6"
                        >
                            <div className="flex items-start gap-5">
                                <div className={`p-3 rounded-2xl ${
                                    alert.severity === 'high' ? 'bg-red-50 text-red-600' :
                                    alert.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                    {alert.type === 'hygiene' ? <FileText className="w-6 h-6" /> : 
                                     alert.type === 'complaint' ? <ShieldAlert className="w-6 h-6" /> : 
                                     <CheckCircle className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-gray-900 mb-1">{alert.text}</h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> {alert.vendor}</span>
                                        <span>•</span>
                                        <span>{alert.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-6">
                                <span className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                                    alert.status === 'Urgent' ? 'bg-red-600 text-white shadow-lg shadow-red-200' :
                                    alert.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                    {alert.status}
                                </span>
                                <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <div className="p-8 text-center bg-gray-50/50">
                    <button className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] hover:text-black transition-colors">
                        Load Historical Archives
                    </button>
                </div>
            </div>
        </div>
    );
}

function HealthCard({ icon, label, value, color }: any) {
    const style: any = {
        red: 'bg-white border-red-100 text-red-600',
        amber: 'bg-white border-amber-100 text-amber-600',
        green: 'bg-white border-green-100 text-green-600',
    };
    
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`p-6 rounded-3xl border shadow-sm flex items-center gap-5 ${style[color]}`}
        >
            <div className={`p-4 rounded-2xl ${
                color === 'red' ? 'bg-red-50' : 
                color === 'amber' ? 'bg-amber-50' : 
                'bg-green-50'
            }`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
            </div>
        </motion.div>
    );
}

