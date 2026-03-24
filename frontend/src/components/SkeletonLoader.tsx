import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
    type?: 'card' | 'text' | 'circle' | 'rect'
    className?: string
    count?: number
}

export default function SkeletonLoader({ type = 'card', className = '', count = 1 }: SkeletonLoaderProps) {
    const baseClasses = "animate-pulse bg-gray-200 rounded"

    const getSkeletonClasses = () => {
        switch (type) {
            case 'card':
                return `${baseClasses} h-64 w-full`
            case 'text':
                return `${baseClasses} h-4 w-full`
            case 'circle':
                return `${baseClasses} h-12 w-12 rounded-full`
            case 'rect':
                return `${baseClasses} h-20 w-full`
            default:
                return baseClasses
        }
    }

    if (count > 1) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: count }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${getSkeletonClasses()} ${className}`}
                    />
                ))}
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${getSkeletonClasses()} ${className}`}
        />
    )
}

// Specific skeleton components for different use cases
export function SchoolCardSkeleton({ count = 1 }: { count?: number }) {
    if (count > 1) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: count }).map((_, index) => (
                    <SchoolCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <SkeletonLoader type="rect" className="h-48" />
            <div className="p-6 space-y-4">
                <SkeletonLoader type="text" className="h-6 w-3/4" />
                <SkeletonLoader type="text" className="h-4 w-1/2" />
                <SkeletonLoader type="text" className="h-4 w-full" />
                <SkeletonLoader type="text" className="h-4 w-2/3" />
                <div className="flex gap-3 mt-6">
                    <SkeletonLoader type="rect" className="h-10 flex-1" />
                    <SkeletonLoader type="rect" className="h-10 flex-1" />
                </div>
            </div>
        </div>
    )
}

export function VendorCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                    <SkeletonLoader type="circle" className="h-16 w-16" />
                    <div className="flex-1 space-y-2">
                        <SkeletonLoader type="text" className="h-5 w-3/4" />
                        <SkeletonLoader type="text" className="h-4 w-1/2" />
                    </div>
                </div>
                <SkeletonLoader type="text" className="h-4 w-full" />
                <SkeletonLoader type="text" className="h-4 w-2/3" />
                <div className="flex gap-2">
                    <SkeletonLoader type="rect" className="h-6 w-20" />
                    <SkeletonLoader type="rect" className="h-6 w-16" />
                </div>
                <SkeletonLoader type="rect" className="h-10 w-full" />
            </div>
        </div>
    )
}

export function PartnerCardSkeleton() {
    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center gap-4 mb-6">
                <SkeletonLoader type="circle" className="h-16 w-16" />
                <div className="flex-1 space-y-2">
                    <SkeletonLoader type="text" className="h-5 w-3/4" />
                    <SkeletonLoader type="text" className="h-4 w-1/2" />
                </div>
            </div>
            <div className="space-y-3 mb-6">
                <SkeletonLoader type="text" className="h-4 w-1/3" />
                <div className="flex gap-2">
                    <SkeletonLoader type="rect" className="h-6 w-20" />
                    <SkeletonLoader type="rect" className="h-6 w-24" />
                    <SkeletonLoader type="rect" className="h-6 w-18" />
                </div>
            </div>
            <SkeletonLoader type="text" className="h-4 w-full mb-2" />
            <SkeletonLoader type="text" className="h-4 w-3/4 mb-6" />
            <div className="flex gap-3">
                <SkeletonLoader type="rect" className="h-10 flex-1" />
                <SkeletonLoader type="rect" className="h-10 flex-1" />
            </div>
        </div>
    )
}
