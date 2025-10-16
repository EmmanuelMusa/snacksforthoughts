import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface ScrollAnimationProps {
    children: React.ReactNode
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
    delay?: number
    duration?: number
    className?: string
}

export default function ScrollAnimation({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className = ''
}: ScrollAnimationProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { opacity: 0, y: 50 }
            case 'down':
                return { opacity: 0, y: -50 }
            case 'left':
                return { opacity: 0, x: 50 }
            case 'right':
                return { opacity: 0, x: -50 }
            case 'fade':
                return { opacity: 0 }
            default:
                return { opacity: 0, y: 50 }
        }
    }

    const getAnimatePosition = () => {
        switch (direction) {
            case 'up':
                return { opacity: 1, y: 0 }
            case 'down':
                return { opacity: 1, y: 0 }
            case 'left':
                return { opacity: 1, x: 0 }
            case 'right':
                return { opacity: 1, x: 0 }
            case 'fade':
                return { opacity: 1 }
            default:
                return { opacity: 1, y: 0 }
        }
    }

    return (
        <motion.div
            ref={ref}
            initial={getInitialPosition()}
            animate={isInView ? getAnimatePosition() : getInitialPosition()}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
