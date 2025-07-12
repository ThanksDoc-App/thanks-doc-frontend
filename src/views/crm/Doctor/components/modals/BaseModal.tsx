import React from 'react'
import { X } from 'lucide-react'

interface BaseModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    className?: string
    zIndex?: string
}

const BaseModal = ({
    isOpen,
    onClose,
    title,
    children,
    className = '',
    zIndex = 'z-50',
}: BaseModalProps) => {
    if (!isOpen) return null

    return (
        <div
            className={`fixed inset-0 bg-[#2155A329] bg-opacity-50 flex items-center justify-center ${zIndex} p-4`}
        >
            <div
                className={`bg-white rounded-2xl shadow-xl w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] p-5 max-h-[90vh] overflow-y-auto ${className}`}
            >
                <div className="flex items-center justify-between p-4">
                    <h3 className="text-[17px] font-semibold text-[#272D37]">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" color="#0A1629" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default BaseModal
