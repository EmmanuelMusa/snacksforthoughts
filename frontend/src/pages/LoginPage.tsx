import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDonation } from '../context/DonationContext'

export default function LoginPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { login } = useAuth()
    const { apiBaseUrl } = useDonation()

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to login')

            login(data.user, data.token)

            // If redirected from payment flow, go back
            const redirect = searchParams.get('redirect')
            if (redirect === 'donation') {
                navigate('/#donation-flow')
                setTimeout(() => document.getElementById('donation-flow')?.scrollIntoView({ behavior: 'smooth' }), 300)
                return
            }

            switch (data.user.role) {
                case 'ADMIN': navigate('/admin'); break
                case 'SUPPLIER': navigate('/dashboard/supplier'); break
                case 'VERIFIER': navigate('/dashboard/verifier'); break
                case 'DONOR': navigate('/dashboard/donor'); break
                default: navigate('/')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const fillCredentials = (email: string, pwd: string) => {
        setIdentifier(email)
        setPassword(pwd)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
            {/* Top bar */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/images/Coat_of_arms_of_Nigeria.svg.png" alt="Nigeria" className="h-8 w-auto" />
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">PBAT Feeds</span>
                </div>
                <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                    Back to Home
                </Link>
            </div>

            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Welcome Back</h1>
                        <p className="text-slate-500 text-sm">Sign in using your Email or NIN</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                    Email Address or NIN
                                </label>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm font-medium"
                                    placeholder="Enter your email or 11-digit NIN"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-400 mt-6">
                            No account?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
