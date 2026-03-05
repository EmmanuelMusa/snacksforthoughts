import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDonation } from '../context/DonationContext'

interface Supplier {
    id: string
    name: string
    logo: string
    description: string
    specialties: string[]
    rating: number
    deliveryAreas: string[]
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

interface SupplierSelectionProps {
    selectedSupplier: Supplier | null
    onSupplierSelect: (supplier: Supplier) => void
    selectedWeeks: string[]
    totalCost: number
    schoolLocation: string
}


export default function SupplierSelection({
    selectedSupplier,
    onSupplierSelect,
    selectedWeeks,
    totalCost,
    schoolLocation
}: SupplierSelectionProps) {
    const { apiBaseUrl } = useDonation()
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterSpecialty, setFilterSpecialty] = useState('')

    useEffect(() => {
        // Use mock supplier data for demonstration
        const mockSuppliers: Supplier[] = [
            {
                id: 'nasco',
                name: 'Nasco Foods',
                logo: '/images/nasco-logo.png',
                description: 'Leading food and beverage company specializing in nutritious snacks for children',
                specialties: ['Biscuits', 'Cereals', 'Juices', 'Healthy Snacks'],
                rating: 4.8,
                deliveryAreas: ['Lagos', 'Ogun', 'Rivers', 'Abuja', 'Kano', 'Kaduna', 'Port Harcourt', 'Ibadan', 'Enugu', 'Uyo'],
                accountDetails: {
                    bankName: 'First Bank of Nigeria',
                    accountNumber: '1234567890',
                    accountName: 'Nasco Foods Limited'
                },
                contactInfo: {
                    phone: '+234 800 NASCO',
                    email: 'orders@nasco.com.ng'
                }
            },
            {
                id: 'chivita',
                name: 'Chivita Company',
                logo: '/images/chivita-logo.png',
                description: 'Premium juice and beverage manufacturer with focus on child nutrition',
                specialties: ['Fruit Juices', 'Healthy Drinks', 'Vitamin-Enriched Beverages'],
                rating: 4.6,
                deliveryAreas: ['Lagos', 'Ogun', 'Rivers', 'Kano', 'Abuja', 'Ibadan', 'Port Harcourt', 'Kaduna', 'Jos', 'Calabar'],
                accountDetails: {
                    bankName: 'Guaranty Trust Bank',
                    accountNumber: '0987654321',
                    accountName: 'Chivita Company Limited'
                },
                contactInfo: {
                    phone: '+234 800 CHIVITA',
                    email: 'schools@chivita.com.ng'
                }
            },
            {
                id: 'cadbury',
                name: 'Cadbury Nigeria',
                logo: '/images/cadbury-logo.png',
                description: 'Confectionery and beverage company with nutritious snack options for schools',
                specialties: ['Biscuits', 'Chocolate Drinks', 'Cereals', 'Energy Bars'],
                rating: 4.7,
                deliveryAreas: ['Lagos', 'Ogun', 'Rivers', 'Abuja', 'Kaduna', 'Kano', 'Ibadan', 'Port Harcourt', 'Enugu', 'Abeokuta'],
                accountDetails: {
                    bankName: 'Access Bank',
                    accountNumber: '1122334455',
                    accountName: 'Cadbury Nigeria Plc'
                },
                contactInfo: {
                    phone: '+234 800 CADBURY',
                    email: 'csr@cadbury.com.ng'
                }
            },
            {
                id: 'frieslandcampina',
                name: 'FrieslandCampina WAMCO',
                logo: '/images/friesland-logo.png',
                description: 'Dairy products and beverages for school nutrition programs',
                specialties: ['Milk', 'Yogurt', 'Dairy Products', 'Beverages'],
                rating: 4.5,
                deliveryAreas: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Kaduna', 'Jos', 'Enugu', 'Abeokuta', 'Calabar'],
                accountDetails: {
                    bankName: 'Union Bank',
                    accountNumber: '3344556677',
                    accountName: 'FrieslandCampina WAMCO'
                },
                contactInfo: {
                    phone: '+234 800 FRIESLAND',
                    email: 'schools@frieslandcampina.com'
                }
            },
            {
                id: 'nestle',
                name: 'Nestlé Nigeria',
                logo: '/images/nestle-logo.png',
                description: 'Global nutrition company providing healthy breakfast options for schools',
                specialties: ['Cereals', 'Milk', 'Beverages', 'Healthy Snacks'],
                rating: 4.9,
                deliveryAreas: ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Port Harcourt', 'Ibadan', 'Enugu', 'Uyo', 'Jos', 'Calabar'],
                accountDetails: {
                    bankName: 'Zenith Bank',
                    accountNumber: '4455667788',
                    accountName: 'Nestlé Nigeria Plc'
                },
                contactInfo: {
                    phone: '+234 800 NESTLE',
                    email: 'schools@ng.nestle.com'
                }
            },
            {
                id: 'dangote-sugar',
                name: 'Dangote Sugar',
                logo: '/images/dangote-sugar-logo.png',
                description: 'Sugar and sweetener products for school breakfast programs',
                specialties: ['Sugar', 'Sweeteners', 'Natural Sweeteners', 'Honey Products'],
                rating: 4.4,
                deliveryAreas: ['Lagos', 'Kano', 'Abuja', 'Ibadan', 'Kaduna', 'Port Harcourt', 'Jos', 'Enugu', 'Calabar', 'Uyo'],
                accountDetails: {
                    bankName: 'UBA',
                    accountNumber: '5566778899',
                    accountName: 'Dangote Sugar Refinery'
                },
                contactInfo: {
                    phone: '+234 800 DANGOTE',
                    email: 'schools@dangote.com'
                }
            },
            {
                id: 'local-supplier',
                name: 'NutriKids Supplies',
                logo: '/images/nutrikids-logo.png',
                description: 'Local supplier specializing in fresh, nutritious snacks for school children',
                specialties: ['Fresh Fruits', 'Local Snacks', 'Traditional Foods', 'Custom Meals'],
                rating: 4.5,
                deliveryAreas: ['Lagos', 'Ogun'],
                accountDetails: {
                    bankName: 'Zenith Bank',
                    accountNumber: '6677889900',
                    accountName: 'NutriKids Supplies Limited'
                },
                contactInfo: {
                    phone: '+234 803 123 4567',
                    email: 'info@nutrikids.ng'
                }
            }
        ]

        setSuppliers(mockSuppliers)
        setLoading(false)
    }, [])

