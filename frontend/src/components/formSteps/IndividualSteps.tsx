import { useState } from 'react'
import { motion } from 'framer-motion'

interface IndividualStepsProps {
    formData: any
    updateFormData: (data: any) => void
}

export function IndividualStep1({ formData, updateFormData }: IndividualStepsProps) {
    const [data, setData] = useState({
        name: formData.name || '',
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
                        Full Name
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
                <p className="text-xs text-gray-500 mt-1"> We need this to personalize your experience and send you updates</p>
            </div>

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
                <p className="text-xs text-gray-500 mt-1"> We'll use this to send you donation receipts and impact updates</p>
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
                <p className="text-xs text-gray-500 mt-1"> For urgent communication about your donations</p>
            </div>
        </div>
    )
}

export function IndividualStep2({ formData, updateFormData }: IndividualStepsProps) {
    const [data, setData] = useState({
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
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
                        Address
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <textarea
                    value={data.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    rows={3}
                    placeholder="Enter your full address"
                />
                <p className="text-xs text-gray-500 mt-1"> Helps us understand our donor community better</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
        </div>
    )
}

export function IndividualStep3({ formData, updateFormData }: IndividualStepsProps) {
    const [data, setData] = useState({
        preferredDonation: formData.preferredDonation || 'CASH',
        interests: formData.interests || [],
        photo: formData.photo || null,
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
            handleChange('photo', file)
        }
    }

    const interestOptions = [
        'Education',
        'Nutrition',
        'Infrastructure',
        'Healthcare',
        'Technology',
        'Sports'
    ]

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        💰 Preferred Donation Type
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${data.preferredDonation === 'CASH'
                        ? 'border-mint-500 bg-mint-50'
                        : 'border-gray-200 hover:border-mint-300'
                        }`}>
                        <input
                            type="radio"
                            name="preferredDonation"
                            value="CASH"
                            checked={data.preferredDonation === 'CASH'}
                            onChange={(e) => handleChange('preferredDonation', e.target.value)}
                            className="sr-only"
                        />
                        <div className="text-center">
                            <div className="text-2xl mb-2">💵</div>
                            <div className="font-medium">Cash Donations</div>
                            <div className="text-sm text-gray-600">Direct monetary support</div>
                        </div>
                    </label>

                    <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${data.preferredDonation === 'IN_KIND'
                        ? 'border-mint-500 bg-mint-50'
                        : 'border-gray-200 hover:border-mint-300'
                        }`}>
                        <input
                            type="radio"
                            name="preferredDonation"
                            value="IN_KIND"
                            checked={data.preferredDonation === 'IN_KIND'}
                            onChange={(e) => handleChange('preferredDonation', e.target.value)}
                            className="sr-only"
                        />
                        <div className="text-center">
                            <div className="text-2xl mb-2">📦</div>
                            <div className="font-medium">In-Kind Donations</div>
                            <div className="text-sm text-gray-600">Physical items and supplies</div>
                        </div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2"> This helps us tailor our communication to your preferences</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Areas of Interest
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestOptions.map((interest) => (
                        <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.interests.includes(interest)}
                                onChange={(e) => {
                                    const newInterests = e.target.checked
                                        ? [...data.interests, interest]
                                        : data.interests.filter((i: string) => i !== interest)
                                    handleChange('interests', newInterests)
                                }}
                                className="w-4 h-4 text-mint-600 border-gray-300 rounded focus:ring-mint-500"
                            />
                            <span className="text-sm text-gray-700">{interest}</span>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2"> We'll send you updates about projects in these areas</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        📸 Profile Photo
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-mint-400 transition-colors duration-200">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-sm text-gray-600">
                            {data.photo ? data.photo.name : 'Click to upload your photo'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2"> Helps personalize your donor profile</p>
            </div>
        </div>
    )
}

export function IndividualStep4({ formData }: IndividualStepsProps) {
    return (
        <div className="space-y-6">
            <div className="bg-mint-50 border border-mint-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    Review Your Information
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-gray-900">{formData.name || 'Not provided'}</p>
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
                            <label className="text-sm font-medium text-gray-600">Preferred Donation</label>
                            <p className="text-gray-900">{formData.preferredDonation === 'CASH' ? 'Cash Donations' : 'In-Kind Donations'}</p>
                        </div>
                    </div>

                    {formData.address && (
                        <div>
                            <label className="text-sm font-medium text-gray-600">Address</label>
                            <p className="text-gray-900">{formData.address}</p>
                        </div>
                    )}

                    {formData.interests && formData.interests.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-gray-600">Areas of Interest</label>
                            <p className="text-gray-900">{formData.interests.join(', ')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">🎉 What happens next?</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li>• You'll receive a welcome email with your donor ID</li>
                    <li>• Browse schools and projects that need support</li>
                    <li>• Make your first donation and see the impact</li>
                    <li>• Get regular updates on how your contributions help</li>
                </ul>
            </div>
        </div>
    )
}
