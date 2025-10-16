import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

type DonorSession = {
    donorName: string
}

type DonationRecord = {
    id: string
    donorName: string
    amount: number
    schoolId: string
    date: string
}

type DonationContextValue = {
    session: DonorSession | null
    setSession: (s: DonorSession | null) => void
    donations: DonationRecord[]
    addDonation: (d: DonationRecord) => void
    apiBaseUrl: string
}

const DonationContext = createContext<DonationContextValue | undefined>(undefined)

export function DonationProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<DonorSession | null>(null)
    const [donations, setDonations] = useState<DonationRecord[]>([])

    const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000'

    const value = useMemo<DonationContextValue>(() => ({
        session,
        setSession,
        donations,
        addDonation: (d) => setDonations((prev) => [d, ...prev]),
        apiBaseUrl,
    }), [session, donations, apiBaseUrl])

    return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>
}

export function useDonation() {
    const ctx = useContext(DonationContext)
    if (!ctx) throw new Error('useDonation must be used within DonationProvider')
    return ctx
}


