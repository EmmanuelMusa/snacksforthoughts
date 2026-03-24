import { useState } from 'react'

interface DashboardStepsProps {
    formData: any
    updateFormData: (data: any) => void
}

export function DashboardStep1({ formData, updateFormData }: DashboardStepsProps) {
    const [data, setData] = useState({
        name: formData.name || '',
        nin: formData.nin || '',
        email: formData.email || '',
        password: formData.password || '',
        ...formData
    })

    const handleChange = (field: string, value: string) => {
        const newData = { ...data, [field]: value }
        setData(newData)
        updateFormData(newData)
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-medium"
                    placeholder="Enter your full name"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">National Identity Number (NIN)</label>
                <input
                    type="text"
                    value={data.nin}
                    onChange={(e) => handleChange('nin', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-medium tracking-widest"
                    placeholder="11-digit NIN"
                    required
                />
                <p className="text-xs text-green-600 font-medium mt-1">✓ Secure NIMC Verification</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="official@example.com"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                    type="password"
                    value={data.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Account password"
                    required
                />
            </div>
        </div>
    )
}

export function DashboardStep2({ formData, updateFormData }: DashboardStepsProps) {
    const [data, setData] = useState({
        role: formData.role || 'SCHOOL_REPORTER',
        state: formData.state || '',
        lga: formData.lga || '',
        ...formData
    })

    const handleChange = (field: string, value: string) => {
        const newData = { ...data, [field]: value }
        setData(newData)
        updateFormData(newData)
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operational Role</label>
                <select
                    value={data.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-bold"
                >
                    <option value="SUPPLIER">Verified Food Supplier</option>
                    <option value="VERIFIER">Regional School Verifier</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State (If Applicable)</label>
                    <input
                        type="text"
                        value={data.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="e.g. Kano"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LGA (If Applicable)</label>
                    <input
                        type="text"
                        value={data.lga}
                        onChange={(e) => handleChange('lga', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="e.g. Nasarawa"
                    />
                </div>
            </div>
        </div>
    )
}

export function DashboardStep3({ formData }: DashboardStepsProps) {
    return (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Official Registration</h3>
                <div className="space-y-4 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Name:</span> 
                        <span className="font-bold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">NIN:</span> 
                        <span className="font-bold tracking-widest">{formData.nin}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Role:</span> 
                        <span className="font-bold">{formData.role}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
