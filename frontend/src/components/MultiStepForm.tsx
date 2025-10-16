import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Step {
    title: string
    description: string
    icon: string
    component: ReactNode
}

interface MultiStepFormProps {
    steps: Step[]
    onSubmit: (data: any) => Promise<void>
    onSuccess: () => void
    title: string
    description: string
}

export default function MultiStepForm({ steps, onSubmit, onSuccess, title, description }: MultiStepFormProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const progress = ((currentStep + 1) / steps.length) * 100

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const updateFormData = (data: any) => {
        setFormData({ ...formData, ...data })
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await onSubmit(formData)
            setShowSuccess(true)
            setTimeout(() => {
                onSuccess()
            }, 2000)
        } catch (error) {
            alert('Could not submit registration. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const isLastStep = currentStep === steps.length - 1

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-lg text-gray-600">{description}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${index <= currentStep
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 text-gray-400'
                                }`}>
                                {index < currentStep ? (
                                    <span className="text-sm">✓</span>
                                ) : (
                                    <span className="text-sm">{index + 1}</span>
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-16 h-0.5 mx-2 ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Step {currentStep + 1} of {steps.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Step Header */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="text-3xl">{steps[currentStep].icon}</div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{steps[currentStep].title}</h3>
                            <p className="text-gray-600">{steps[currentStep].description}</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {steps[currentStep].component}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            ← Previous
                        </button>

                        {isLastStep ? (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Complete Registration'}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                Next →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <span className="text-3xl">🎉</span>
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                            <p className="text-gray-600">Thank you for joining our community. We'll be in touch soon!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
