import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import {
    LayoutDashboard,
    Package,
    Building2,
    Users,
    Search,
    Filter,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    TrendingUp,
    BarChart3,
    ShieldCheck,
    Edit2,
    Trash2,
    Star,
    Plus,
    X,
    ChevronDown,
    MapPin,
    Phone,
    Mail,
    LogOut,
    Truck,
    Settings
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDonation } from '../../context/DonationContext'

interface AdminStats {
    totalRequests: number
    totalStates: number
    totalLGAs: number
    totalSchools: number
    totalPupils: number
    sponsoredDays: number
    unsponsoredDays: number
    suppliesDelivered: number
    pendingDeliveries: number
    completedFeedingDays: number
    revenue: number
    statusBreakdown?: { status: string; _count: { _all: number } }[]
}

interface SupplyRequest {
    id: string
    academicPeriod: string
    status: string
    items: any[]
    school: { name: string; state: string; lga: string }
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
    const navigate = useNavigate()
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [supplies, setSupplies] = useState<SupplyRequest[]>([])
    const [schools, setSchools] = useState<AdminSchool[]>([])
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REQUESTS' | 'SCHOOLS' | 'USERS' | 'SETTINGS'>('OVERVIEW')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')

    // Management Modals/State
    const [editingEntity, setEditingEntity] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false)

    // Pagination State
    const [schoolsPage, setSchoolsPage] = useState(1)
    const [usersPage, setUsersPage] = useState(1)
    const [requestsPage, setRequestsPage] = useState(1)
    const itemsPerPage = 10

    // Filter State
    const [roleFilter, setRoleFilter] = useState('ALL')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const COLORS = ['#e11d48', '#2563eb', '#059669', '#d97706', '#7c3aed']

    const fetchData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const [statsRes, suppliesRes, schoolsRes, usersRes] = await Promise.all([
                fetch(`${apiBaseUrl}/api/dashboard/admin/overview`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/api/dashboard/admin/supplies`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/api/schools/search?limit=1000`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${apiBaseUrl}/api/dashboard/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } })
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

    const [geoView, setGeoView] = useState<{ type: 'country' | 'state' | 'lga', data: any[] }>({ type: 'country', data: [] })
    const [selectedState, setSelectedState] = useState<string | null>(null)
    const [selectedLga, setSelectedLga] = useState<string | null>(null)

    const fetchGeoStats = async (state?: string, lga?: string) => {
        try {
            const token = localStorage.getItem('token')
            let url = `${apiBaseUrl}/api/dashboard/admin/geo-stats`
            if (state) url += `?state=${state}`
            if (state && lga) url += `&lga=${lga}`

            const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
            const json = await res.json()
            const data = json.data || []
            setGeoView({ type: json.type, data })
        } catch (err) {
            console.error('Geo stats error:', err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [apiBaseUrl])

    useEffect(() => {
        if (activeTab === 'OVERVIEW') fetchGeoStats()
    }, [activeTab])

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token')
            await fetch(`${apiBaseUrl}/api/dashboard/admin/request/${id}/status`, {
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
            await fetch(`${apiBaseUrl}/api/dashboard/admin/user/${user.id}`, {
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

    const handleAddSchool = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const schoolData = Object.fromEntries(formData.entries())

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${apiBaseUrl}/api/schools`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: schoolData.name,
                    state: schoolData.state,
                    lga: schoolData.lga,
                    studentCount: parseInt(schoolData.studentCount as string)
                })
            })
            if (res.ok) {
                setIsAddSchoolModalOpen(false)
                fetchData()
            }
        } catch (err) {
            console.error('Add school error:', err)
        }
    }

    const handleStateClick = (stateName: string) => {
        setSelectedState(stateName)
        setSelectedLga(null)
        fetchGeoStats(stateName)
    }

    const handleLgaClick = (lgaName: string) => {
        setSelectedLga(lgaName)
        fetchGeoStats(selectedState!, lgaName)
    }

    const resetGeo = () => {
        setSelectedState(null)
        setSelectedLga(null)
        fetchGeoStats()
    }

    const getTrailProgress = (status: string) => {
        const statuses = [
            'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'ADMIN_APPROVED',
            'SUPPLIER_ALLOCATED', 'DISPATCHED', 'DELIVERED',
            'RECEIVED', 'VERIFIED'
        ]
        const idx = statuses.indexOf(status)
        if (idx === -1) return 0
        return Math.round(((idx + 1) / statuses.length) * 100)
    }

    // Filter Logic
    const filteredSupplies = supplies.filter(s => {
        const matchesStatus = filterStatus === 'ALL' ||
            (filterStatus === 'PENDING' ? ['PENDING_PAYMENT', 'PAYMENT_CLAIMED', 'PAYMENT_CONFIRMED'].includes(s.status) : s.status === filterStatus)
        const matchesSearch = searchQuery === '' ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.school?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.donor?.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })
    const paginatedSupplies = filteredSupplies.slice((requestsPage - 1) * itemsPerPage, requestsPage * itemsPerPage)

    const filteredSchools = schools.filter(s =>
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lga.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const paginatedSchools = filteredSchools.slice((schoolsPage - 1) * itemsPerPage, schoolsPage * itemsPerPage)

    const filteredUsersList = users.filter(u => {
        const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
        const matchesSearch = searchQuery === '' ||
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesRole && matchesSearch
    })
    const paginatedUsers = filteredUsersList.slice((usersPage - 1) * itemsPerPage, usersPage * itemsPerPage)

    const allStats = [
        { label: 'Total Volume', value: stats?.totalRequests || 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Onboarded States', value: stats?.totalStates || 0, icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Total LGAs', value: stats?.totalLGAs || 0, icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Schools Registered', value: stats?.totalSchools || 0, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Pupils Impacted', value: stats?.totalPupils || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Days Sponsored', value: stats?.sponsoredDays || 0, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Unsponsored Days', value: stats?.unsponsoredDays || 0, icon: X, color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'Supplies Delivered', value: stats?.suppliesDelivered || 0, icon: Truck, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Pending Deliveries', value: stats?.pendingDeliveries || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Verified Feeding', value: stats?.completedFeedingDays || 0, icon: ShieldCheck, color: 'text-blue-700', bg: 'bg-blue-100' },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-gray-100 flex flex-col fixed h-full z-50">
                <div className="p-8 border-b border-gray-50 flex items-center gap-4">
                    <img src="/images/Snacks for Thoughts Logo.png" alt="Logo" className="w-24 h-24 object-contain" />
                    <div>
                        <h2 className="text-sm font-black text-[#006D3E] leading-none uppercase tracking-tighter">PBAT FEEDS</h2>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-nowrap">Admin Dashboard</h3>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 mt-4">
                    {(['OVERVIEW', 'REQUESTS', 'SCHOOLS', 'USERS', 'SETTINGS'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setFilterStatus('ALL'); setSearchQuery(''); }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                            }`}
                        >
                            {tab === 'OVERVIEW' && <LayoutDashboard className="w-5 h-5" />}
                            {tab === 'REQUESTS' && <Package className="w-5 h-5" />}
                            {tab === 'SCHOOLS' && <Building2 className="w-5 h-5" />}
                            {tab === 'USERS' && <Users className="w-5 h-5" />}
                            {tab === 'SETTINGS' && <Settings className="w-5 h-5" />}
                            {tab}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-rose-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition-all font-display"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-80 p-10 min-w-0">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 font-display tracking-tight flex items-center gap-4">
                            {activeTab} <span className="text-gray-300">/</span> <span className="text-blue-600">COMMAND CENTER</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Live Platform Monitoring & Governance</p>
                    </div>
                </div>

                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {allStats.map((card, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
                                    <div className={`${card.bg} ${card.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><card.icon className="w-5 h-5" /></div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{card.label}</div>
                                    <div className="text-2xl font-black text-gray-900 font-display">{card.value.toLocaleString()}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative">
                                <div className="flex items-center justify-between mb-8">
                                    <div><h3 className="text-xl font-black text-gray-900 font-display">Geographic Performance</h3><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Drill down by State / LGA / School</p></div>
                                    <button onClick={resetGeo} className="px-5 py-2.5 bg-gray-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 border border-gray-100">Reset View</button>
                                </div>
                                <div className="grid grid-cols-3 gap-8 h-80">
                                    <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                                        <label className="sticky top-0 bg-white text-[9px] font-black text-blue-600 uppercase tracking-widest mb-4 block">States</label>
                                        {geoView.type === 'country' ? geoView.data.map((s: any) => (
                                            <button key={s.state} onClick={() => handleStateClick(s.state)} className={`w-full text-left px-5 py-3 rounded-xl hover:bg-blue-50 text-[11px] font-bold transition-all flex items-center justify-between group ${selectedState === s.state ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600'}`}>{s.state} <ArrowUpRight className={`w-3 h-3 ${selectedState === s.state ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} /></button>
                                        )) : <button onClick={resetGeo} className="w-full text-left px-5 py-3 rounded-xl bg-blue-50 text-blue-600 text-[11px] font-bold flex items-center justify-between">{selectedState} <ArrowUpRight className="w-3 h-3" /></button>}
                                    </div>
                                    <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar border-l border-gray-50 pl-8">
                                        <label className="sticky top-0 bg-white text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 block">LGAs</label>
                                        {selectedState ? (geoView.type === 'state' ? geoView.data.map((l: any) => (
                                            <button key={l.lga} onClick={() => handleLgaClick(l.lga)} className={`w-full text-left px-5 py-3 rounded-xl hover:bg-blue-50 text-[11px] font-bold transition-all flex items-center justify-between group ${selectedLga === l.lga ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600'}`}>{l.lga} <ArrowUpRight className={`w-3 h-3 ${selectedLga === l.lga ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} /></button>
                                        )) : <button className="w-full text-left px-5 py-3 rounded-xl bg-blue-50 text-blue-600 text-[11px] font-bold flex items-center justify-between">{selectedLga} <ArrowUpRight className="w-3 h-3" /></button>) : <div className="text-[10px] font-bold text-gray-300 italic pt-10 text-center uppercase tracking-widest">Select State</div>}
                                    </div>
                                    <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar border-l border-gray-50 pl-8">
                                        <label className="sticky top-0 bg-white text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Schools</label>
                                        {selectedLga ? geoView.data.map((s: any) => (
                                            <div key={s.id} className="w-full text-left px-5 py-3 rounded-xl border border-gray-50 text-[11px] font-bold text-gray-600 shadow-sm">
                                                <div className="truncate">{s.name}</div>
                                                <div className="text-[9px] text-emerald-500 font-black uppercase mt-1">{s.studentCount} Pupils</div>
                                            </div>
                                        )) : <div className="text-[10px] font-bold text-gray-300 italic pt-10 text-center uppercase tracking-widest">Select LGA</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
                                <h3 className="text-xl font-black text-gray-900 font-display mb-1">Request Status</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 mb-10">Supply lifecycle distribution</p>
                                <div className="flex-1 min-h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={stats?.statusBreakdown?.map((s: any) => ({ name: s.status.replace(/_/g, ' '), value: s._count._all })) || []} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                                                {(stats?.statusBreakdown || []).map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(activeTab === 'REQUESTS' || activeTab === 'SCHOOLS' || activeTab === 'USERS') && (
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden mt-12">
                        <div className="p-10 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-50/20">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">{activeTab === 'REQUESTS' ? <Package className="w-6 h-6 text-blue-600" /> : activeTab === 'SCHOOLS' ? <Building2 className="w-6 h-6 text-blue-600" /> : <Users className="w-6 h-6 text-blue-600" />}</div>
                                <div><h2 className="text-2xl font-black text-gray-900 font-display uppercase tracking-tight">{activeTab} Registry</h2><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live Management System</p></div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                {activeTab === 'USERS' && (
                                    <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setUsersPage(1); }} className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-sm outline-none focus:border-blue-500">
                                        <option value="ALL">All Roles</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="DONOR">Donor</option>
                                        <option value="SUPPLIER">Supplier</option>
                                        <option value="VERIFIER">Verifier</option>
                                    </select>
                                )}
                                {activeTab === 'REQUESTS' && (
                                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                                        {['ALL', 'PENDING', 'DELIVERED', 'VERIFIED'].map(s => <button key={s} onClick={() => { setFilterStatus(s); setRequestsPage(1); }} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-gray-600'}`}>{s}</button>)}
                                    </div>
                                )}
                                <div className="relative group"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-blue-600 transition-colors" /><input type="text" placeholder={`Search ${activeTab.toLowerCase()}...`} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSchoolsPage(1); setUsersPage(1); setRequestsPage(1); }} className="pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all w-full lg:w-80 shadow-sm" /></div>
                                {activeTab === 'SCHOOLS' && <button onClick={() => setIsAddSchoolModalOpen(true)} className="px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-900/10 flex items-center gap-3"><Plus className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Add School</span></button>}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {activeTab === 'REQUESTS' && (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 border-b border-gray-50"><tr><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Request ID</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Target / State</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Supplied Status</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Track Trail</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-gray-50">{paginatedSupplies.map((supply) => (
                                        <tr key={supply.id} className="hover:bg-blue-50/5 transition-colors group">
                                            <td className="px-10 py-8"><div className="font-black text-gray-900 text-xs tracking-tight">#{supply.id.slice(-8).toUpperCase()}</div></td>
                                            <td className="px-10 py-8"><div className="font-black text-gray-800 text-base font-display">{supply.school?.name}</div><div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-black uppercase tracking-widest mt-2"><MapPin className="w-3 h-3 text-rose-500" /> {supply.school?.state} / {supply.school?.lga}</div></td>
                                            <td className="px-10 py-8"><select value={supply.status} onChange={(e) => handleUpdateStatus(supply.id, e.target.value)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase border cursor-pointer outline-none transition-all shadow-sm ${supply.status === 'VERIFIED' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : supply.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>{['PENDING_PAYMENT', 'PAYMENT_CLAIMED', 'PAYMENT_CONFIRMED', 'ADMIN_APPROVED', 'SUPPLIER_ALLOCATED', 'DISPATCHED', 'DELIVERED', 'RECEIVED', 'VERIFIED'].map(st => <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>)}</select></td>
                                            <td className="px-10 py-8"><div className="flex items-center gap-1.5">{[...Array(8)].map((_, i) => <div key={i} className={`h-1.5 w-4 rounded-full ${i < (getTrailProgress(supply.status) / 12.5) ? 'bg-blue-500 shadow-sm' : 'bg-gray-100'}`} />)}<span className="ml-2 text-[9px] font-black text-blue-600">{getTrailProgress(supply.status)}%</span></div></td>
                                            <td className="px-10 py-8 text-right"><button className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><ArrowUpRight className="w-5 h-5" /></button></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            )}
                            {activeTab === 'SCHOOLS' && (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 border-b border-gray-50"><tr><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">School / Region</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Student Capacity</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-gray-50">{paginatedSchools.map((school) => (
                                        <tr key={school.id} className="hover:bg-blue-50/5 transition-colors group">
                                            <td className="px-10 py-8"><div className="font-black text-gray-900 text-base font-display">{school.name}</div><div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">{school.lga}, {school.state}</div></td>
                                            <td className="px-10 py-8"><div className="flex items-center gap-3"><div className="text-sm font-black text-gray-900">{school.studentCount}</div><div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pupils</div></div></td>
                                            <td className="px-10 py-8 text-right space-x-2"><button onClick={() => { setEditingEntity(school); setIsEditModalOpen(true); }} className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDeleteSchool(school.id)} className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            )}
                            {activeTab === 'USERS' && (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 border-b border-gray-50"><tr><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">User Details</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Role / Status</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Region Access</th><th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-gray-50">{paginatedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/5 transition-colors group">
                                            <td className="px-10 py-8"><div className="font-black text-gray-900 text-base font-display">{user.name}</div><div className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-1.5">{user.email}</div></td>
                                            <td className="px-10 py-8"><div className="flex items-center gap-4"><div className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest">{user.role}</div><button onClick={() => handleToggleUser(user)} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{user.isActive ? 'Active' : 'Locked'}</button></div></td>
                                            <td className="px-10 py-8"><div className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3 text-gray-300" /> {user.state || 'National / Global'}</div></td>
                                            <td className="px-10 py-8 text-right"><button className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            )}

                            <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing {activeTab === 'SCHOOLS' ? `${(schoolsPage - 1) * itemsPerPage + 1}-${Math.min(schoolsPage * itemsPerPage, filteredSchools.length)} of ${filteredSchools.length}` : activeTab === 'USERS' ? `${(usersPage - 1) * itemsPerPage + 1}-${Math.min(usersPage * itemsPerPage, filteredUsersList.length)} of ${filteredUsersList.length}` : `${(requestsPage - 1) * itemsPerPage + 1}-${Math.min(requestsPage * itemsPerPage, filteredSupplies.length)} of ${filteredSupplies.length}`}</div>
                                <div className="flex items-center gap-2">
                                    <button disabled={activeTab === 'SCHOOLS' ? schoolsPage === 1 : activeTab === 'USERS' ? usersPage === 1 : requestsPage === 1} onClick={() => { if (activeTab === 'SCHOOLS') setSchoolsPage(p => p - 1); else if (activeTab === 'USERS') setUsersPage(p => p - 1); else setRequestsPage(p => p - 1); }} className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all font-display">Previous</button>
                                    <button disabled={activeTab === 'SCHOOLS' ? schoolsPage * itemsPerPage >= filteredSchools.length : activeTab === 'USERS' ? usersPage * itemsPerPage >= filteredUsersList.length : requestsPage * itemsPerPage >= filteredSupplies.length} onClick={() => { if (activeTab === 'SCHOOLS') setSchoolsPage(p => p + 1); else if (activeTab === 'USERS') setUsersPage(p => p + 1); else setRequestsPage(p => p + 1); }} className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-all font-display">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'SETTINGS' && (
                    <div className="max-w-4xl mx-auto py-12">
                        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12">
                            <h2 className="text-3xl font-black text-gray-900 font-display mb-8">System Settings</h2>
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email</label><input type="email" defaultValue="admin@pbatfeeds.org" readOnly className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed" /></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Platform Status</label><div className="w-full px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-black uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />Fully Operational</div></div>
                                </div>
                                <button className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10">Save Configuration</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {isAddSchoolModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
                        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                            <div><h2 className="text-2xl font-black text-gray-900 font-display">ONBOARD NEW SCHOOL</h2><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Platform Governance System</p></div>
                            <button onClick={() => setIsAddSchoolModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-gray-100 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleAddSchool} className="p-12 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official School Name</label><input name="name" required placeholder="e.g. St. Peter's Primary Academy" className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none shadow-sm" /></div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label><input name="state" required placeholder="e.g. Lagos" className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none shadow-sm" /></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">LGA</label><input name="lga" required placeholder="e.g. Ikeja" className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none shadow-sm" /></div>
                                </div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Student Capacity</label><input name="studentCount" type="number" required placeholder="e.g. 1200" className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none shadow-sm" /></div>
                            </div>
                            <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all">Finalize Onboarding</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
