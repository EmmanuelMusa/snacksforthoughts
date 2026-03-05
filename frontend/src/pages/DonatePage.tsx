import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDonation } from '../context/DonationContext'
import { motion, AnimatePresence } from 'framer-motion'
import BackToTop from '../components/BackToTop'

type School = { id: string; name: string; raisedAmount: number; targetAmount: number }

export default function DonatePage() {
    const { session, setSession, addDonation, apiBaseUrl } = useDonation()
    const [searchParams] = useSearchParams()
    const [amount, setAmount] = useState('')
    const [donationType, setDonationType] = useState<'CASH' | 'IN_KIND'>('CASH')
    const [kindType, setKindType] = useState('Materials')
    const [kindDesc, setKindDesc] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [schools, setSchools] = useState<School[]>([])
    const [schoolId, setSchoolId] = useState('')
    const [donorName, setDonorName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('')

    useEffect(() => {
        let cancelled = false

        ;(async () => {
            try {
                const pre = searchParams.get('schoolId')

                const res = await fetch(`${apiBaseUrl}/api/schools/search?limit=200&page=1`)
                const json = await res.json()
                const payload = (json as any).data ?? json
                const list: School[] = payload.schools || []

                if (pre && !list.find(s => s.id === pre)) {
                    try {
                        const sRes = await fetch(`${apiBaseUrl}/api/schools/${encodeURIComponent(pre)}`)
                        const sJson = await sRes.json()
                        const school = (sJson as any).data ?? sJson
                        if (school?.id) list.unshift(school)
                    } catch {
                        // ignore
                    }
                }

                if (cancelled) return
                setSchools(list)

                if (pre && list.find(s => s.id === pre)) {
                    setSchoolId(pre)
                } else if (list.length && !schoolId) {
                    setSchoolId(list[0].id)
                }
            } catch {
                if (!cancelled) setSchools([])
            }
        })()

        return () => {
            cancelled = true
        }
    }, [apiBaseUrl, searchParams, schoolId])

    const selected = useMemo(() => schools.find(s => s.id === schoolId), [schools, schoolId])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!amount || !schoolId) return
        setSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('donorName', donorName || 'Anonymous')
            fd.append('schoolId', schoolId)
            fd.append('type', donationType)
            if (donationType === 'CASH') {
                fd.append('amount', String(Number(amount)))
            } else {
                fd.append('kindType', kindType)
                fd.append('kindDesc', kindDesc)
            }
            if (imageFile) fd.append('image', imageFile)

            const res = await fetch(`${apiBaseUrl}/api/donations`, {
                method: 'POST',
                body: fd,
            })
            if (!res.ok) throw new Error('Failed to donate')
            const donation = await res.json()
            addDonation(donation)
            setSession({ donorName: donation.donorName })
            const msg =
                donation.type === 'IN_KIND'
                    ? `Thank you, ${donation.donorName}! Your in-kind donation was received.`
                    : `Thank you, ${donation.donorName}! Your donation of ₦${Number(donation.amount || 0).toLocaleString()} was received.`
            setSuccessMsg(msg)
            setOpenModal(true)
            // optimistic update
            if (donationType === 'CASH') {
                setSchools(prev => prev.map(s => s.id === schoolId ? { ...s, raisedAmount: s.raisedAmount + Number(amount) } : s))
            }
            setAmount('')
            setKindDesc('')
            setImageFile(null)
        } catch (err) {
            alert('Could not process donation. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-gray-900 mb-4"
                        >
                            Make a Difference Today
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto"
                        >
                            Your generosity helps nourish minds and transform education across Nigeria
                        </motion.p>
                    </div>

                    {/* Split Layout */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Side - Inspirational Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Inspirational Image */}
                            <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                <div
                                    className="h-80 bg-cover bg-center"
                                    style={{
                                        backgroundImage: "url('/images/children_in_a_classroom_in_nigeria_smiling.jpeg')"
                                    }}
                                    role="img"
                                    aria-label="Children in a Nigerian classroom, representing the impact of donations"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">Every Child Deserves Quality Education</h3>
                                    <p className="text-white/90">Join thousands of donors making a real impact in Nigerian schools</p>
                                </div>
                            </div>

                            {/* Impact Stats */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
                                    <div className="text-sm text-gray-600">Schools Helped</div>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">25,000+</div>
                                    <div className="text-sm text-gray-600">Meals Served</div>
                                </div>
                            </div>

                            {/* Testimonial */}
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 italic mb-3">
                                            "The support we received transformed our school. Our students now have proper meals and better learning facilities."
                                        </p>
                                        <div className="text-sm text-gray-600">
                                            <div className="font-semibold">Mrs. Adebayo</div>
                                            <div>Principal, Unity Primary School</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Donation Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Make Your Donation</h2>

                            {/* Donation Type Tabs */}
                            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setDonationType('CASH')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${donationType === 'CASH'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Cash Donation
                                </button>
                                <button
                                    onClick={() => setDonationType('IN_KIND')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${donationType === 'IN_KIND'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    In-Kind Donation
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Donor Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name (Optional)
                                    </label>
                                    <input
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                        placeholder="Anonymous"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                    />
                                </div>

                                {/* School Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select School
                                    </label>
                                    <select
                                        value={schoolId}
                                        onChange={(e) => setSchoolId(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                        required
                                    >
                                        <option value="">Choose a school to support</option>
                                        {schools.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Donation Type Specific Fields */}
                                <AnimatePresence mode="wait">
                                    {donationType === 'CASH' ? (
                                        <motion.div
                                            key="cash"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Donation Amount (₦)
                                                </label>
                                                <input
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    type="number"
                                                    min="100"
                                                    placeholder="5000"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                                    required
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Minimum donation: ₦100</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Payment Method
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <label className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value="card"
                                                            checked={paymentMethod === 'card'}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="text-center">
                                                            <div className="text-sm font-medium">Card</div>
                                                        </div>
                                                    </label>
                                                    <label className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'bank' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value="bank"
                                                            checked={paymentMethod === 'bank'}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="text-center">
                                                            <div className="text-sm font-medium">Bank Transfer</div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="inkind"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Item/Service Category
                                                </label>
                                                <select
                                                    value={kindType}
                                                    onChange={(e) => setKindType(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                                >
                                                    <option>Materials</option>
                                                    <option>Services</option>
                                                    <option>Cooking Utensils</option>
                                                    <option>Instructional Materials</option>
                                                    <option>Furniture</option>
                                                    <option>Building Materials</option>
                                                    <option>Books</option>
                                                    <option>School Uniforms</option>
                                                    <option>Food Items</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={kindDesc}
                                                    onChange={(e) => setKindDesc(e.target.value)}
                                                    rows={4}
                                                    placeholder="Describe the items/services you wish to donate..."
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Photo (Optional)
                                                </label>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                                        className="hidden"
                                                        id="image-upload"
                                                    />
                                                    <label htmlFor="image-upload" className="cursor-pointer">
                                                        <div className="text-sm text-gray-600">
                                                            {imageFile ? imageFile.name : 'Click to upload a photo'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</div>
                                                    </label>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Donation Summary */}
                                {(amount || kindDesc) && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Donation Summary</h4>
                                        <div className="text-sm text-gray-700 space-y-1">
                                            <div>Type: {donationType === 'CASH' ? 'Cash Donation' : 'In-Kind Donation'}</div>
                                            {donationType === 'CASH' && amount && (
                                                <div>Amount: ₦{Number(amount).toLocaleString()}</div>
                                            )}
                                            {donationType === 'IN_KIND' && kindType && (
                                                <div>Category: {kindType}</div>
                                            )}
                                            {selected && (
                                                <div>School: {selected.name}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting || !schoolId || (donationType === 'CASH' ? !amount : !kindDesc)}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {submitting ? 'Processing Donation...' : 'Complete Donation'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {openModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Generosity!</h3>
                            <p className="text-gray-600 mb-6">Your contribution makes a real difference in the lives of children.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                                >
                                    Make Another Donation
                                </button>
                                <button
                                    onClick={() => window.location.href = '/schools'}
                                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors duration-200"
                                >
                                    View Schools
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <BackToTop />
        </section>
    )
}


