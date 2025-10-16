import { useState } from 'react'

interface SchoolStepsProps {
    formData: any
    updateFormData: (data: any) => void
}

export function SchoolStep1({ formData, updateFormData }: SchoolStepsProps) {
    const [data, setData] = useState({
        name: formData.name || '',
        state: formData.state || '',
        lga: formData.lga || '',
        ward: formData.ward || '',
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
                        School Name
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    placeholder="Enter your school name"
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> This will be displayed on your school profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            State
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                        </span>
                    </label>
                    <select
                        value={data.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                        required
                    >
                        <option value="">Select state</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Kano">Kano</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            LGA
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                        </span>
                    </label>
                    <input
                        type="text"
                        value={data.lga}
                        onChange={(e) => handleChange('lga', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                        placeholder="Local Government Area"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            Ward
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                        </span>
                    </label>
                    <input
                        type="text"
                        value={data.ward}
                        onChange={(e) => handleChange('ward', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                        placeholder="Ward name"
                        required
                    />
                </div>
            </div>
        </div>
    )
}

export function SchoolStep2({ formData, updateFormData }: SchoolStepsProps) {
    const [data, setData] = useState({
        contactPerson: formData.contactPerson || '',
        email: formData.email || '',
        phone: formData.phone || '',
        location: formData.location || '',
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
                        Contact Person
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <input
                    type="text"
                    value={data.contactPerson}
                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    placeholder="Principal, Head Teacher, or designated contact"
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> The main person we'll communicate with about your school</p>
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
                        placeholder="school@example.com"
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        School Location
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <textarea
                    value={data.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    rows={3}
                    placeholder="Full address of the school"
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> Helps donors and vendors find your school</p>
            </div>
        </div>
    )
}

export function SchoolStep3({ formData, updateFormData }: SchoolStepsProps) {
    const [data, setData] = useState({
        description: formData.description || '',
        needs: formData.needs || [],
        studentCount: formData.studentCount || '',
        image: formData.image || null,
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
            handleChange('image', file)
        }
    }

    const needOptions = [
        'Classroom Renovation',
        'Desks and Chairs',
        'Books and Learning Materials',
        'School Meals',
        'Clean Water',
        'Toilet Facilities',
        'Playground Equipment',
        'Computer Lab',
        'Library Setup',
        'Security Fencing',
        'Electricity Connection',
        'Other'
    ]

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        School Description
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                    rows={4}
                    placeholder="Tell us about your school, its history, and the community it serves..."
                    required
                />
                <p className="text-xs text-gray-500 mt-1"> Help donors understand your school's story and impact</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        Areas of Need
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Required</span>
                    </span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {needOptions.map((need) => (
                        <label key={need} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.needs.includes(need)}
                                onChange={(e) => {
                                    const newNeeds = e.target.checked
                                        ? [...data.needs, need]
                                        : data.needs.filter((n: string) => n !== need)
                                    handleChange('needs', newNeeds)
                                }}
                                className="w-4 h-4 text-mint-600 border-gray-300 rounded focus:ring-mint-500"
                            />
                            <span className="text-sm text-gray-700">{need}</span>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2"> Select all areas where your school needs support</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        👥 Number of Students
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <select
                    value={data.studentCount}
                    onChange={(e) => handleChange('studentCount', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors duration-200"
                >
                    <option value="">Select student count</option>
                    <option value="1-50">1-50 students</option>
                    <option value="51-100">51-100 students</option>
                    <option value="101-200">101-200 students</option>
                    <option value="201-500">201-500 students</option>
                    <option value="500+">500+ students</option>
                </select>
                <p className="text-xs text-gray-500 mt-1"> Helps donors understand the scale of impact</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                        📸 School Image
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                    </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-mint-400 transition-colors duration-200">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="school-image-upload"
                    />
                    <label htmlFor="school-image-upload" className="cursor-pointer">
                        <div className="text-4xl mb-2"></div>
                        <div className="text-sm text-gray-600">
                            {data.image ? data.image.name : 'Click to upload a school image'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2"> A photo of your school helps donors connect with your story</p>
            </div>
        </div>
    )
}

export function SchoolStep4({ formData }: SchoolStepsProps) {
    return (
        <div className="space-y-6">
            <div className="bg-mint-50 border border-mint-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    Review Your School Information
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">School Name</label>
                            <p className="text-gray-900">{formData.name || 'Not provided'}</p>
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
                            <label className="text-sm font-medium text-gray-600">State</label>
                            <p className="text-gray-900">{formData.state || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">LGA</label>
                            <p className="text-gray-900">{formData.lga || 'Not provided'}</p>
                        </div>
                    </div>

                    {formData.description && (
                        <div>
                            <label className="text-sm font-medium text-gray-600">School Description</label>
                            <p className="text-gray-900">{formData.description}</p>
                        </div>
                    )}

                    {formData.needs && formData.needs.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-gray-600">Areas of Need</label>
                            <p className="text-gray-900">{formData.needs.join(', ')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">🎉 What happens next?</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Your school profile will be reviewed and approved</li>
                    <li>• You'll receive a welcome email with your school ID</li>
                    <li>• Your school will be visible to donors and supporters</li>
                    <li>• Donors can start supporting your specific needs</li>
                    <li>• You'll receive regular updates on donations and impact</li>
                </ul>
            </div>
        </div>
    )
}
