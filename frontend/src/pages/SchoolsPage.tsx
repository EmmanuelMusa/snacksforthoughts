import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDonation } from '../context/DonationContext'
import { SchoolCardSkeleton } from '../components/SkeletonLoader'
import BackToTop from '../components/BackToTop'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'

type School = {
  id: string
  name: string
  state?: string | null
  lga?: string | null
  ward?: string | null
  needs?: string[] | null
  image?: string | null
  targetAmount: number
  raisedAmount: number
}

type ApiList<T> = { success?: boolean; data?: T }

export default function SchoolsPage() {
  const { apiBaseUrl } = useDonation()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedLga, setSelectedLga] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  const [states, setStates] = useState<string[]>([])
  const [lgas, setLgas] = useState<string[]>([])
  const [wards, setWards] = useState<string[]>([])

  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const [schools, setSchools] = useState<School[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 21

  const fallbackImages = [
    '/images/a_school_in_nigeria.jpeg',
    '/images/a_school_in_nigeria (1).jpeg',
    '/images/a_school_in_nigeria (2).jpeg',
    '/images/a_school_in_nigeria (3).jpeg',
  ]

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const res = await fetch(`${apiBaseUrl}/api/schools/states`)
          const json: ApiList<string[]> = await res.json()
          const list = (json as any).data ?? json
          const filteredList = (list || []).filter((s: string) => s && s.toUpperCase() !== 'UNKNOWN' && s.toUpperCase() !== 'NULL')
          if (!cancelled) setStates(filteredList)
        } catch {
          if (!cancelled) setStates([])
        }
      })()
    return () => {
      cancelled = true
    }
  }, [apiBaseUrl])

  useEffect(() => {
    setSelectedLga('')
    setSelectedWard('')
    setLgas([])
    setWards([])
    if (!selectedState) return

    let cancelled = false
      ; (async () => {
        const res = await fetch(
          `${apiBaseUrl}/api/schools/lgas?state=${encodeURIComponent(selectedState)}`,
        )
        const json: ApiList<string[]> = await res.json()
        const list = (json as any).data ?? json
        if (!cancelled) setLgas(list || [])
      })()

    return () => {
      cancelled = true
    }
  }, [apiBaseUrl, selectedState])

  useEffect(() => {
    setSelectedWard('')
    setWards([])
    if (!selectedState || !selectedLga) return

    let cancelled = false
      ; (async () => {
        const res = await fetch(
          `${apiBaseUrl}/api/schools/wards?state=${encodeURIComponent(selectedState)}&lga=${encodeURIComponent(selectedLga)}`,
        )
        const json: ApiList<string[]> = await res.json()
        const list = (json as any).data ?? json
        if (!cancelled) setWards(list || [])
      })()

    return () => {
      cancelled = true
    }
  }, [apiBaseUrl, selectedState, selectedLga])

  const runSearch = useCallback(async (nextPage: number, searchArg: string = debouncedSearchTerm, stateArg: string = selectedState, lgaArg: string = selectedLga, wardArg: string = selectedWard) => {
    setIsSearching(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()
      params.set('page', String(nextPage))
      params.set('limit', String(limit))
      if (searchArg.trim()) params.set('search', searchArg.trim())
      if (stateArg) params.set('state', stateArg)
      if (lgaArg) params.set('lga', lgaArg)
      if (wardArg) params.set('ward', wardArg)

      const res = await fetch(`${apiBaseUrl}/api/schools/search?${params.toString()}`)
      const json = await res.json()
      const payload = (json as any).data ?? json

      setSchools(payload.schools || [])
      setPage(payload.pagination?.page || nextPage)
      setPages(payload.pagination?.pages || 1)
      setTotal(payload.pagination?.total || 0)
    } catch {
      setSchools([])
      setPage(nextPage)
      setPages(1)
      setTotal(0)
    } finally {
      setIsSearching(false)
    }
  }, [apiBaseUrl, limit, debouncedSearchTerm, selectedState, selectedLga, selectedWard])

  // Initial fetch and dependency trigger
  useEffect(() => {
    runSearch(1)
  }, [runSearch, debouncedSearchTerm, selectedState, selectedLga, selectedWard])

  const emptyText = useMemo(() => {
    if (!hasSearched) return ''
    if (selectedState || selectedLga || selectedWard || debouncedSearchTerm) return 'No schools found for this search.'
    return 'No schools found.'
  }, [hasSearched, selectedState, selectedLga, selectedWard, debouncedSearchTerm])

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black text-gray-900 mb-6 font-display leading-tight"
            >
              National School <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 text-6xl">Registry</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-gray-100 min-w-[160px]">
                <div className="text-3xl font-black text-green-600">66,681</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Digitalized Schools</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-gray-100 min-w-[160px]">
                <div className="text-3xl font-black text-blue-600">36+FCT</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">States Coverage</div>
              </div>
              <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-gray-100 min-w-[160px]">
                <div className="text-3xl font-black text-purple-600">100%</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transparency</div>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Explore our comprehensive database of digitalized primary schools across Nigeria. Select a state and LGA to monitor feeding performance and impact locally.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 sm:p-8 mb-12 relative overflow-hidden"
          >
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-green-100 blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-2 relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="School name, state, etc..."
                    className="w-full pl-11 pr-4 py-3.5 border-none rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 border-none rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 shadow-sm transition-all text-gray-900 appearance-none"
                  >
                    <option value="">All States</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">LGA</label>
                <div className="relative">
                  <select
                    value={selectedLga}
                    onChange={(e) => setSelectedLga(e.target.value)}
                    disabled={!selectedState}
                    className="w-full px-4 py-3.5 border-none rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 shadow-sm transition-all text-gray-900 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">All LGAs</option>
                    {lgas.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ward</label>
                <div className="relative">
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedState || !selectedLga}
                    className="w-full px-4 py-3.5 border-none rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500 shadow-sm transition-all text-gray-900 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">All Wards</option>
                    {wards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-500">
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : hasSearched ? (
                    <span className="text-gray-700 font-semibold bg-gray-100 px-3 py-1 rounded-full">
                      {total.toLocaleString()} {total === 1 ? 'school' : 'schools'} found
                    </span>
                  ) : null}
                </div>
                {(searchTerm || selectedState || selectedLga || selectedWard) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedState('')
                      setSelectedLga('')
                      setSelectedWard('')
                    }}
                    className="text-sm text-gray-500 hover:text-red-600 transition-colors underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                Results update automatically as you type or change filters
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isSearching ? (
              <SchoolCardSkeleton count={6} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {schools.map((school, index) => {
                  const progress = school.targetAmount ? (school.raisedAmount || 0) / school.targetAmount : 0
                  const progressPercentage = Math.min(100, Math.round(progress * 100))
                  const imageUrl = school.image || fallbackImages[index % fallbackImages.length]
                  return (
                    <motion.div
                      key={school.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="card overflow-hidden"
                    >
                      <div
                        className="h-48 bg-cover bg-center relative"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                        {school.state && (
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                            {school.state}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {[school.lga, school.ward].filter(Boolean).join(', ')}
                        </p>
                        {school.needs && school.needs.length > 0 && (
                          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                            {school.needs.slice(0, 2).join(', ')}
                          </p>
                        )}

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[--color-primary] to-[--color-success] h-2 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>₦{(school.raisedAmount || 0).toLocaleString()}</span>
                            <span>₦{school.targetAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            to={`/donate?schoolId=${school.id}`}
                            className="flex-1 btn-primary py-2 px-4 text-center"
                          >
                            Support
                          </Link>
                          <Link
                            to={`/schools/${school.id}`}
                            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-2xl text-center transition-all duration-300"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {!isSearching && hasSearched && schools.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{emptyText}</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedState('')
                  setSelectedLga('')
                  setSelectedWard('')
                  setHasSearched(false)
                  setSchools([])
                  setTotal(0)
                  setPage(1)
                  setPages(1)
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {!isSearching && hasSearched && pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1 || isSearching}
                onClick={() => runSearch(page - 1)}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {pages}
              </span>
              <button
                disabled={page >= pages || isSearching}
                onClick={() => runSearch(page + 1)}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <BackToTop />
    </section>
  )
}

