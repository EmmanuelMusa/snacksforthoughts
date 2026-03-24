import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    DollarSign, ArrowUpRight, TrendingDown, 
    PieChart as PieChartIcon, ArrowRightLeft, 
    Wallet, CreditCard, ShieldCheck, Download
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const financials = [
    { name: 'Food Procurement', value: 32000000000, color: '#16a34a' },
    { name: 'Vendor Payments', value: 9000000000, color: '#3b82f6' },
    { name: 'Logistics', value: 5000000000, color: '#f59e0b' },
    { name: 'Monitoring', value: 4000000000, color: '#8b5cf6' },
];

const COLORS = financials.map(f => f.color);
const total = financials.reduce((acc, f) => acc + f.value, 0);

export default function FinancialTracker() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Tracking Panel</h1>
                    <p className="text-gray-500 font-medium">Internal audit and real-time fund utilization engine</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-2xl text-sm font-bold shadow-xl shadow-black/10 hover:bg-gray-800 transition-all">
                        <Download className="w-4 h-4" />
                        Download Ledger
                    </button>
                </div>
            </div>

            {/* High Level Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {financials.map((item, i) => (
                    <motion.div 
                        key={item.name} 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-2xl bg-gray-50 text-gray-400 group-hover:text-black transition-colors">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">Verified</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.name}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900 tracking-tighter">₦</span>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter">{(item.value / 1e9).toFixed(1)}B</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Expenditure Composition */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Expenditure Composition</h3>
                            <p className="text-sm text-gray-500">Distribution of the Q1 NGN 50B budget allocation</p>
                        </div>
                        <PieChartIcon className="w-6 h-6 text-gray-300" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2 h-[300px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={financials}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {financials.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total</span>
                                <span className="text-2xl font-black text-gray-900">₦50.0B</span>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 space-y-5">
                            {financials.map((f, i) => (
                                <div key={f.name}>
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }}></div>
                                            <span className="font-bold text-gray-700">{f.name}</span>
                                        </div>
                                        <span className="font-black text-gray-900">{((f.value / total) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(f.value / total) * 100}%` }}
                                            className="h-full rounded-full" 
                                            style={{ backgroundColor: f.color }}
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Status / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-black text-gray-900 mb-6 font-display">Treasury Status</h3>
                        <div className="space-y-6">
                            <TreasuryItem icon={<Wallet className="text-green-600" />} label="Operating Capital" value="₦12.4B" />
                            <TreasuryItem icon={<CreditCard className="text-blue-600" />} label="Pending Invoices" value="₦2.1B" />
                            <TreasuryItem icon={<ShieldCheck className="text-purple-600" />} label="Escrowed Funds" value="₦4.5B" />
                        </div>
                        <button className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-black transition-colors">
                            Initiate Disbursement
                            <ArrowRightLeft className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white">
                        <TrendingDown className="w-10 h-10 mb-4 opacity-50" />
                        <h4 className="text-xl font-black mb-2 leading-tight">Projected Savings</h4>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
                            Direct farming integration has reduced procurement costs by 14% this quarter.
                        </p>
                        <div className="text-3xl font-black tracking-tighter">
                            +₦1.4B <span className="text-sm font-bold opacity-60">Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TreasuryItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-sm font-bold text-gray-500">{label}</span>
            </div>
            <span className="text-lg font-black text-gray-900 tracking-tighter">{value}</span>
        </div>
    );
}

