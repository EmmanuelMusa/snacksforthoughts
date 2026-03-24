import { useState } from 'react'
import { motion } from 'framer-motion'
import MultiStepForm from '../components/MultiStepForm'
import { useDonation } from '../context/DonationContext'

// Import step components
import { IndividualStep1, IndividualStep2, IndividualStep3, IndividualStep4 } from '../components/formSteps/IndividualSteps'
import { CompanyStep1, CompanyStep2, CompanyStep3, CompanyStep4 } from '../components/formSteps/CompanySteps'
import { VendorStep1, VendorStep2, VendorStep3, VendorStep4 } from '../components/formSteps/VendorSteps'
import { SchoolStep1, SchoolStep2, SchoolStep3, SchoolStep4 } from '../components/formSteps/SchoolSteps'
import { DashboardStep1, DashboardStep2, DashboardStep3 } from '../components/formSteps/DashboardSteps'

type TabKey = 'school' | 'supplier' | 'verifier'

const tabs: { key: TabKey; label: string; icon: string; description: string }[] = [
    { key: 'school', label: 'School Registration', icon: '🏫', description: 'Register your school for support' },
    { key: 'supplier', label: 'Food Supplier', icon: '🚚', description: 'Apply as a verified food supplier' },
    { key: 'verifier', label: 'Local Verifier', icon: '🔍', description: 'Join as a regional impact verifier' },
]

export default function RegisterPage() {
    const { apiBaseUrl } = useDonation()
    const [active, setActive] = useState<TabKey>('school')

    const handleSubmit = async (formData: any) => {
        const fd = new FormData()

        // For Supplier/Verifier, we need to ensure the role is set correctly before sending
        const dataToSubmit = { ...formData }
        if (active === 'supplier') dataToSubmit.role = 'SUPPLIER'
        if (active === 'verifier') dataToSubmit.role = 'VERIFIER'

        // Add all form data to FormData
        Object.keys(dataToSubmit).forEach(key => {
            if (dataToSubmit[key] instanceof File) {
                fd.append(key, dataToSubmit[key])
            } else if (Array.isArray(dataToSubmit[key])) {
                fd.append(key, JSON.stringify(dataToSubmit[key]))
            } else {
                fd.append(key, dataToSubmit[key])
            }
        })

        const isOfficial = active === 'supplier' || active === 'verifier'
        const endpoint = isOfficial ? 'auth/register' : 'schools'

        const requestOptions = isOfficial ? {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSubmit)
        } : {
            method: 'POST',
            body: fd
        }

        const res = await fetch(`${apiBaseUrl}/api/${endpoint}`, requestOptions)

        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || 'Failed to submit registration')
        }
    }

    const getSteps = () => {
        switch (active) {
            case 'school':
                return [
                    {
                        title: 'School Information',
                        description: 'Basic school details',
                        icon: '',
                        component: <SchoolStep1 formData={{}} updateFormData={() => { }} />
                    },
                    {
                        title: 'Contact Details',
                        description: 'How can we reach you?',
                        icon: '',
                        component: <SchoolStep2 formData={{}} updateFormData={() => { }} />
                    },
                    {
                        title: 'Needs Assessment',
                        description: 'What does your school need?',
                        icon: '',
                        component: <SchoolStep3 formData={{}} updateFormData={() => { }} />
                    },
                    {
                        title: 'Confirmation',
                        description: 'Review and submit',
                        icon: '',
                        component: <SchoolStep4 formData={{}} updateFormData={() => { }} />
                    }
                ]
            case 'supplier':
            case 'verifier':
                return [
                    {
                        title: 'Identity Verification',
                        description: 'Verify your ID and contact details',
                        icon: '',
                        component: <DashboardStep1 formData={{}} updateFormData={() => { }} />
                    },
                    {
                        title: 'Role & Assignment',
                        description: 'Configure your operational area',
                        icon: '',
                        component: <DashboardStep2 formData={{}} updateFormData={() => { }} />
                    },
                    {
                        title: 'Final Review',
                        description: 'Confirm registration details',
                        icon: '',
                        component: <DashboardStep3 formData={{}} updateFormData={() => { }} />
                    }
                ]
            default:
                return []
        }
    }

    const activeTab = tabs.find(tab => tab.key === active)

    return (
        <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 mb-4"
                    >
                        Join Our Community
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Be part of the movement to nourish minds and transform education across Nigeria
                    </motion.p>
                </div>

                {/* Tab Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActive(tab.key)}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${active === tab.key
                                ? 'border-green-500 bg-green-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                                }`}
                        >
                            <div className="text-3xl mb-2">{tab.icon}</div>
                            <div className="font-semibold text-gray-900 mb-1">{tab.label}</div>
                            <div className="text-sm text-gray-600">{tab.description}</div>
                        </button>
                    ))}
                </motion.div>

                {/* Multi-step Form */}
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <MultiStepForm
                        steps={getSteps()}
                        onSubmit={handleSubmit}
                        onSuccess={() => { }}
                        title={`${activeTab?.icon} ${activeTab?.label} Registration`}
                        description={`Complete your ${activeTab?.label.toLowerCase()} registration in a few simple steps`}
                    />
                </motion.div>
            </div>
        </section>
    )
}



