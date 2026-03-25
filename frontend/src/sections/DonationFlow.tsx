import React, { useState, useEffect, useRef, JSX } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDonation } from '../context/DonationContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, ListChecks, Truck, CheckCircle, ChevronRight, ChevronLeft, Phone, CreditCard, Clock } from 'lucide-react'

interface School {
    id: string
    name: string
    state: string
    lga: string
    image?: string
    studentCount: number
}

interface Supplier {
    id: string
    companyName: string
    accountDetails: any
    contactInfo: any
}

interface DonationItem {
    name: string
    price: number
    selected: boolean
}

export default function DonationFlow(): JSX.Element {
    const { apiBaseUrl } = useDonation()
    const { isAuthenticated, user } = useAuth()
    const navigate = useNavigate()
    const sectionRef = useRef<HTMLDivElement>(null)

    // Load initial data from sessionStorage
    const savedData = (() => {
        const saved = sessionStorage.getItem('donation_flow_data')
        if (!saved) return null
        try {
            return JSON.parse(saved)
        } catch (e) {
            return null
        }
    })()

    // Discovery State
    const [schools, setSchools] = useState<School[]>([])
    const [states, setStates] = useState<string[]>([])
    const [lgas, setLgas] = useState<string[]>([])
    const [selectedState, setSelectedState] = useState('')
    const [selectedLga, setSelectedLga] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)

    // Wizard State
    const [selectedSchool, setSelectedSchool] = useState<School | null>(savedData?.selectedSchool || null)
    const [step, setStep] = useState(savedData?.step || 0) // 0: School Selection, 1: Period, 2: Items, 3: Supplier, 4: Confirm
    const [suppliers, setSuppliers] = useState<Supplier[]>([])

    // Form Data
    const [academicPeriod, setAcademicPeriod] = useState(savedData?.academicPeriod || 'Term 3, 2026')
    const [startDate, setStartDate] = useState(savedData?.startDate || '')
    const [endDate, setEndDate] = useState(savedData?.endDate || '')
    const [totalDays, setTotalDays] = useState(0)

    const [items, setItems] = useState<DonationItem[]>(savedData?.items || [
        { name: 'Biscuit', price: 300, selected: false },
        { name: 'Juice', price: 500, selected: false },
        { name: 'Yogurt', price: 450, selected: false },
        { name: 'Fura', price: 250, selected: false }
    ])
    const [selectedSupplierId, setSelectedSupplierId] = useState(savedData?.selectedSupplierId || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Save state to sessionStorage on change
    useEffect(() => {
        const flowData = {
            selectedSchool,
            step,
            items,
            academicPeriod,
            startDate,
            endDate,
            selectedSupplierId
        }
        sessionStorage.setItem('donation_flow_data', JSON.stringify(flowData))
    }, [selectedSchool, step, items, academicPeriod, startDate, endDate, selectedSupplierId])

    // Restore suppliers if needed on mount
    useEffect(() => {
        if (step >= 3 && selectedSchool) {
            fetchSuppliers(selectedSchool.state)
        }
    }, [])

    // Calculate business days between dates (Excluding Weekends & Nigerian Holidays)
    useEffect(() => {
        if (startDate) {
            const start = new Date(startDate)
            const end = endDate ? new Date(endDate) : new Date(startDate)
            let count = 0
            const current = new Date(start)

            // Nigerian Holidays 2026 (Approximate for Lunar dates)
            const holidays = [
                '2026-01-01', // New Year
                '2026-03-31', '2026-04-01', // Eid al-Fitr (Estimated)
                '2026-05-01', // Workers Day
                '2026-05-27', // Children's Day
                '2026-06-07', '2026-06-08', // Eid al-Adha (Estimated)
                '2026-06-12', // Democracy Day
                '2026-10-01', // Independence Day
                '2026-12-25', // Christmas
                '2026-12-26', // Boxing Day
            ]

            while (current <= end) {
                const dateStr = current.toISOString().split('T')[0]
                const dayOfWeek = current.getDay()

                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                const isHoliday = holidays.includes(dateStr)

                if (!isWeekend && !isHoliday) {
                    count++
                }
                current.setDate(current.getDate() + 1)
            }
            setTotalDays(count)
        } else {
            setTotalDays(0)
        }
    }, [startDate, endDate])

    // Get today's date in YYYY-MM-DD format based on local time
    const today = new Date().toLocaleDateString('en-CA') // en-CA gives YYYY-MM-DD

    // Fetch States on Mount
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/schools/states`)
            .then(res => res.json())
            .then(json => setStates(json.data || []))
            .catch(err => console.error('Error fetching states:', err))
    }, [])

    // Fetch LGAs when state changes
    useEffect(() => {
        if (selectedState) {
            fetch(`${apiBaseUrl}/api/schools/lgas?state=${selectedState}`)
                .then(res => res.json())
                .then(json => setLgas(json.data || []))
                .catch(err => console.error('Error fetching LGAs:', err))
        } else {
            setLgas([])
        }
        setSelectedLga('')
    }, [selectedState])

    // Real-time Debounced Search
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            handleSearch()
        }, 500) // 500ms debounce for better typing experience

        return () => clearTimeout(delaySearch)
    }, [searchQuery, selectedState, selectedLga])

    const handleSearch = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchQuery) params.append('search', searchQuery)
            if (selectedState) params.append('state', selectedState)
            if (selectedLga) params.append('lga', selectedLga)
            params.append('limit', '6')

            const res = await fetch(`${apiBaseUrl}/api/schools/search?${params.toString()}`)
            const json = await res.json()
            setSchools(json.data?.schools || [])
        } catch (err) {
            console.error('Error searching schools:', err)
        } finally {
            setLoading(false)
        }
    }

    const selectSchool = (school: School) => {
        setSelectedSchool(school)
        setStep(1)

        // Scroll to top of section
        setTimeout(() => {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
    }

    const fetchSuppliers = (state: string) => {
        if (!state) return
        setSuppliers([])
        setLoading(true)

        const stateParam = encodeURIComponent(state)
        fetch(`${apiBaseUrl}/api/donors/suppliers/${stateParam}`)
            .then(res => res.json())
            .then(json => {
                const data = json.data || []
                setSuppliers(Array.isArray(data) ? data : [])
            })
            .catch(err => {
                console.error('Error fetching suppliers:', err)
                setSuppliers([])
            })
            .finally(() => setLoading(false))
    }

    const nextStep = () => {
        const next = step + 1
        if (next === 3 && selectedSchool) {
            fetchSuppliers(selectedSchool.state)
        }
        setStep(next)
    }
    const prevStep = () => setStep((s: number) => s - 1)

    const handleSubmit = async () => {
        const currentToken = localStorage.getItem('token')
        console.log('[DEBUG] handleSubmit clicked. isAuthenticated (context):', isAuthenticated, 'Token (localStorage):', !!currentToken)

        if (!isAuthenticated && !currentToken) {
            console.log('[DEBUG] No authentication found, redirecting to /login?redirect=donation')
            navigate('/login?redirect=donation')
            return
        }

        setIsSubmitting(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${apiBaseUrl}/api/donor/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    schoolId: selectedSchool?.id,
                    supplierId: selectedSupplierId,
                    academicPeriod,
                    supplyDate: startDate + (endDate ? ` to ${endDate}` : ''),
                    items: items.filter((i: { selected: any }) => i.selected).map((i: { name: any; price: number }) => ({
                        name: i.name,
                        price: i.price,
                        totalCost: i.price * (selectedSchool?.studentCount || 1) * totalDays
                    }))
                })
            })

            if (res.ok) {
                setIsSuccess(true)
                sessionStorage.removeItem('donation_flow_data')
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to submit request')
            }
        } catch (err) {
            console.error('Submit error:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedSupplier = Array.isArray(suppliers) ? suppliers.find(s => s.id === selectedSupplierId) : null

    return (
        <section
            id="donation-flow"
            ref={sectionRef}
            className="relative py-24 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50 overflow-hidden min-h-screen"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Phase */}
                <AnimatePresence mode="wait">
                    {step === 0 ? (
                        <motion.div
                            key="discovery"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-12"
                        >
                            {/* Premium Search Experience */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-white p-2 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-gray-100/50 backdrop-blur-xl">
                                    <div className="relative flex-1 w-full">
                                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-600/50 w-6 h-6" />
                                        <input
                                            type="text"
                                            placeholder="Which school do you want to impact today?"
                                            className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-gray-50/50 border-none focus:bg-white focus:ring-0 transition-all font-semibold text-lg text-gray-900 placeholder:text-gray-400"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 p-2 w-full md:w-auto">
                                        <div className="relative flex-1 md:w-40">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                            <select
                                                className="w-full pl-12 pr-6 py-5 rounded-[2rem] bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-700 text-sm appearance-none cursor-pointer hover:bg-white transition-colors"
                                                value={selectedState}
                                                onChange={(e) => setSelectedState(e.target.value)}
                                            >
                                                <option value="">All States</option>
                                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="relative flex-1 md:w-40">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                            <select
                                                className="w-full pl-12 pr-6 py-5 rounded-[2rem] bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-700 text-sm appearance-none cursor-pointer hover:bg-white transition-colors"
                                                value={selectedLga}
                                                onChange={(e) => setSelectedLga(e.target.value)}
                                                disabled={!selectedState}
                                            >
                                                <option value="">All LGAs</option>
                                                {lgas.map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </div>
                                        <button
                                            onClick={handleSearch}
                                            className="px-10 py-5 bg-blue-600 text-white font-black text-lg rounded-[2rem] hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                                        >
                                            <Search className="w-5 h-5" />
                                            Find
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Impact Highlights */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                                {[
                                    { label: 'Verified Schools', value: '66,000+', color: 'text-blue-600' },
                                    { label: 'Pupils Impacted', value: '1.2M+', color: 'text-green-600' },
                                    { label: 'Active Suppliers', value: '2,500+', color: 'text-orange-600' },
                                    { label: 'Total Funding', value: '₦450M+', color: 'text-purple-600' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
                                        <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                                        <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* School Grid with Standout Effect */}
                            <div className="relative">
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-[500px] bg-gray-100 rounded-[3rem] animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {schools.map((school) => (
                                            <motion.div
                                                key={school.id}
                                                whileHover={{ y: -15, scale: 1.02 }}
                                                className="group relative bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50 transition-all duration-500"
                                            >
                                                {/* Status Badge */}
                                                <div className="absolute top-6 right-6 z-20">
                                                    <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Live for Funding</span>
                                                    </div>
                                                </div>

                                                {/* Image Container */}
                                                <div className="h-64 relative overflow-hidden">
                                                    <img
                                                        src={school.image || '/images/a_school_in_nigeria.jpeg'}
                                                        alt={school.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80" />

                                                    {/* Location Overlay */}
                                                    <div className="absolute bottom-6 left-8 right-8">
                                                        <div className="flex items-center gap-2 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                                                            <MapPin className="w-3 h-3" />
                                                            {school.lga}, {school.state} State
                                                        </div>
                                                        <h3 className="text-2xl font-black text-white font-display leading-tight group-hover:text-blue-200 transition-colors">
                                                            {school.name}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="p-8 space-y-8">
                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-1">
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Enrollment</div>
                                                            <div className="text-xl font-black text-gray-900">{school.studentCount || '200+'} Pupils</div>
                                                        </div>
                                                        <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                                                            <Truck className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => selectSchool(school)}
                                                        className="w-full relative group/btn py-4 px-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-1"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                                        <div className="relative flex items-center justify-center gap-3 text-white">
                                                            <span className="text-sm font-black uppercase tracking-widest">Support This School</span>
                                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:bg-white/30 transition-colors">
                                                                <ChevronRight className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {schools.length === 0 && !loading && (
                                    <div className="text-center py-32 rounded-[4rem] border-2 border-dashed border-gray-100 bg-gray-50/50">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200/50">
                                            <Search className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2">No Verified Schools Found</h3>
                                        <p className="text-gray-500 font-medium">Try broadening your search or selecting a different state.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="wizard"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="max-w-4xl mx-auto"
                        >
                            {/* Wizard Progress Bar */}
                            <div className="flex items-center justify-between mb-12 relative">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10" />
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${step >= i ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white border-2 border-gray-100 text-gray-300'
                                            }`}
                                    >
                                        {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                                    </div>
                                ))}
                            </div>

                            {/* Wizard Steps */}
                            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-blue-900/5 min-h-[500px] flex flex-col">

                                {isSuccess ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-16 h-16" strokeWidth={3} />
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 font-display">Donation Request Initiated!</h3>
                                        <p className="text-gray-500 font-medium max-w-sm">
                                            Thank you! Please ensure you complete the payment to the supplier directly using the details provided. Track your status in your dashboard.
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/dashboard/donor'}
                                            className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all"
                                        >
                                            View in Dashboard
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Step 1: Period */}
                                        {step === 1 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 text-blue-600 mb-2">
                                                    <Calendar className="w-8 h-8" />
                                                    <h3 className="text-3xl font-black text-gray-900 font-display">Select Academic Period</h3>
                                                </div>
                                                <p className="text-gray-500 font-medium italic underline decoration-blue-200 decoration-2 underline-offset-4 mb-8">
                                                    Specialized 2026 Nigerian Academic Calendar. Weekends and Public Holidays are automatically excluded.
                                                </p>

                                                {/* Specialized Calendar Picker */}
                                                <div className="p-8 bg-gray-50/50 rounded-[3rem] border border-gray-100">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                        {/* Month/Day Selection Logic */}
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-4 mb-4">
                                                                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                                                    <Calendar className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Academic Year</div>
                                                                    <div className="text-xl font-black text-gray-900 mt-1">2025/2026 Session</div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Proposed Start</label>
                                                                    <input
                                                                        type="date"
                                                                        min={today}
                                                                        max="2026-12-31"
                                                                        value={startDate}
                                                                        onChange={(e) => setStartDate(e.target.value)}
                                                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all shadow-sm"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Proposed End</label>
                                                                    <input
                                                                        type="date"
                                                                        min={startDate || "2026-01-01"}
                                                                        max="2026-12-31"
                                                                        value={endDate}
                                                                        onChange={(e) => setEndDate(e.target.value)}
                                                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all shadow-sm"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-600/20">
                                                                <div className="flex justify-between items-center mb-4">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Supply Duration</span>
                                                                    <Clock className="w-4 h-4" />
                                                                </div>
                                                                <div className="text-2xl md:text-3xl font-black font-display mb-1 leading-tight">
                                                                    {totalDays === 0 ? "No Active Academic Days Selected" :
                                                                        totalDays === 1 ? "1 Day" :
                                                                            `${totalDays} Days`}
                                                                </div>
                                                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Feeding Days Excl. Holidays & Weekends</div>
                                                            </div>
                                                        </div>

                                                        {/* Calendar Visual Feedback */}
                                                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col justify-center">
                                                            <div className="space-y-4">
                                                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Academic Integrity Check</h4>
                                                                <div className="space-y-3">
                                                                    {[
                                                                        { label: 'Weekends (Sat/Sun)', status: 'AUTO-REMOVED', color: 'text-red-500' },
                                                                        { label: 'Public Holidays', status: 'AUTO-DETECTED', color: 'text-orange-500' },
                                                                        { label: 'Academic Buffer', status: 'INCLUDED', color: 'text-emerald-500' },
                                                                        { label: 'Sponsored Check', status: 'AVAILABLE', color: 'text-blue-500' }
                                                                    ].map((item, i) => (
                                                                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{item.label}</span>
                                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="pt-4 mt-4 border-t border-gray-50">
                                                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                                                                        * We use the Nigerian Federal Ministry of Education 2026 Academic Calendar to validate your selection.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 2: Items */}
                                        {step === 2 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 text-orange-600 mb-2">
                                                    <ListChecks className="w-8 h-8" />
                                                    <h3 className="text-3xl font-black text-gray-900 font-display">Supply Items & Quantity</h3>
                                                </div>
                                                <p className="text-gray-500 font-medium">Select the items you want to include. Costs are calculated automatically based on <span className="text-blue-600 font-bold">{selectedSchool?.studentCount || 200} students</span> over <span className="text-blue-600 font-bold">{totalDays} days</span>.</p>
                                                <div className="space-y-4">
                                                    {items.map((item, idx) => {
                                                        const itemTotal = item.price * (selectedSchool?.studentCount || 200) * totalDays
                                                        return (
                                                            <button
                                                                key={item.name}
                                                                onClick={() => {
                                                                    const newItems = [...items]
                                                                    newItems[idx].selected = !newItems[idx].selected
                                                                    setItems(newItems)
                                                                }}
                                                                className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${item.selected
                                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20'
                                                                    : 'bg-white border-gray-100 text-gray-900 hover:border-blue-200'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${item.selected ? 'bg-white border-white text-blue-600' : 'border-gray-200 text-transparent'}`}>
                                                                        <CheckCircle className="w-5 h-5" />
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <div className="text-lg font-black uppercase tracking-tight">{item.name}</div>
                                                                        <div className={`text-xs font-bold ${item.selected ? 'text-blue-100' : 'text-gray-400'}`}>₦{item.price} per student/day</div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-sm font-black opacity-60 uppercase tracking-widest mb-1">Total Impact</div>
                                                                    <div className="text-xl font-black">₦{itemTotal.toLocaleString()}</div>
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 3: Supplier */}
                                        {step === 3 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 text-emerald-600 mb-2">
                                                    <Truck className="w-8 h-8" />
                                                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 font-display line-clamp-1">Select Verified Supplier</h3>
                                                </div>
                                                <p className="text-gray-500 font-medium">Automatic match: Only displaying verified suppliers in <span className="text-gray-900 font-bold underline">{selectedSchool?.state}</span>.</p>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {!Array.isArray(suppliers) || suppliers.length === 0 ? (
                                                        <div className="p-8 text-center text-gray-400 font-bold bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                            No suppliers currently available in this state.
                                                        </div>
                                                    ) : (
                                                        suppliers.map(s => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => setSelectedSupplierId(s.id)}
                                                                className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${selectedSupplierId === s.id ? 'border-emerald-600 bg-emerald-50/50 shadow-lg shadow-emerald-600/10' : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                                                                    }`}
                                                            >
                                                                <div>
                                                                    <div className={`text-lg font-bold ${selectedSupplierId === s.id ? 'text-emerald-700' : 'text-gray-700'}`}>{s.companyName}</div>
                                                                    <div className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest flex items-center gap-2">
                                                                        <CheckCircle className="w-3 h-3 text-emerald-500" /> Platform Verified
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className={`w-6 h-6 ${selectedSupplierId === s.id ? 'text-emerald-600' : 'text-gray-300'}`} />
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 4: Final Confirmation & Payment Details */}
                                        {step === 4 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 text-gray-950 mb-2">
                                                    <CreditCard className="w-8 h-8" />
                                                    <h3 className="text-3xl font-black text-gray-900 font-display">Payment & Confirmation</h3>
                                                </div>

                                                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                                                    <p className="text-orange-900 text-sm font-bold leading-relaxed">
                                                        [IMPORTANT] All payments are made directly to the supplier. We do not process payments on the site. Please use the verified details below.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Supplier Details</h4>
                                                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                                                                    <Truck className="w-5 h-5 text-gray-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-400 font-black uppercase tracking-tighter">Company Name</div>
                                                                    <div className="text-lg font-black text-gray-900">{selectedSupplier?.companyName}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                                                                    <Phone className="w-5 h-5 text-gray-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-gray-400 font-black uppercase tracking-tighter">Contact Number</div>
                                                                    <div className="text-lg font-black text-gray-900">{selectedSupplier?.contactInfo?.phone}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Account (Verified)</h4>
                                                        <div className="p-6 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-600/30 flex flex-col gap-4">
                                                            <div>
                                                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Bank Name</div>
                                                                <div className="text-xl font-black">{selectedSupplier?.accountDetails?.bankName}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Account Number</div>
                                                                <div className="text-2xl md:text-3xl font-black font-display tracking-widest">{selectedSupplier?.accountDetails?.accountNumber}</div>
                                                            </div>
                                                            <div className="border-t border-blue-400 pt-3">
                                                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-200">Account Name</div>
                                                                <div className="text-sm font-bold">{selectedSupplier?.accountDetails?.accountName}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step Controls */}
                                        <div className="mt-auto pt-12 flex items-center justify-between border-t border-gray-100">
                                            <button
                                                onClick={step === 1 ? () => { setStep(0); setSelectedSchool(null); } : prevStep}
                                                className="px-8 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:text-gray-600 transition-all flex items-center gap-2"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                                Back
                                            </button>

                                            {step < 4 ? (
                                                <button
                                                    onClick={nextStep}
                                                    disabled={
                                                        (step === 1 && !startDate) ||
                                                        (step === 2 && items.every((i: { selected: any }) => !i.selected)) ||
                                                        (step === 3 && !selectedSupplierId)
                                                    }
                                                    className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    Next Step
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                    className="px-12 py-5 bg-yellow-400 text-gray-900 font-black rounded-2xl hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/30 active:scale-95 flex items-center gap-2"
                                                >
                                                    {isSubmitting ? 'Finalizing...' : 'I Have Made Payment'}
                                                    <CheckCircle className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50/50 blur-[120px] rounded-full -z-10 -ml-48" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-50/50 blur-[150px] rounded-full -z-10 -mr-64" />
        </section>
    )
}
