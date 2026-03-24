import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Supplier {
    id: string
    name: string
    accountDetails: {
        bankName: string
        accountNumber: string
        accountName: string
    }
    contactInfo: {
        phone: string
        email: string
    }
}

interface PaymentConfirmationProps {
    selectedSupplier: Supplier
    selectedWeeks: string[]
    totalCost: number
    schoolName: string
    studentCount: number
    onPaymentConfirmed: () => void
}

export default function PaymentConfirmation({
    selectedSupplier,
    selectedWeeks,
    totalCost,
    schoolName,
    studentCount,
    onPaymentConfirmed
}: PaymentConfirmationProps) {
    const [paymentConfirmed, setPaymentConfirmed] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handlePaymentConfirmation = async () => {
        // Guard: require login before confirming payment
        if (!isAuthenticated) {
            navigate('/login?redirect=donation')
            return
        }

        setIsProcessing(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setPaymentConfirmed(true)
        setIsProcessing(false)
        setTimeout(() => {
            onPaymentConfirmed()
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h3>
                <p className="text-gray-600">
                    Complete your donation by making payment to the selected supplier
                </p>
            </div>

            <AnimatePresence mode="wait">
                {!paymentConfirmed ? (
                    <motion.div
                        key="payment-details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Order Summary */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">School:</span>
                                    <span className="font-medium">{schoolName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Students:</span>
                                    <span className="font-medium">{studentCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Selected Weeks:</span>
                                    <span className="font-medium">{selectedWeeks.length} week{selectedWeeks.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Supplier:</span>
                                    <span className="font-medium">{selectedSupplier.name}</span>
                                </div>
                                <div className="border-t border-blue-200 pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total Amount:</span>
                                        <span className="text-blue-600">₦{totalCost.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Instructions</h4>
                            <div className="space-y-4">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-sm">!</span>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-yellow-800 mb-1">Important Notice</h5>
                                            <p className="text-sm text-yellow-700">
                                                Payment is made offline directly to the supplier. Please complete the transfer and then confirm your payment below.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h5 className="font-medium text-gray-900 mb-3">Supplier Account Details</h5>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Bank Name:</span>
                                            <span className="font-medium">{selectedSupplier.accountDetails.bankName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Account Number:</span>
                                            <span className="font-medium font-mono">{selectedSupplier.accountDetails.accountNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Account Name:</span>
                                            <span className="font-medium">{selectedSupplier.accountDetails.accountName}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h5 className="font-medium text-blue-900 mb-2">Reference Information</h5>
                                    <p className="text-sm text-blue-700">
                                        Please use this reference when making payment: <strong>SNACKS-{schoolName.replace(/\s+/g, '').toUpperCase()}-{Date.now().toString().slice(-6)}</strong>
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h5 className="font-medium text-gray-900 mb-2">Supplier Contact</h5>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            <strong>Phone:</strong> {selectedSupplier.contactInfo.phone}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Email:</strong> {selectedSupplier.contactInfo.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Confirmation Button */}
                        <div className="text-center">
                            <motion.button
                                onClick={handlePaymentConfirmation}
                                disabled={isProcessing}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                whileHover={!isProcessing ? { scale: 1.05 } : {}}
                                whileTap={!isProcessing ? { scale: 0.95 } : {}}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">✓</span>
                                        I Have Made Payment
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="payment-confirmed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl">✓</span>
                            </div>
                        </motion.div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Confirmed!</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Thank you for your generous donation! The supplier has been notified and will begin preparing the snacks for your selected weeks.
                        </p>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                            <h4 className="font-semibold text-green-800 mb-2">What happens next?</h4>
                            <ul className="text-sm text-green-700 space-y-1 text-left">
                                <li>• Supplier will contact the school to coordinate delivery</li>
                                <li>• You'll receive updates on the delivery progress</li>
                                <li>• School will confirm receipt of snacks</li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
