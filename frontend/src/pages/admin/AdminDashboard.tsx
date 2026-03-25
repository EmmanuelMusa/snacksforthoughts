import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    Users, 
    Building2, 
    Package, 
    TrendingUp, 
    CheckCircle, 
    Clock, 
    Truck, 
    BarChart3, 
    ShieldCheck, 
    Filter,
    Search,
    Edit2,
    Trash2,
    Star,
    Plus,
    X,
    ChevronDown,
    MapPin,
    Phone,
    Mail
} from 'lucide-react'
import { useDonation } from '../../context/DonationContext'

interface AdminStats {
    totalRequests: number
    pendingPayments: number
    paidRequests: number
    deliveredRequests: number
    verifiedRequests: number
    totalSchools: number
}

interface SupplyRequest {
    id: string
    academicPeriod: string
    status: string
    items: any[]
    school: { name: string; state: string }
    supplier: { companyName: string }
    donor: { name: string }
    createdAt: string
}

interface AdminSchool extends School {
    aggregator?: string
    phone?: string
    studentCount: number
}

interface AdminUser {
    id: string
    name: string
    email: string
    role: string
    state?: string
    isActive: boolean
    companyName?: string
    createdAt: string
}

interface School {
    id: string
    name: string
    state: string
    lga: string
}

