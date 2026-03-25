import Hero from '../sections/Hero'
import ImpactMetrics from '../sections/ImpactMetrics'
import DonationFlow from '../sections/DonationFlow'
import PresidentialSection from '../sections/PresidentialSection'
import HowItWorks from '../sections/HowItWorks'

export default function HomePage() {
    return (
        <>
            <Hero />
            <HowItWorks />
            <DonationFlow />
            <PresidentialSection />
        </>
    )
}


