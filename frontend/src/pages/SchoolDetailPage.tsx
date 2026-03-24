import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDonation } from '../context/DonationContext'
import BackToTop from '../components/BackToTop'
import StickyDonateButton from '../components/StickyDonateButton'
import {
    LayoutDashboard,
    Target,
    HeartHandshake,
    Image as ImageIcon,
    Phone,
    MapPin,
    Mail,
    GraduationCap,
    Users,
    UserCheck,
    X,
    Heart,
    Utensils,
    Calendar,
    ArrowUpRight,
    Search,
    ShieldCheck,
    Trophy
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type School = {
    id: string;
    name: string;
    description?: string;
    raisedAmount: number;
    targetAmount: number;
    image?: string;
    state?: string;
    lga?: string;
    ward?: string;
    email?: string;
    phone?: string;
    address?: string;
    needs?: string[];
    gallery?: string[];
}
type Donation = {
    id: string;
    donorName: string;
    amount?: number;
    type: 'CASH' | 'IN_KIND';
    kindType?: string;
    kindDesc?: string;
    date: string
}

export default function SchoolDetailPage() {
    const { id } = useParams()
    const { apiBaseUrl } = useDonation()
    const [school, setSchool] = useState<School | null>(null)
    const [donations, setDonations] = useState<Donation[]>([])
    const [tab, setTab] = useState<'overview' | 'needs' | 'donations' | 'gallery' | 'contact'>('overview')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        fetch(`${apiBaseUrl}/api/schools/${id}`)
            .then(r => r.json())
            .then((json) => setSchool((json as any).data ?? json))
            .catch(() => { })

        fetch(`${apiBaseUrl}/api/donations?schoolId=${encodeURIComponent(id)}&limit=12`)
            .then(r => r.json())
            .then((list: Donation[]) => setDonations(list || []))
            .catch(() => { })
    }, [apiBaseUrl, id])

    const progress = school ? school.raisedAmount / school.targetAmount : 0
    const progressPercentage = Math.min(100, Math.round(progress * 100))

    // Mock gallery images for demonstration
    const galleryImages = school?.gallery || [
        '/images/children_in_a_classroom_in_nigeria_smiling.jpeg',
        '/images/service_providers_landscape.jpeg',
        '/images/service_providers_tile.jpeg'
    ]

    const needs = school?.needs || [
        'Classroom Renovation',
        'Desks and Chairs',
        'Books and Learning Materials',
        'School Meals',
        'Clean Water',
        'Toilet Facilities',
        'Playground Equipment',
        'Computer Lab'
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-mint-50 to-sky-50">
            {/* Hero Banner */}
            <div className="relative h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: school?.image
                            ? `url(${school.image})`
                            : "url('/images/children_in_a_classroom_in_nigeria_smiling.jpeg')"
                    }}
                    role="img"
                    aria-label={`${school?.name || 'School'} hero banner showing students in classroom`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="relative z-10 h-full flex items-end">
                    <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    {school?.name || 'School'}
                                </h1>
                                <p className="text-xl text-white/90 mb-6">
                                    {[school?.state, school?.lga, school?.ward].filter(Boolean).join(' • ')}
                                </p>

                                {/* CTA Button */}
                                <Link
                                    to={`/donate?schoolId=${school?.id || ''}`}
                                    className="inline-flex items-center px-8 py-4 bg-mint-500 hover:bg-mint-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Support This School
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="max-w-7xl mx-auto">
                    {/* Premium Dashboard Metrics */}
                    {school && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <MetricCard 
                                icon={<Users className="w-5 h-5" />} 
                                title="Total Pupils" 
                                value="420" 
                                subtitle="Digitalized Records" 
                                color="green"
                            />
                            <MetricCard 
                                icon={<Utensils className="w-5 h-5" />} 
                                title="Feeding Coverage" 
                                value="98.2%" 
                                subtitle="Attendance Rate" 
                                color="blue"
                            />
                            <MetricCard 
                                icon={<Trophy className="w-5 h-5" />} 
                                title="Health Index" 
                                value="A+" 
                                subtitle="Hygiene Grade" 
                                color="orange"
                            />
                            <MetricCard 
                                icon={<GraduationCap className="w-5 h-5" />} 
                                title="Teachers" 
                                value="18" 
                                subtitle="Licensed Educators" 
                                color="purple"
                            />
                        </div>
                    )}

                    {/* Progress Card Upgrade */}
                    {school && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-gray-200/50 p-10 mb-12 border border-white/50 relative overflow-hidden"
                        >
                            {/* Decorative gradient corner */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                                <div className="lg:col-span-3 flex justify-center">
                                    <div className="relative w-48 h-48">
                                        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-100" />
                                            <motion.circle
                                                cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round"
                                                className="text-green-600"
                                                initial={{ strokeDasharray: "0 339" }}
                                                animate={{ strokeDasharray: `${339 * progress} 339` }}
                                                transition={{ duration: 2.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="text-4xl font-black text-gray-900 leading-none">{progressPercentage}%</div>
                                            <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Impact Goal</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                                        <ShieldCheck className="w-3 h-3" />
                                        Verified Development Goal
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-4 leading-tight">Empowering Future <br/>Leaders Together.</h3>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Raised</div>
                                            <div className="text-2xl font-black text-green-600">₦{school.raisedAmount.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Target Need</div>
                                            <div className="text-2xl font-black text-gray-900">₦{school.targetAmount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 space-y-4">
                                    <Link
                                        to={`/donate?schoolId=${school.id}`}
                                        className="flex w-full items-center justify-center gap-3 px-8 py-5 bg-black text-white font-black text-lg rounded-2xl shadow-xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <HeartHandshake className="w-6 h-6" />
                                        Support School
                                    </Link>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                                        Secure transaction powered by NSIPA Digital Foundation
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Tabs */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100">
                        <div className="border-b border-gray-100 bg-gray-50/50">
                            <nav className="flex overflow-x-auto scroolbar-hide">
                                {[
                                    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
                                    { key: 'needs', label: 'Needs', icon: Target },
                                    { key: 'donations', label: 'Donations', icon: HeartHandshake },
                                    { key: 'gallery', label: 'Gallery', icon: ImageIcon },
                                    { key: 'contact', label: 'Contact', icon: Phone }
                                ].map((tabItem) => (
                                    <button
                                        key={tabItem.key}
                                        onClick={() => setTab(tabItem.key as any)}
                                        className={`flex items-center gap-2 px-8 py-5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${tab === tabItem.key
                                            ? 'border-mint-500 text-mint-600 bg-white shadow-[0_-4px_0_0_inset_#3b82f6]' // subtle visual indicator
                                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                                            }`}
                                    >
                                        <tabItem.icon className={`w-5 h-5 ${tab === tabItem.key ? 'text-mint-500' : 'text-gray-400'}`} />
                                        {tabItem.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {tab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-8">
                                                <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                                                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                                        <Search className="w-5 h-5 text-green-600" />
                                                        Overview
                                                    </h3>
                                                    <p className="text-gray-700 leading-relaxed font-medium">
                                                        {school?.description || 'This institution is an integral part of the Federal Government\'s digitalized feeding initiative, ensuring high-standard nutritional support for every student. Through continuous digitalization, we track daily attendance and meal distribution with 100% transparency to maximize the impact of every grain provided.'}
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                                                    <div className="flex items-center justify-between mb-8">
                                                        <div>
                                                            <h3 className="text-xl font-black text-gray-900">Feeding Performance</h3>
                                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Last 14 Reporting Cycles</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black tracking-widest border border-green-100 uppercase animate-pulse">
                                                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                                            On Schedule
                                                        </div>
                                                    </div>
                                                    <div className="h-64 w-full">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={[
                                                                { name: 'Day 1', count: 380 }, { name: 'Day 2', count: 395 }, { name: 'Day 3', count: 412 },
                                                                { name: 'Day 4', count: 405 }, { name: 'Day 5', count: 420 }, { name: 'Day 6', count: 418 },
                                                                { name: 'Day 7', count: 420 }, { name: 'Day 8', count: 415 }, { name: 'Day 9', count: 410 },
                                                                { name: 'Day 10', count: 420 }, { name: 'Day 11', count: 420 }, { name: 'Day 12', count: 415 },
                                                                { name: 'Day 13', count: 420 }, { name: 'Day 14', count: 420 }
                                                            ]}>
                                                                <defs>
                                                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                                                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                                                    </linearGradient>
                                                                </defs>
                                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                                <XAxis dataKey="name" hide />
                                                                <YAxis hide domain={['dataMin - 50', 'dataMax + 20']} />
                                                                <Tooltip 
                                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                                />
                                                                <Area type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-[2rem] p-8 text-white shadow-xl shadow-green-100">
                                                    <Trophy className="w-10 h-10 mb-4 text-green-200" />
                                                    <h3 className="text-xl font-black mb-2">Impact Leader</h3>
                                                    <p className="text-sm text-green-100 mb-6 font-medium">Ranked top 10% in LGA for feeding compliance and student performance metrics.</p>
                                                    <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                                                        <div className="text-xs font-bold uppercase tracking-widest text-green-200">Compliance</div>
                                                        <div className="text-xl font-black italic">EXCEPTIONAL</div>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                                                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Key Statistics</h4>
                                                    <div className="space-y-4">
                                                        <StatItem label="Academic Calendar" value="Term 2 / Day 42" icon={<Calendar className="w-4 h-4 text-blue-500" />} />
                                                        <StatItem label="State Rank" value="#12 / Lagos" icon={<Trophy className="w-4 h-4 text-orange-500" />} />
                                                        <StatItem label="Digitalization" value="100% COMPLETE" icon={<ShieldCheck className="w-4 h-4 text-green-500" />} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'needs' && (
                                    <motion.div
                                        key="needs"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Current Needs</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {needs.map((need, index) => (
                                                <motion.div
                                                    key={need}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                                                >
                                                    <div className="w-6 h-1 bg-gradient-to-r from-mint-500 to-mint-600 rounded-full mb-3"></div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">{need}</h4>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        This area needs immediate support to improve the learning environment.
                                                    </p>
                                                    <Link
                                                        to={`/donate?schoolId=${school?.id || ''}`}
                                                        className="inline-flex items-center px-4 py-2 bg-mint-500 hover:bg-mint-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                                    >
                                                        Support This Need
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'donations' && (
                                    <motion.div
                                        key="donations"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {donations.slice(0, 8).map((donation, index) => (
                                                <motion.div
                                                    key={donation.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-white border border-gray-200 rounded-xl p-6"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-semibold text-gray-900">{donation.donorName}</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${donation.type === 'CASH'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {donation.type === 'CASH' ? 'Cash' : 'In-Kind'}
                                                        </span>
                                                    </div>
                                                    {donation.type === 'CASH' ? (
                                                        <div className="text-lg font-semibold text-gray-900 mb-2">
                                                            ₦{(donation.amount || 0).toLocaleString()}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-700 mb-2">
                                                            {donation.kindType} — {donation.kindDesc}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(donation.date).toLocaleDateString()}
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {donations.length === 0 && (
                                                <div className="col-span-full text-center py-16 px-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                                    <div className="w-20 h-20 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                                        <Heart className="w-10 h-10 text-mint-500" />
                                                    </div>
                                                    <h4 className="text-xl font-bold text-gray-900 mb-3">No donations yet</h4>
                                                    <p className="text-gray-600 mb-8 max-w-sm mx-auto">Your generosity can be the very first to change lives at this school.</p>
                                                    <Link
                                                        to={`/donate?schoolId=${school?.id || ''}`}
                                                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                                    >
                                                        <HeartHandshake className="w-5 h-5" />
                                                        Make the First Donation
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'gallery' && (
                                    <motion.div
                                        key="gallery"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">School Gallery</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {galleryImages.map((image, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                                    onClick={() => setSelectedImage(image)}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`${school?.name || 'School'} gallery image ${index + 1} showing school facilities`}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {tab === 'contact' && (
                                    <motion.div
                                        key="contact"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-8">
                                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <div className="w-12 h-12 bg-mint-100 rounded-xl flex items-center justify-center shrink-0">
                                                        <Mail className="w-6 h-6 text-mint-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-lg mb-1">Email</h4>
                                                        <p className="text-gray-600 text-base">{school?.email || 'contact@school.edu.ng'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center shrink-0">
                                                        <Phone className="w-6 h-6 text-sky-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-lg mb-1">Phone</h4>
                                                        <p className="text-gray-600 text-base">{school?.phone || '+234 800 000 0000'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                                                        <MapPin className="w-6 h-6 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-lg mb-1">Address</h4>
                                                        <p className="text-gray-600 text-base leading-relaxed">{school?.address || 'School Address, City, State'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-mint-50 to-emerald-50 border border-mint-100/50 rounded-3xl p-8 shadow-sm">
                                                <h4 className="text-xl font-bold text-gray-900 mb-4">Get Involved</h4>
                                                <p className="text-gray-600 mb-8 leading-relaxed">
                                                    Want to learn more about how you can help? Contact us directly or make a donation today. Your support can profoundly change the lives of these students.
                                                </p>
                                                <Link
                                                    to={`/donate?schoolId=${school?.id || ''}`}
                                                    className="inline-flex w-full items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                                                >
                                                    Support This School
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="max-w-4xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt={`${school?.name || 'School'} gallery image in full view`}
                                className="w-full h-full object-contain rounded-lg"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-4 -right-4 md:top-4 md:right-4 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <BackToTop />
            <StickyDonateButton schoolId={school?.id} />
        </div>
    )
}

function MetricCard({ icon, title, value, subtitle, color }: any) {
    const bgColors: any = {
        green: 'bg-green-50 text-green-600 border-green-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100'
    }
    return (
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 rounded-2xl ${bgColors[color]} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{title}</div>
            <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
            <div className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">{subtitle}</div>
        </div>
    )
}

function StatItem({ label, value, icon }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100">
                    {icon}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-sm font-black text-gray-900">{value}</div>
        </div>
    )
}


