export default function Benefits() {
    const items = [
        {
            title: 'Donate',
            desc: 'Contribute funds or supplies to targeted school projects.',
            iconBg: 'bg-sky-100 text-sky-600',
        },
        {
            title: 'Partner',
            desc: 'Collaborate as a company to sponsor school-wide initiatives.',
            iconBg: 'bg-emerald-100 text-emerald-600',
        },
        {
            title: 'Volunteer',
            desc: 'Offer your time and skills to support local schools.',
            iconBg: 'bg-amber-100 text-amber-600',
        },
    ] as const

    return (
        <section className="py-16 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-gray-900">How you can help</h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.iconBg}`}>
                                <span className="text-base font-bold">{item.title.charAt(0)}</span>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