export default function AdminDashboard() {
    const { apiBaseUrl } = useDonation()
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [supplies, setSupplies] = useState<SupplyRequest[]>([])
    const [schools, setSchools] = useState<AdminSchool[]>([])
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REQUESTS' | 'SCHOOLS' | 'USERS'>('OVERVIEW')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    
    // Management Modals/State
    const [editingEntity, setEditingEntity] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const [statsRes, suppliesRes, schoolsRes, usersRes] = await Promise.all([
                fetch(`${apiBaseUrl}/api/admin/overview`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/api/admin/supplies`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/api/schools/search?limit=1000`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/api/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } })
            ])
            
            const statsData = await statsRes.json()
            const suppliesData = await suppliesRes.json()
            const schoolsData = await schoolsRes.json()
            const usersData = await usersRes.json()
            
            setStats(statsData?.error ? null : statsData)
            setSupplies(Array.isArray(suppliesData) ? suppliesData : [])
            setSchools(schoolsData?.data?.schools || [])
            setUsers(Array.isArray(usersData) ? usersData : [])
        } catch (err) {
            console.error('Error fetching admin data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [apiBaseUrl])

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token')
            await fetch(`${apiBaseUrl}/api/admin/request/${id}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            })
            fetchData()
        } catch (err) {
            console.error('Update status error:', err)
        }
    }

    const handleDeleteSchool = async (id: string) => {
        if (!confirm('Are you sure you want to delete this school?')) return
        try {
            const token = localStorage.getItem('token')
            await fetch(`${apiBaseUrl}/api/schools/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            fetchData()
        } catch (err) {
            console.error('Delete school error:', err)
        }
    }

    const handleToggleUser = async (user: AdminUser) => {
        try {
            const token = localStorage.getItem('token')
            await fetch(`${apiBaseUrl}/api/admin/user/${user.id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ isActive: !user.isActive })
            })
            fetchData()
        } catch (err) {
            console.error('Toggle user error:', err)
        }
    }

    const filteredSupplies = supplies.filter(s => {
        const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus
        const matchesSearch = searchQuery === '' || 
            s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.school?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.donor?.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const filteredSchools = schools.filter(s => 
        searchQuery === '' || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lga.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredUsers = users.filter(u => 
        searchQuery === '' || 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const statCards = [
        { label: 'Total Volume', value: stats?.totalRequests || 0, icon: Package, color: 'bg-blue-600' },
        { label: 'Awaiting Payment', value: stats?.pendingPayments || 0, icon: Clock, color: 'bg-orange-500' },
        { label: 'Processing', value: stats?.paidRequests || 0, icon: Truck, color: 'bg-emerald-500' },
        { label: 'Verified Delivery', value: stats?.verifiedRequests || 0, icon: ShieldCheck, color: 'bg-indigo-600' }
    ]

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 font-display">Command Center</h1>
                    <p className="text-gray-500 font-medium">National Digital School Feeding Registry — Live Feed</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-50 text-green-700 text-xs font-black rounded-full border border-green-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        SYSTEM OPERATIONAL
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center gap-5"
                    >
                        <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{card.label}</div>
                            <div className="text-2xl font-black text-gray-900">{card.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
                {(['OVERVIEW', 'REQUESTS', 'SCHOOLS', 'USERS'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setFilterStatus('ALL'); setSearchQuery(''); }}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                            activeTab === tab ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'OVERVIEW' && (
                <>
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((card, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-xl shadow-gray-200/30 flex items-center gap-6 group hover:border-blue-200 transition-all duration-500"
                            >
                                <div className={`${card.color} p-5 rounded-2xl text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform`}>
                                    <card.icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{card.label}</div>
                                    <div className="text-3xl font-black text-gray-900 font-display">{card.value}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Charts Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/50 shadow-2xl shadow-gray-200/20 h-96 flex flex-col items-center justify-center text-center space-y-4">
                            <TrendingUp className="w-12 h-12 text-blue-100" />
                            <div className="text-xl font-black text-gray-300">Growth Projections</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/50 shadow-2xl shadow-gray-200/20 h-96 flex flex-col items-center justify-center text-center space-y-4">
                            <BarChart3 className="w-12 h-12 text-emerald-100" />
                            <div className="text-xl font-black text-gray-300">Regional Distribution</div>
                        </div>
                    </div>
                </>
            )}

            {/* Supply Tracker / Data Tables */}
            {(activeTab === 'REQUESTS' || activeTab === 'SCHOOLS' || activeTab === 'USERS') && (
                <div className="bg-white/60 backdrop-blur-md rounded-[3rem] border border-white/50 shadow-2xl shadow-gray-200/30 overflow-hidden">
                    <div className="p-10 border-b border-gray-100/50 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                                {activeTab === 'REQUESTS' ? <Package className="w-6 h-6 text-white" /> : 
                                 activeTab === 'SCHOOLS' ? <Building2 className="w-6 h-6 text-white" /> : 
                                 <Users className="w-6 h-6 text-white" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 font-display capitalize">{activeTab.toLowerCase()} Registry</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Live Management System</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4">
                            {activeTab === 'REQUESTS' && (
                                <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
                                    {['ALL', 'PENDING', 'PAYMENT_CONFIRMED', 'DELIVERED', 'VERIFIED'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setFilterStatus(s)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                                                filterStatus === s ? 'bg-white text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                        >
                                            {s.split('_')[0]}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400/50 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder={`Search ${activeTab.toLowerCase()}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-14 pr-8 py-4 bg-gray-50/50 border-gray-100/50 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all w-full lg:w-80 shadow-inner"
                                />
                            </div>

                            {activeTab === 'SCHOOLS' && (
                                <button className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-900/10 flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">New School</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {activeTab === 'REQUESTS' && (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/30 border-b border-gray-100/50">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Request ID</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Target / State</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Parties</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredSupplies.map((supply) => (
                                        <tr key={supply.id} className="hover:bg-blue-50/5 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="font-black text-gray-900 text-xs">#{supply.id.slice(-8).toUpperCase()}</div>
                                                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter mt-1">{supply.academicPeriod}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="font-bold text-gray-800 text-base font-display">{supply.school?.name}</div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-black uppercase tracking-widest mt-1">
                                                    <MapPin className="w-3 h-3 text-rose-400" /> {supply.school?.state}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center text-[10px] text-orange-600 font-black">S</div>
                                                    <div className="text-sm font-bold text-gray-600">{supply.supplier?.companyName}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] text-blue-600 font-black">D</div>
                                                    <div className="text-sm font-bold text-gray-600">{supply.donor?.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <select 
                                                    value={supply.status}
                                                    onChange={(e) => handleUpdateStatus(supply.id, e.target.value)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border cursor-pointer outline-none transition-all ${
                                                        supply.status === 'VERIFIED' ? 'bg-indigo-50/50 text-indigo-700 border-indigo-200' :
                                                        supply.status === 'DELIVERED' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200' :
                                                        supply.status === 'PAYMENT_CONFIRMED' ? 'bg-blue-50/50 text-blue-700 border-blue-200' :
                                                        'bg-orange-50/50 text-orange-700 border-orange-200'
                                                    }`}
                                                >
                                                    {['PENDING', 'PAYMENT_CONFIRMED', 'DELIVERED', 'VERIFIED'].map(st => (
                                                        <option key={st} value={st}>{st.replace('_', ' ')}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                    <ChevronDown className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'SCHOOLS' && (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/30 border-b border-gray-100/50">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">School Name</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Location</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Stats</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Aggregator</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Manage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredSchools.map((school) => (
                                        <tr key={school.id} className="hover:bg-blue-50/5 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="font-bold text-gray-900 text-base font-display">{school.name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold tracking-widest mt-1">ID: {school.id}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="font-bold text-gray-800 text-sm">{school.lga}</div>
                                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{school.state}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Students: <span className="text-gray-900">{school.studentCount}</span></div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 italic text-sm text-gray-500">
                                                {school.aggregator || 'Direct Verification'}
                                            </td>
                                            <td className="px-10 py-8 text-right space-x-2">
                                                <button 
                                                    onClick={() => { setEditingEntity(school); setIsEditModalOpen(true); }}
                                                    className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteSchool(school.id)}
                                                    className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'USERS' && (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/30 border-b border-gray-100/50">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">User / Company</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contact</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Role / State</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/5 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="font-bold text-gray-900 text-base font-display">{user.name}</div>
                                                <div className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">{user.companyName || 'Individual Account'}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="text-sm font-medium text-gray-600">{user.email}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-500 w-fit mb-2">{user.role}</div>
                                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{user.state || 'N/A'}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <button 
                                                    onClick={() => handleToggleUser(user)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                                                        user.isActive 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}
                                                >
                                                    {user.isActive ? 'Active' : 'Deactivated'}
                                                </button>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {(activeTab === 'REQUESTS' && filteredSupplies.length === 0) ||
                         (activeTab === 'SCHOOLS' && filteredSchools.length === 0) ||
                         (activeTab === 'USERS' && filteredUsers.length === 0) ? (
                            <div className="p-32 text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-300 font-display">No matching records found</h3>
                                <p className="text-gray-400 font-medium">Try adjusting your filters or search keywords.</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Edit Modal (Generic) */}
            {isEditModalOpen && editingEntity && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsEditModalOpen(false)}
                        className="absolute inset-0 bg-gray-950/40 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-3xl overflow-hidden border border-gray-100"
                    >
                        <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 font-display">Edit Resource</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Modifying: {editingEntity.name || editingEntity.companyName || editingEntity.id}</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        
                        <div className="p-10 space-y-8">
                            {/* Generic form fields based on type */}
                            {editingEntity.studentCount !== undefined ? (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">School Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={editingEntity.name}
                                            className="w-full p-5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-blue-500 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Student Count</label>
                                            <input 
                                                type="number" 
                                                defaultValue={editingEntity.studentCount}
                                                className="w-full p-5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-blue-500 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aggregator</label>
                                            <input 
                                                type="text" 
                                                defaultValue={editingEntity.aggregator}
                                                className="w-full p-5 bg-gray-50 rounded-2xl border-transparent focus:bg-white focus:border-blue-500 transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 text-center text-gray-400 font-bold">
                                    Detailed editing for this type is coming soon.
                                </div>
                            )}
                        </div>

                        <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-600">Cancel</button>
                            <button className="px-10 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Save Changes</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
