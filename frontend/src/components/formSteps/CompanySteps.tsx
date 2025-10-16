import { useState } from 'react'

interface CompanyStepsProps {
    formData: any
    updateFormData: (data: any) => void
}

export function CompanyStep1({ formData, updateFormData }: CompanyStepsProps) {
    const [data, setData] = useState({
        companyName: formData.companyName || '',
        contactPerson: formData.contactPerson || '',
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
                        Company Name
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    placeholder="Enter your company name"
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> This will be displayed on your company profile</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Contact Person
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <input
                    type="text"
                    value={data.contactPerson}
                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    placeholder="Full name of primary contact"
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> The main person we'll communicate with</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            Company Email
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                        </span>
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                        placeholder="contact@company.com"
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

export function CompanyStep2({ formData, updateFormData }: CompanyStepsProps) {
    const [data, setData] = useState({
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        website: formData.website || '',
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
                        Company Address
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <textarea
                    value={data.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    rows={3}
                    placeholder="Enter your company address"
                />
                <p className="text-xs text-gray-500 mt-1"> Helps us understand your location for local partnerships</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            City
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                        </span>
                    </label>
                    <input
                        type="text"
                        value={data.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                        placeholder="Your city"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            State
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                        </span>
                    </label>
                    <select
                        value={data.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    >
                        <option value="">Select your state</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Kano">Kano</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        🌐 Company Website
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <input
                    type="url"
                    value={data.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    placeholder="https://www.company.com"
                />
                <p className="text-xs text-gray-500 mt-1"> Helps donors learn more about your company</p>
            </div>
        </div>
    )
}

export function CompanyStep3({ formData, updateFormData }: CompanyStepsProps) {
    const [data, setData] = useState({
        description: formData.description || '',
        supportArea: formData.supportArea || '',
        logo: formData.logo || null,
        companySize: formData.companySize || '',
        ...formData
    })

    const handleChange = (field: string, value: any) => {
        const newData = { ...data, [field]: value }
        setData(newData)
        updateFormData(newData)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleChange('logo', file)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Company Description
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    rows={4}
                    placeholder="Tell us about your company, mission, and values..."
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> This helps schools and donors understand your company better</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            Preferred Support Area
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                        </span>
                    </label>
                    <select
                        value={data.supportArea}
                        onChange={(e) => handleChange('supportArea', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                        required
                    >
                        <option value="">Select support area</option>
                        <option value="Education">Education</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Sports">Sports</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1"> Where your company wants to make the most impact</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            👥 Company Size
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                        </span>
                    </label>
                    <select
                        value={data.companySize}
                        onChange={(e) => handleChange('companySize', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Company Logo
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-mint-400 transition-colors duration-200">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="text-4xl mb-2"></div>
                        <div className="text-sm text-gray-600">
                            {data.logo ? data.logo.name : 'Click to upload your company logo'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2"> Your logo will be displayed on your company profile</p>
            </div>
        </div>
    )
}

export function CompanyStep4({ formData }: CompanyStepsProps) {
    return (
        <div className="space-y-6">
            <div className="bg-mint-50 border border-mint-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    Review Your Company Information
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Company Name</label>
                            <p className="text-gray-900">{formData.companyName || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Contact Person</label>
                            <p className="text-gray-900">{formData.contactPerson || 'Not provided'}</p>
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
                            <label className="text-sm font-medium text-gray-600">Support Area</label>
                            <p className="text-gray-900">{formData.supportArea || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Company Size</label>
                            <p className="text-gray-900">{formData.companySize || 'Not provided'}</p>
                        </div>
                    </div>

                    {formData.description && (
                        <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <p className="text-gray-900">{formData.description}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">🎉 What happens next?</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Your company profile will be reviewed and approved</li>
                    <li>• You'll receive a welcome email with partnership details</li>
                    <li>• Access to corporate dashboard and reporting tools</li>
                    <li>• Connect with schools that match your support areas</li>
                    <li>• Track your company's impact and CSR metrics</li>
                </ul>
            </div>
        </div>
    )
}