    // Get school state from location (format: "LGA, STATE")
    const schoolState = schoolLocation.includes(',') ? schoolLocation.split(',')[1]?.trim() : schoolLocation

    // Filter suppliers that can deliver to the school's state
    // Try to match by state first, but if no matches found, show all suppliers as fallback
    let availableSuppliers = suppliers.filter(supplier => {
        const deliversToState = supplier.deliveryAreas.some(area =>
            area.toLowerCase().includes(schoolState?.toLowerCase() || '') ||
            schoolState?.toLowerCase().includes(area.toLowerCase())
        )
        return deliversToState
    })

    // If no suppliers matched by location, show all suppliers as fallback
    if (availableSuppliers.length === 0 && suppliers.length > 0) {
        availableSuppliers = suppliers.slice(0, 4) // Show top 4 suppliers as fallback
    }

    const filteredSuppliers = availableSuppliers.filter(supplier => {
        const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSpecialty = !filterSpecialty || supplier.specialties.includes(filterSpecialty)
        return matchesSearch && matchesSpecialty
    })

    const allSpecialties = [...new Set(availableSuppliers.flatMap(s => s.specialties))]

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Supplier</h3>
                    <p className="text-gray-600">Loading suppliers...</p>
                </div>
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Supplier</h3>
                <p className="text-gray-600">
                    Select a registered partner to supply snacks for your selected weeks
                </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="sm:w-48">
                    <select
                        value={filterSpecialty}
                        onChange={(e) => setFilterSpecialty(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Specialties</option>
                        {allSpecialties.map(specialty => (
                            <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {filteredSuppliers.map((supplier, index) => (
                        <motion.div
                            key={supplier.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 ${selectedSupplier?.id === supplier.id
                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                }`}
                            onClick={() => onSupplierSelect(supplier)}
                        >
                            {selectedSupplier?.id === supplier.id && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                            )}

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                        {supplier.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(supplier.rating)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                >
                                                    ★
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {supplier.rating} ({Math.floor(Math.random() * 100) + 50} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">
                                {supplier.description}
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Specialties:</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {supplier.specialties.map(specialty => (
                                            <span
                                                key={specialty}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h5 className="font-medium text-gray-900 mb-1">Delivery Areas:</h5>
                                    <p className="text-sm text-gray-600">
                                        {supplier.deliveryAreas.join(', ')}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Contact: {supplier.contactInfo.phone}
                                    </div>
                                    <div className="text-lg font-semibold text-blue-600">
                                        ₦{totalCost.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredSuppliers.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No suppliers found</h4>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
    )
}
