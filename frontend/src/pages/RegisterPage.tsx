import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useDonation } from '../context/DonationContext'

type Role = 'DONOR' | 'SCHOOL' | 'SUPPLIER' | 'VERIFIER'

interface RoleOption {
    key: Role
    label: string
    description: string
    icon: string
    fields: string[]
}

const ROLE_OPTIONS: RoleOption[] = [
    {
        key: 'DONOR',
        label: 'Donor',
        description: 'Fund school breakfast programs and track your impact in real time.',
        icon: 'D',
        fields: ['name', 'email', 'nin', 'password']
    },
    {
        key: 'SCHOOL',
        label: 'School',
        description: 'Register your school to receive support, supplies, and nutritional programs.',
        icon: 'S',
        fields: ['name', 'email', 'nin', 'password', 'state', 'lga']
    },
    {
        key: 'SUPPLIER',
        label: 'Food Supplier',
        description: 'Apply as a verified supplier to fulfil school snack requests in your state.',
        icon: 'F',
        fields: ['name', 'email', 'nin', 'password', 'state', 'companyName']
    },
    {
        key: 'VERIFIER',
        label: 'Verifier',
        description: 'Serve as a regional field agent to verify deliveries and report outcomes.',
        icon: 'V',
        fields: ['name', 'email', 'nin', 'password', 'state', 'lga']
    },
]

const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
    "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
    "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
]

export default function RegisterPage() {
    const { apiBaseUrl } = useDonation()
    const navigate = useNavigate()

    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const payload = { ...formData, role: selectedRole }
            const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Registration failed')
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2500)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const activeRole = ROLE_OPTIONS.find(r => r.key === selectedRole)

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful</h2>
                    <p className="text-gray-500">Your account has been created. Redirecting to login...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Top bar */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/images/Coat_of_arms_of_Nigeria.svg.png" alt="Nigeria" className="h-8 w-auto" />
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">PBAT Feeds</span>
                </div>
                <Link to="/login" className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                    Already have an account? Sign in
                </Link>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-black text-slate-900 mb-3">Create Your Account</h1>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Select your role to join Nigeria's national school breakfast initiative. Each role has unique responsibilities and access.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!selectedRole ? (
                        <motion.div
                            key="role-select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                        >
                            {ROLE_OPTIONS.map((role, i) => (
                                <motion.button
                                    key={role.key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    onClick={() => setSelectedRole(role.key)}
                                    className="group text-left p-7 bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-5 text-white font-black text-lg group-hover:scale-110 transition-transform">
                                        {role.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{role.label}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{role.description}</p>
                                    <div className="mt-5 flex items-center gap-2 text-blue-600 text-sm font-semibold group-hover:gap-3 transition-all">
                                        Select <span className="text-xs">&#8594;</span>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl mx-auto"
                        >
                            {/* Role header */}
                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={() => { setSelectedRole(null); setError(''); setFormData({}) }}
                                    className="text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                                        {activeRole?.icon}
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase tracking-widest font-medium">Registering as</div>
                                        <div className="text-lg font-bold text-slate-900">{activeRole?.label}</div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 p-8 space-y-5">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                                    <input name="name" type="text" required onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm font-medium"
                                        placeholder="Your legal full name" />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                                    <input name="email" type="email" onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm font-medium"
                                        placeholder="you@example.com" />
                                </div>

                                {/* NIN */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">National Identity Number (NIN)</label>
                                    <input name="nin" type="text" maxLength={11} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm font-mono tracking-widest"
                                        placeholder="11-digit NIN" />
                                </div>

                                {/* Company Name (Supplier only) */}
                                {selectedRole === 'SUPPLIER' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Company / Business Name</label>
                                        <input name="companyName" type="text" required onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm font-medium"
                                            placeholder="Registered company name" />
                                    </div>
                                )}

                                {/* State */}
                                {(selectedRole === 'SCHOOL' || selectedRole === 'SUPPLIER' || selectedRole === 'VERIFIER') && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">State of Operation</label>
                                        <select name="state" required onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm font-medium">
                                            <option value="">Select state</option>
                                            {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}

                                {/* LGA */}
                                {(selectedRole === 'SCHOOL' || selectedRole === 'VERIFIER') && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Local Government Area</label>
                                        <input name="lga" type="text" required onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm font-medium"
                                            placeholder="Your LGA" />
                                    </div>
                                )}

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Password</label>
                                    <input name="password" type="password" required minLength={8} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm"
                                        placeholder="Min. 8 characters" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 mt-2"
                                >
                                    {isLoading ? 'Creating account...' : `Register as ${activeRole?.label}`}
                                </button>
                            </form>

                            <p className="text-center text-sm text-slate-400 mt-6">
                                Already registered?{' '}
                                <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in here</Link>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
