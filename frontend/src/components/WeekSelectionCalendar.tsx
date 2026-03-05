import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WeekSelectionCalendarProps {
    selectedWeeks: string[]
    onWeeksChange: (weeks: string[]) => void
    schoolId: string
    studentCount: number
}

// Mock data for unavailable weeks (in a real app, this would come from an API)
const getUnavailableWeeks = (schoolId: string): string[] => {
    // Simulate some weeks being already taken by other donors
    // Using more realistic dates that will match the generated week IDs
    const unavailableWeeks: Record<string, string[]> = {
        's1': ['First Term-2024-09-02', 'First Term-2024-09-09', 'Second Term-2025-01-13'], // Sunrise Primary
        's2': ['First Term-2024-09-16', 'First Term-2024-11-11'], // Unity Primary
        's3': ['First Term-2024-09-23', 'Second Term-2025-01-20'], // Greenfield School
        's4': ['First Term-2024-10-07', 'First Term-2024-11-18'], // Harmony Primary
        's5': ['First Term-2024-09-30', 'Second Term-2025-01-27', 'Second Term-2025-02-03'], // Bright Future Academy
        's6': ['First Term-2024-10-14', 'Second Term-2025-01-06'] // Riverside Elementary
    }
    return unavailableWeeks[schoolId] || []
}

// Helper function to determine if a week should be unavailable
const isWeekUnavailable = (schoolId: string, termName: string, weekNumber: number): boolean => {
    const unavailableWeekMap: Record<string, Record<string, number[]>> = {
        's1': { 'First Term': [2, 3], 'Second Term': [2], 'Third Term': [] }, // Sunrise Primary
        's2': { 'First Term': [3, 6], 'Second Term': [1], 'Third Term': [] }, // Unity Primary
        's3': { 'First Term': [4], 'Second Term': [3], 'Third Term': [] }, // Greenfield School
        's4': { 'First Term': [2, 7], 'Second Term': [1], 'Third Term': [] }, // Harmony Primary
        's5': { 'First Term': [5], 'Second Term': [3, 7], 'Third Term': [] }, // Bright Future Academy
        's6': { 'First Term': [6], 'Second Term': [2], 'Third Term': [] } // Riverside Elementary
    }

    const schoolWeeks = unavailableWeekMap[schoolId] || {}
    const termWeeks = schoolWeeks[termName] || []
    return termWeeks.includes(weekNumber)
}

