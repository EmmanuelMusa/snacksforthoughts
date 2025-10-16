import { useState } from 'react'

interface VendorStepsProps {
    formData: any
    updateFormData: (data: any) => void
}

export function VendorStep1({ formData, updateFormData }: VendorStepsProps) {
    const [data, setData] = useState({
        name: formData.name || '',
        businessName: formData.businessName || '',
        email: formData.email || '',
        phone: formData.phone || '',
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Your Name
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    placeholder="Enter your full name"
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> This will be your primary contact name</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Business Name
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <input
                    type="text"
                    value={data.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    placeholder="Enter your business name (if applicable)"
                />
                <p className="text-xs text-gray-500 mt-1"> Leave blank if you work as an individual</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            Email Address
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                        </span>
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                        placeholder="your.email@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            Phone Number
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                        </span>
                    </label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                        placeholder="+234 800 000 0000"
                        required
                    />
                </div>
            </div>
        </div>
    )
}

export function VendorStep2({ formData, updateFormData }: VendorStepsProps) {
    const [data, setData] = useState({
        category: formData.category || '',
        location: formData.location || '',
        experience: formData.experience || '',
        ...formData
    })

    const handleChange = (field: string, value: string) => {
        const newData = { ...data, [field]: value }
        setData(newData)
        updateFormData(newData)
    }

    const categories = [
        { value: 'Cook', label: 'Cook', icon: '' },
        { value: 'Painter', label: 'Painter', icon: '' },
        { value: 'Carpenter', label: 'Carpenter', icon: '' },
        { value: 'Builder', label: 'Builder', icon: '' },
        { value: 'Plumber', label: 'Plumber', icon: '' },
        { value: 'Decorator', label: 'Decorator', icon: '' },
        { value: 'Electrician', label: 'Electrician', icon: '' },
        { value: 'Supplier', label: 'Supplier', icon: '' },
        { value: 'Other', label: 'Other', icon: '' }
    ]

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Service Category
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                        <label key={category.value} className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${data.category === category.value
                            ? 'border-mint-500 bg-mint-50'
                            : 'border-gray-200 hover:border-mint-300'
                            }`}>
                            <input
                                type="radio"
                                name="category"
                                value={category.value}
                                checked={data.category === category.value}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="sr-only"
                            />
                            <div className="text-center">
                                <div className="text-2xl mb-1">{category.icon}</div>
                                <div className="text-sm font-medium">{category.label}</div>
                            </div>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2"> Select the service you provide to schools</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Location
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <input
                    type="text"
                    value={data.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    placeholder="City, State (e.g., Lagos, Lagos State)"
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> Helps schools find vendors in their area</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Years of Experience
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <select
                    value={data.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                </select>
                <p className="text-xs text-gray-500 mt-1"> Helps schools understand your expertise level</p>
            </div>
        </div>
    )
}

export function VendorStep3({ formData, updateFormData }: VendorStepsProps) {
    const [data, setData] = useState({
        verificationDoc: formData.verificationDoc || null,
        portfolio: formData.portfolio || null,
        description: formData.description || '',
        ...formData
    })

    const handleChange = (field: string, value: any) => {
        const newData = { ...data, [field]: value }
        setData(newData)
        updateFormData(newData)
    }

    const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleChange(field, file)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Verification Document (ID)
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-mint-400 transition-colors duration-200">
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange('verificationDoc')}
                        className="hidden"
                        id="verification-upload"
                    />
                    <label htmlFor="verification-upload" className="cursor-pointer">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="text-sm text-gray-600">
                            {data.verificationDoc ? data.verificationDoc.name : 'Click to upload your ID document'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2"> Required for verification - National ID, Driver's License, or Passport</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Portfolio/Work Samples
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-mint-400 transition-colors duration-200">
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange('portfolio')}
                        className="hidden"
                        id="portfolio-upload"
                    />
                    <label htmlFor="portfolio-upload" className="cursor-pointer">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="text-sm text-gray-600">
                            {data.portfolio ? data.portfolio.name : 'Click to upload your portfolio'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2"> Showcase your previous work to schools</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Service Description
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    rows={4}
                    placeholder="Describe your services, specialties, and what makes you unique..."
                />
                <p className="text-xs text-gray-500 mt-1"> Help schools understand what you offer</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-amber-600 text-xl"></span>
                    <div>
                        <h4 className="font-medium text-amber-800">Verification Required</h4>
                        <p className="text-sm text-amber-700 mt-1">
                            All vendors must undergo verification before being listed on the platform.
                            This process typically takes 2-3 business days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function VendorStep4({ formData }: VendorStepsProps) {
    return (
        <div className="space-y-6">
            <div className="bg-mint-50 border border-mint-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    Review Your Vendor Information
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-gray-900">{formData.name || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Business Name</label>
                            <p className="text-gray-900">{formData.businessName || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-gray-900">{formData.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Phone</label>
                            <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Service Category</label>
                            <p className="text-gray-900">{formData.category || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Location</label>
                            <p className="text-gray-900">{formData.location || 'Not provided'}</p>
                        </div>
                    </div>

                    {formData.description && (
                        <div>
                            <label className="text-sm font-medium text-gray-600">Service Description</label>
                            <p className="text-gray-900">{formData.description}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Your application will be reviewed by our team</li>
                    <li>• Verification documents will be checked (2-3 business days)</li>
                    <li>• You'll receive an email with verification status</li>
                    <li>• Once approved, your profile will be visible to schools</li>
                    <li>• Schools can contact you directly for services</li>
                </ul>
            </div>
        </div>
    )
}
