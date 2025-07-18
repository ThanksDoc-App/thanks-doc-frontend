import React, { useState, useEffect } from 'react'
import {
    ExternalLink,
    Download,
    FileText,
    Eye,
    AlertCircle,
} from 'lucide-react'
import { IoIosArrowForward } from 'react-icons/io'
import { CiMail } from 'react-icons/ci'
import { BsPhone } from 'react-icons/bs'
import { Button } from '@/components/ui'
import BaseModal from './BaseModal'

interface DocumentItem {
    id: number
    name: string
    type: string
    fileUrl?: string
    status?: 'approved' | 'rejected' | 'pending' | 'under_review'
    documentId?: string
    referenceData?: {
        fullName: string
        email: string
        position?: string
        organization?: string
        phone?: string
    }
}

interface DocumentViewModalProps {
    isOpen: boolean
    onClose: () => void
    document: DocumentItem | null
    onAccept: () => void
    onDecline: () => void
    approvalLoading: boolean
    declineLoading: boolean
}

const DocumentViewModal = ({
    isOpen,
    onClose,
    document,
    onAccept,
    onDecline,
    approvalLoading,
    declineLoading,
}: DocumentViewModalProps) => {
    const [pdfViewerMode, setPdfViewerMode] = useState<
        'iframe' | 'embed' | 'google' | 'download'
    >('iframe')
    const [pdfError, setPdfError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Reset error state when document changes
    useEffect(() => {
        setPdfError(false)
        setPdfViewerMode('iframe')
    }, [document?.fileUrl])

    // Helper function to check if buttons should be disabled
    const isButtonsDisabled = (status?: string) => {
        return status === 'approved' || status === 'rejected'
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return {
                    className: 'text-[#34C759] border border-[#34C759]',
                    text: 'Approved',
                }
            case 'rejected':
                return {
                    className: ' text-red-800 border border-red-200',
                    text: 'Rejected',
                }
            case 'pending':
                return {
                    className: ' text-[#FF9500] border border-[#FF9500]',
                    text: 'Pending',
                }
            case 'under_review':
                return {
                    className: ' text-blue-800 border border-blue-200',
                    text: 'Under Review',
                }
            case 'accepted':
                return {
                    className: 'text-[#34C759] border border-[#34C759]',
                    text: 'Accepted',
                }
            case 'declined':
                return {
                    className: 'text-[#FF3B30] border border-[#FF3B30]',
                    text: 'Declined',
                }
            default:
                return {
                    className:
                        'bg-gray-100 text-gray-800 border border-gray-200',
                    text: 'Unknown',
                }
        }
    }

    // Enhanced PDF URL handling
    const getPdfUrl = (url: string, mode: string) => {
        if (!url) return ''

        // Remove any existing parameters and add fresh ones
        const cleanUrl = url.split('#')[0].split('?')[0]

        switch (mode) {
            case 'iframe':
                return `${cleanUrl}#view=fitH&toolbar=1&navpanes=0&scrollbar=1`
            case 'embed':
                return `${cleanUrl}#view=fitH&toolbar=0&navpanes=0`
            case 'google':
                return `https://docs.google.com/gview?url=${encodeURIComponent(
                    cleanUrl,
                )}&embedded=true`
            default:
                return cleanUrl
        }
    }

    // Handle PDF loading errors
    const handlePdfError = () => {
        setPdfError(true)
        // Try next fallback method
        if (pdfViewerMode === 'iframe') {
            setPdfViewerMode('embed')
        } else if (pdfViewerMode === 'embed') {
            setPdfViewerMode('google')
        } else if (pdfViewerMode === 'google') {
            setPdfViewerMode('download')
        }
    }

    // Download PDF directly
    const handleDownload = async () => {
        if (!document?.fileUrl) return

        setIsLoading(true)
        try {
            const response = await fetch(document.fileUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${document.name}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Download failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Open in new tab with various methods
    const handleOpenInNewTab = () => {
        if (!document?.fileUrl) return

        const url = document.fileUrl

        // Try multiple methods
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')

        if (!newWindow) {
            // Fallback: try Google Docs viewer
            window.open(
                `https://docs.google.com/gview?url=${encodeURIComponent(url)}`,
                '_blank',
                'noopener,noreferrer',
            )
        }
    }

    const title =
        document?.type === 'Professional Reference'
            ? 'View Professional Reference'
            : 'View Document'

    const renderBasicProfessionalReference = () => {
        if (!document?.referenceData) return null

        return (
            <div className="border border-gray-200 rounded-lg h-[500px] bg-gray-50 p-6 overflow-y-auto">
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <p className="text-sm font-medium text-gray-600">
                            Full Name:
                        </p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {document.referenceData.fullName}
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <p className="text-sm font-medium text-gray-600">
                            Email:
                        </p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {document.referenceData.email}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const renderPdfViewer = () => {
        if (!document?.fileUrl) {
            return (
                <div className="flex items-center justify-center px-3 py-8 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-center">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-[#000000]">
                                {document?.type || 'PDF'}
                            </span>
                            <span className="text-[#25324B] text-[13px] font-[500]">
                                Document not available for preview
                            </span>
                            <IoIosArrowForward color="#25324B" size={20} />
                        </div>
                    </div>
                </div>
            )
        }

        const pdfUrl = getPdfUrl(document.fileUrl, pdfViewerMode)

        switch (pdfViewerMode) {
            case 'iframe':
                return (
                    <div className="border border-gray-200 rounded-lg h-[500px] bg-gray-50 relative">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full rounded-lg"
                            title="Document Preview"
                            onError={handlePdfError}
                            onLoad={() => setPdfError(false)}
                            style={{ border: 'none' }}
                        />
                        {pdfError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center p-4">
                                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">
                                        PDF preview failed. Trying alternative
                                        method...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )

            case 'embed':
                return (
                    <div className="border border-gray-200 rounded-lg h-[500px] bg-gray-50">
                        <embed
                            src={pdfUrl}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            className="rounded-lg"
                            onError={handlePdfError}
                        />
                    </div>
                )

            case 'google':
                return (
                    <div className="border border-gray-200 rounded-lg h-[500px] bg-gray-50">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full rounded-lg"
                            title="Document Preview"
                            onError={handlePdfError}
                            style={{ border: 'none' }}
                        />
                    </div>
                )

            case 'download':
                return (
                    <div className="border border-gray-200 rounded-lg h-[500px] bg-gray-50 flex items-center justify-center">
                        <div className="text-center p-8">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Preview not available
                            </h3>
                            <p className="text-gray-500 mb-6">
                                This PDF cannot be previewed in the browser.
                                Please download or open in a new tab.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    onClick={handleDownload}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                >
                                    <Download className="w-4 h-4" />
                                    {isLoading
                                        ? 'Downloading...'
                                        : 'Download PDF'}
                                </Button>
                                <Button
                                    onClick={handleOpenInNewTab}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open in New Tab
                                </Button>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            zIndex="z-50"
        >
            <div className="p-6 mt-[-20px]">
                <div className="mb-4">
                    <label className="block text-[13px] font-medium text-[#344054] mb-2">
                        Document Name
                    </label>
                    <input
                        type="text"
                        value={document?.name || ''}
                        readOnly
                        className="w-full px-3 py-2 border border-[#D6DDEB] rounded-md text-[#25324B] text-[13px] bg-gray-50"
                    />
                </div>

                {/* Document Content */}
                <div className="mb-6">
                    <label className="block text-[13px] font-medium text-[#344054] mb-2">
                        {document?.type === 'Professional Reference'
                            ? 'Reference Information Preview'
                            : 'Document Preview'}
                    </label>

                    {document?.type === 'Professional Reference' &&
                    document?.referenceData ? (
                        renderBasicProfessionalReference()
                    ) : (
                        <>
                            {/* PDF Viewer Controls */}
                            {document?.fileUrl && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleOpenInNewTab}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Open in New Tab
                                            </button>
                                            <button
                                                onClick={handleDownload}
                                                disabled={isLoading}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                        </div>

                                        {document?.status && (
                                            <div className="flex items-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        getStatusBadge(
                                                            document.status,
                                                        ).className
                                                    }`}
                                                >
                                                    {
                                                        getStatusBadge(
                                                            document.status,
                                                        ).text
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Viewer Mode Selector */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-gray-600">
                                            Viewer:
                                        </span>
                                        <button
                                            onClick={() => {
                                                setPdfViewerMode('iframe')
                                                setPdfError(false)
                                            }}
                                            className={`px-2 py-1 text-xs rounded ${
                                                pdfViewerMode === 'iframe'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            Standard
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPdfViewerMode('embed')
                                                setPdfError(false)
                                            }}
                                            className={`px-2 py-1 text-xs rounded ${
                                                pdfViewerMode === 'embed'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            Embed
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPdfViewerMode('google')
                                                setPdfError(false)
                                            }}
                                            className={`px-2 py-1 text-xs rounded ${
                                                pdfViewerMode === 'google'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            Google Docs
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PDF Viewer */}
                            {renderPdfViewer()}
                        </>
                    )}
                </div>

                {/* Accept/Decline Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="solid"
                        onClick={onAccept}
                        disabled={
                            approvalLoading ||
                            declineLoading ||
                            isButtonsDisabled(document?.status)
                        }
                        className={`flex-1 h-11 text-white rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                            isButtonsDisabled(document?.status)
                                ? 'bg-gray-400 hover:bg-gray-400'
                                : 'hover:bg-[#0d7a7f]'
                        }`}
                    >
                        {isButtonsDisabled(document?.status)
                            ? 'Document Already Processed'
                            : 'Accept Document'}
                    </Button>
                    <Button
                        onClick={onDecline}
                        disabled={
                            approvalLoading ||
                            declineLoading ||
                            isButtonsDisabled(document?.status)
                        }
                        className={`flex-1 h-11 text-white rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                            isButtonsDisabled(document?.status)
                                ? 'bg-gray-400 hover:bg-gray-400'
                                : 'hover:bg-[#c42d49]'
                        }`}
                        style={{
                            background: isButtonsDisabled(document?.status)
                                ? '#9CA3AF'
                                : '#DC3454',
                        }}
                    >
                        {isButtonsDisabled(document?.status)
                            ? 'Document Already Processed'
                            : 'Decline Document'}
                    </Button>
                </div>
            </div>
        </BaseModal>
    )
}

export default DocumentViewModal
