import { useEffect, useState } from 'react'
import { useDonation } from '../context/DonationContext'

type Vendor = { id: string; name: string; category?: string; contact?: string; verified: boolean }

export default function AdminVendorsPage() {
    const { apiBaseUrl } = useDonation()
    const [pending, setPending] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(false)

    async function load() {
        const res = await fetch(`${apiBaseUrl}/api/vendors/pending`)
        const data = await res.json()
        setPending(data || [])
    }

    useEffect(() => { load() }, [apiBaseUrl])

    async function verify(id: string) {
        setLoading(true)
        await fetch(`${apiBaseUrl}/api/vendors/${id}/verify`, { method: 'PATCH' })
        await load()
        setLoading(false)
    }

    return (
        <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Vendor Applications</h1>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pending.map(v => (
                        <div key={v.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">{v.name}</h3>
                            <p className="mt-2 text-sm text-gray-600">{v.category}</p>
                            {v.contact && <p className="mt-1 text-xs text-gray-600">Contact: {v.contact}</p>}
                            <div className="mt-4 flex gap-2">
                                <button disabled={loading} onClick={() => verify(v.id)} className="inline-flex items-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-60">Approve</button>
                                <button disabled className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700">Reject</button>
                            </div>
                        </div>
                    ))}
                    {pending.length === 0 && (
                        <p className="text-sm text-gray-600">No pending vendor applications.</p>
                    )}
                </div>
            </div>
        </section>
    )
}