export default function WeekSelectionCalendar({
    selectedWeeks,
    onWeeksChange,
    schoolId,
    studentCount
}: WeekSelectionCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Generate school term weeks (assuming 3 terms per year)
    const schoolTerms = useMemo(() => {
        const currentYear = new Date().getFullYear()

        const terms = [
            {
                name: 'First Term',
                startDate: new Date(currentYear, 8, 1), // September
                endDate: new Date(currentYear, 11, 15), // December
                weeks: []
            },
            {
                name: 'Second Term',
                startDate: new Date(currentYear + 1, 0, 8), // January
                endDate: new Date(currentYear + 1, 3, 15), // April
                weeks: []
            },
            {
                name: 'Third Term',
                startDate: new Date(currentYear + 1, 4, 1), // May
                endDate: new Date(currentYear + 1, 6, 15), // July
                weeks: []
            }
        ]

        // Generate weeks for each term
        terms.forEach(term => {
            const weeks = []
            let currentWeek = new Date(term.startDate)
            let weekNumber = 1

            while (currentWeek <= term.endDate) {
                const weekEnd = new Date(currentWeek)
                weekEnd.setDate(currentWeek.getDate() + 6)

                if (weekEnd > term.endDate) {
                    weekEnd.setTime(term.endDate.getTime())
                }

                const weekId = `${term.name}-${currentWeek.toISOString().split('T')[0]}`

                // Check if this week should be unavailable based on school and week number
                const isUnavailable = isWeekUnavailable(schoolId, term.name, weekNumber)

                // Debug logging
                if (isUnavailable) {
                    console.log(`Unavailable week detected: ${schoolId} - ${term.name} - Week ${weekNumber}`)
                }

                weeks.push({
                    id: weekId,
                    label: `Week ${weekNumber}`,
                    startDate: new Date(currentWeek),
                    endDate: new Date(weekEnd),
                    term: term.name,
                    isAvailable: !isUnavailable,
                    isUnavailable: isUnavailable
                })

                currentWeek.setDate(currentWeek.getDate() + 7)
                weekNumber++
            }

            term.weeks = weeks
        })

        return terms
    }, [schoolId])

    const handleWeekToggle = (weekId: string) => {
        console.log(`Week clicked: ${weekId}`)
        if (selectedWeeks.includes(weekId)) {
            onWeeksChange(selectedWeeks.filter(id => id !== weekId))
        } else {
            onWeeksChange([...selectedWeeks, weekId])
        }
    }

    const totalCost = useMemo(() => {
        // Assuming ₦50 per student per week for snacks
        const costPerStudentPerWeek = 50
        return selectedWeeks.length * studentCount * costPerStudentPerWeek
    }, [selectedWeeks.length, studentCount])

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Weeks to Support</h3>
                <p className="text-gray-600 mb-2">
                    Choose which weeks you'd like to provide snacks for {studentCount} students
                </p>
                <p className="text-sm text-blue-600 font-medium mb-4">
                    💡 You can select multiple weeks - choose all the weeks you want before continuing
                </p>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-200 bg-white rounded"></div>
                        <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 bg-blue-50 rounded flex items-center justify-center">
                            <span className="text-blue-500 text-xs">✓</span>
                        </div>
                        <span className="text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-200 bg-gray-100 rounded flex items-center justify-center opacity-60">
                            <span className="text-gray-400 text-xs">✕</span>
                        </div>
                        <span className="text-gray-600">Already taken</span>
                    </div>
                </div>
            </div>

            {schoolTerms.map((term, termIndex) => (
                <motion.div
                    key={term.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: termIndex * 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                >
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                        {term.name}
                        <span className="text-sm text-gray-500 font-normal">
                            ({term.startDate.toLocaleDateString()} - {term.endDate.toLocaleDateString()})
                        </span>
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {term.weeks.map((week, weekIndex) => {
                            const isSelected = selectedWeeks.includes(week.id)
                            const isUnavailable = week.isUnavailable

                            return (
                                <motion.button
                                    key={week.id}
                                    onClick={() => !isUnavailable && handleWeekToggle(week.id)}
                                    disabled={isUnavailable}
                                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left relative ${isSelected
                                        ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                                        : isUnavailable
                                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:shadow-sm'
                                        }`}
                                    whileHover={!isUnavailable ? { scale: 1.02 } : {}}
                                    whileTap={!isUnavailable ? { scale: 0.98 } : {}}
                                >
                                    {/* Selection indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    )}

                                    {/* Unavailable indicator */}
                                    {isUnavailable && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✕</span>
                                        </div>
                                    )}

                                    <div className="font-medium text-sm pr-6">{week.label}</div>
                                    <div className={`text-xs mt-1 ${isUnavailable ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {week.startDate.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })} - {week.endDate.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>

                                    {isSelected && (
                                        <div className="mt-2 text-xs font-medium text-blue-600">
                                            ₦{(studentCount * 50).toLocaleString()}
                                        </div>
                                    )}

                                    {isUnavailable && (
                                        <div className="mt-2 text-xs text-gray-400 italic">
                                            Already taken
                                        </div>
                                    )}
                                </motion.button>
                            )
                        })}
                    </div>
                </motion.div>
            ))}

            {selectedWeeks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-900">Selected Weeks Summary</h4>
                                <p className="text-sm text-gray-600">
                                    {selectedWeeks.length} week{selectedWeeks.length !== 1 ? 's' : ''} selected
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    ₦{totalCost.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total cost for {studentCount} students
                                </div>
                            </div>
                        </div>

                        {/* Selected weeks breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedWeeks.map(weekId => {
                                // Find the week details
                                let weekDetails = null
                                for (const term of schoolTerms) {
                                    const week = term.weeks.find(w => w.id === weekId)
                                    if (week) {
                                        weekDetails = week
                                        break
                                    }
                                }

                                if (!weekDetails) return null

                                return (
                                    <div key={weekId} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {weekDetails.term} - {weekDetails.label}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {weekDetails.startDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })} - {weekDetails.endDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-blue-600">
                                            ₦{(studentCount * 50).toLocaleString()}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
