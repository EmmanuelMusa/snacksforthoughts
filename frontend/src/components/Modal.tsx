import { ReactNode } from 'react'

type ModalProps = {
    open: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-lg animate-scale-in">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">✕</button>
                </div>
                <div className="p-5">
                    {children}
                </div>
            </div>
            <style>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        .animate-fade-in { animation: fade-in 200ms ease-out }
        @keyframes scale-in { from { transform: scale(.98); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .animate-scale-in { animation: scale-in 200ms ease-out }
      `}</style>
        </div>
    )
}


