import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface StickyDonateButtonProps {
    schoolId?: string
    className?: string
}

export default function StickyDonateButton({ schoolId, className = '' }: StickyDonateButtonProps) {
    const donateUrl = schoolId ? `/donate?schoolId=${schoolId}` : '/donate'

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 ${className}`}
        >
            <Link
                to={donateUrl}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
                <span className="text-lg">💝</span>
                <span>Support This School</span>
            </Link>
        </motion.div>
    )
}
