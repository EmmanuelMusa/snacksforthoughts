import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import BackToTop from '../components/BackToTop'

type TeamMember = {
    id: string
    name: string
    role: string
    bio: string
    image?: string
    linkedin?: string
}

type Milestone = {
    year: string
    title: string
    description: string
    icon: string
}

export default function AboutPage() {
    const milestones: Milestone[] = [
        {
            year: "2024",
            title: "Founded",
            description: "Snacks for Thoughts was established with a vision to transform education in Nigeria",
            icon: "🚀"
        },
        {
            year: "2024",
            title: "First 50 Schools",
            description: "Connected our first 50 schools with donors and service providers",
            icon: "🏫"
        },
        {
            year: "2024",
            title: "100+ Schools Supported",
            description: "Reached a major milestone of supporting over 100 schools across Nigeria",
            icon: "🎯"
        },
        {
            year: "2024",
            title: "Corporate Partnerships",
            description: "Established partnerships with leading Nigerian companies",
            icon: "🤝"
        },
        {
            year: "2024",
            title: "25,000+ Meals Served",
            description: "Provided nutritious meals to thousands of students",
            icon: "🍎"
        },
        {
            year: "2024",
            title: "Digital Platform Launch",
            description: "Launched our comprehensive digital platform for seamless connections",
            icon: "💻"
        }
    ]

    const teamMembers: TeamMember[] = [
        {
            id: "1",
            name: "Dr. Aisha Mohammed",
            role: "Founder & CEO",
            bio: "Education advocate with 15+ years experience in development work across West Africa. Passionate about creating sustainable solutions for educational challenges.",
            image: "/images/a_nigerian_ceo_woman_as_a_profile.jpeg",
            linkedin: "https://linkedin.com/in/aisha-mohammed"
        },
        {
            id: "2",
            name: "Emmanuel Okafor",
            role: "CTO",
            bio: "Technology leader focused on building scalable platforms that connect communities. Former software engineer at leading tech companies.",
            image: "/images/nigerian_cto.jpeg",
            linkedin: "https://linkedin.com/in/emmanuel-okafor"
        },
        {
            id: "3",
            name: "Fatima Ibrahim",
            role: "Head of Partnerships",
            bio: "Strategic partnerships expert with extensive experience in CSR and corporate engagement. Dedicated to building meaningful collaborations.",
            image: "/images/a_nigerian_head_of_partnerships.jpeg",
            linkedin: "https://linkedin.com/in/fatima-ibrahim"
        },
        {
            id: "4",
            name: "Chinedu Nwosu",
            role: "Head of Operations",
            bio: "Operations specialist ensuring smooth delivery of services to schools. Background in project management and community development.",
            image: "/images/a_nigerian_head_of_partnerships (1).jpeg",
            linkedin: "https://linkedin.com/in/chinedu-nwosu"
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-yellow-50">
            {/* Hero Section */}
            <div className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-display">
                            About Snacks For Thoughts
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            We're on a mission to transform education in Nigeria by connecting communities,
                            resources, and opportunities to create better learning environments for every child.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/30"
                        >
                            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6"></div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">Our Mission</h2>
                            <p className="text-lg md:text-xl text-gray-700 text-gray-300 leading-relaxed">
                                To bridge the gap between schools in need and resources available in our communities,
                                ensuring every child has access to quality education in a nurturing environment.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/30"
                        >
                            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6"></div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display">Our Vision</h2>
                            <p className="text-lg md:text-xl text-gray-700 text-gray-300 leading-relaxed">
                                A Nigeria where every primary school is equipped with the resources,
                                infrastructure, and support needed to provide world-class education to all children.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Story Timeline */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Journey</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            From a simple idea to a movement transforming education across Nigeria
                        </p>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
                                            <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-3"></div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                                            <p className="text-gray-600 mb-2">{milestone.description}</p>
                                            <span className="text-sm font-semibold text-amber-600">{milestone.year}</span>
                                        </div>
                                    </div>

                                    {/* Timeline Dot */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-amber-500 rounded-full shadow-lg"></div>

                                    <div className="w-1/2"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Passionate individuals dedicated to transforming education in Nigeria
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Profile Image */}
                                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-green-200 border-green-800">
                                    <img
                                        src={member.image}
                                        alt={`${member.name}, ${member.role}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                                <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>

                                {member.linkedin && (
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors duration-200"
                                    >
                                        <span className="text-sm font-medium">LinkedIn</span>
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How You Can Help */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How You Can Help</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Join us in making a difference. Every contribution, no matter how small, creates lasting impact.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Donate */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Make a Donation</h3>
                            <p className="text-gray-600 mb-6">
                                Support schools directly with financial contributions for meals, materials, and infrastructure improvements.
                            </p>
                            <Link
                                to="/donate"
                                className="btn-primary"
                            >
                                Donate Now
                            </Link>
                        </motion.div>

                        {/* Partner */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Become a Partner</h3>
                            <p className="text-gray-600 mb-6">
                                Join our network of corporate partners and make a strategic impact through CSR initiatives.
                            </p>
                            <Link
                                to="/partners"
                                className="btn-secondary"
                            >
                                Partner with Us
                            </Link>
                        </motion.div>

                        {/* Register */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Register Your School</h3>
                            <p className="text-gray-600 mb-6">
                                List your school to receive support from donors, partners, and verified service providers.
                            </p>
                            <Link
                                to="/register"
                                className="btn-accent"
                            >
                                Register School
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-12 text-white shadow-2xl"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
                        <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of individuals and organizations working together to transform education in Nigeria.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/donate"
                                className="inline-flex items-center px-8 py-4 bg-white text-amber-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Start Donating
                            </Link>
                            <Link
                                to="/schools"
                                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-amber-600 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Find Schools
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
            <BackToTop />
        </div>
    )
}


