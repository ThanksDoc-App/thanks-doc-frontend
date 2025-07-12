import React from 'react'
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react'
import { Button } from '@/components/ui'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    onCancel: () => void
    action: 'accept' | 'decline' | null
    documentName?: string
    loading: boolean
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    action,
    documentName,
    loading,
}: ConfirmationModalProps) => {
    if (!isOpen || !action) return null

    return (
        <div className="fixed inset-0 bg-[#2155A329] bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#272D37] flex items-center gap-2">
                        {action === 'accept' ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Confirm Acceptance
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-red-600" />
                                Confirm Decline
                            </>
                        )}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close confirmation modal"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-[#272D37] font-medium mb-2">
                                {action === 'accept'
                                    ? 'Are you sure you want to accept this document?'
                                    : 'Are you sure you want to decline this document?'}
                            </p>
                            <p className="text-[#7C8493] text-sm">
                                Document:{' '}
                                <span className="font-medium">
                                    {documentName}
                                </span>
                            </p>
                            <p className="text-[#7C8493] text-sm mt-1">
                                {action === 'accept'
                                    ? 'This action will mark the document as approved and notify the doctor.'
                                    : 'This action will mark the document as rejected and notify the doctor.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 h-11 bg-gray-100 text-gray-700 rounded-md font-medium transition-colors hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 h-11 text-white rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                {action === 'accept' ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Yes, Accept
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Yes, Decline
                                    </>
                                )}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
