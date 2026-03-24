import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="text-xl font-black text-white font-display tracking-tight">
                            PBAT FEEDS - Snacks For Thought
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            A Pilot Breakfast Initiative
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        Made with Love for Nigeria's Future - The Children
                    </div>

                    <div className="text-sm font-bold text-gray-400">
                        © {new Date().getFullYear()} PBAT Feeds Platform. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}
