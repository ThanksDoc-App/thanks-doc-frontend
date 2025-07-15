import { useState, useEffect, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { X, Trash2 } from 'lucide-react'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import { apiGetAccountSettingIntegrationData } from '@/services/AccountServices'
import {
    updateDocument,
    deleteDocument,
    resetUpdateDocumentStatus,
    resetDeleteDocumentStatus,
    clearUpdateDocumentError,
    clearDeleteDocumentError,
    UpdateDocumentPayload,
    DeleteDocumentPayload,
} from '../store/settingsSlice'

// Modal Component
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    width?: number
    maxWidth?: string
    className?: string
}

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    width = 500,
    maxWidth = '95vw',
    className = '',
}: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
                className="fixed inset-0 bg-[#2155A329] bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            <div
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto w-full ${className}`}
                style={{
                    maxWidth: `min(${width}px, ${maxWidth})`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0 p-1"
                        >
                            <X size={18} className="sm:hidden" />
                            <X size={20} className="hidden sm:block" />
                        </button>
                    </div>
                )}

                <div
                    className={
                        title
                            ? 'p-3 sm:p-4 md:p-6'
                            : 'p-3 sm:p-4 md:p-6 pt-8 sm:pt-10 md:pt-12'
                    }
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

// Types
type DocumentDetail = {
    _id: string
    title: string
    name: string
    desc: string
    img: string
    type: string
    active: boolean
    status: 'approved' | 'rejected' | 'pending'
    content: {
        type: string
        documentType?: string
        certificateTitle?: string
        hasFile?: boolean
        submittedAt?: string
        fullName?: string
        email?: string
    }
    user: {
        _id: string
        name: string
        email: string
    }
    createdAt: string
    updatedAt: string
    files?: Array<{
        public_id: string
        url: string
        filename: string
    }>
}

type DocumentsType = {
    installed: DocumentDetail[]
    available: DocumentDetail[]
}

type GetAccountSettingIntegrationDataResponse = {
    data: {
        documents: DocumentDetail[]
        totalDocuments: number
        totalPages: number | null
        currentPage: number | null
    }
    message: string
    status: boolean
    statusCode: number
}

// Integration Component
const Integration = () => {
    const dispatch = useDispatch()

    const {
        updateDocumentLoading,
        updateDocumentSuccess,
        updateDocumentError,
        updateDocumentData,
        deleteDocumentLoading,
        deleteDocumentSuccess,
        deleteDocumentError,
    } = useSelector((state: any) => state.settings)

    const [data, setData] = useState<Partial<DocumentsType>>({})
    const [viewIntegration, setViewIntegration] = useState(false)
    const [intergrationDetails, setIntergrationDetails] = useState<
        Partial<DocumentDetail>
    >({})
    const [installing, setInstalling] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [updateTitle, setUpdateTitle] = useState('')
    const [updateContent, setUpdateContent] = useState('')
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false) // Add this state

    // State for reference document fields
    const [referenceFullName, setReferenceFullName] = useState('')
    const [referenceEmail, setReferenceEmail] = useState('')

    // Handle update document success
    useEffect(() => {
        if (updateDocumentSuccess) {
            toast.push(
                <Notification
                    title="Document updated successfully"
                    type="success"
                />,
                {
                    placement: 'top-center',
                },
            )
            fetchData()
            setSelectedFile(null)
            setUpdateTitle('')
            setUpdateContent('')
            setReferenceFullName('')
            setReferenceEmail('')
            dispatch(resetUpdateDocumentStatus())
            onViewIntegrationClose()
        }
    }, [updateDocumentSuccess, dispatch])

    // Handle update document error
    useEffect(() => {
        if (updateDocumentError) {
            toast.push(
                <Notification
                    title="Update failed"
                    type="danger"
                    description={updateDocumentError}
                />,
                {
                    placement: 'top-center',
                },
            )
            dispatch(clearUpdateDocumentError())
        }
    }, [updateDocumentError, dispatch])

    // Handle delete document success
    useEffect(() => {
        if (deleteDocumentSuccess) {
            toast.push(
                <Notification
                    title="File deleted successfully"
                    type="success"
                />,
                {
                    placement: 'top-center',
                },
            )
            setShowDeleteSuccess(true) // Show success message
            fetchData() // Refresh the data
            dispatch(resetDeleteDocumentStatus())

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowDeleteSuccess(false)
            }, 3000)
        }
    }, [deleteDocumentSuccess, dispatch])

    // Handle delete document error
    useEffect(() => {
        if (deleteDocumentError) {
            toast.push(
                <Notification
                    title="Delete failed"
                    type="danger"
                    description={deleteDocumentError}
                />,
                {
                    placement: 'top-center',
                },
            )
            dispatch(clearDeleteDocumentError())
        }
    }, [deleteDocumentError, dispatch])

    const fetchData = async () => {
        const response =
            await apiGetAccountSettingIntegrationData<GetAccountSettingIntegrationDataResponse>()

        const documents = response.data.data.documents.map((doc) => ({
            ...doc,
            name: doc.content.certificateTitle || doc.title,
            desc: doc.content.documentType || doc.content.type,
            type: doc.status,
            active: true,
        }))

        setData({
            available: documents,
            installed: [],
        })
    }

    useEffect(() => {
        if (isEmpty(data)) {
            fetchData()
        }
    }, [])

    const onViewIntegrationOpen = (
        details: DocumentDetail,
        installed: boolean,
    ) => {
        setViewIntegration(true)
        setIntergrationDetails({ ...details, installed })

        // Pre-populate the update form with current values
        setUpdateTitle(details.title || details.name || '')

        // Handle reference document specific fields
        if (details.content?.type === 'reference') {
            setReferenceFullName(details.content.fullName || '')
            setReferenceEmail(details.content.email || '')
        }

        // Ensure content is always valid JSON string (from original code)
        let contentValue = '{}'
        if (details.content) {
            try {
                contentValue = JSON.stringify(details.content, null, 2)
            } catch (error) {
                try {
                    const parsed = JSON.parse(details.content as any)
                    contentValue = JSON.stringify(parsed, null, 2)
                } catch (parseError) {
                    contentValue = JSON.stringify(
                        { text: details.content },
                        null,
                        2,
                    )
                }
            }
        }

        setUpdateContent(contentValue)
    }

    const onViewIntegrationClose = () => {
        setViewIntegration(false)
        setSelectedFile(null)
        setUpdateTitle('')
        setUpdateContent('')
        setReferenceFullName('')
        setReferenceEmail('')
        setShowDeleteSuccess(false) // Reset success message when closing modal
        if (updateDocumentError) {
            dispatch(clearUpdateDocumentError())
        }
        if (deleteDocumentError) {
            dispatch(clearDeleteDocumentError())
        }
    }

    const handleUpdateDocument = () => {
        if (!intergrationDetails._id) {
            toast.push(
                <Notification title="No document selected" type="danger" />,
                {
                    placement: 'top-center',
                },
            )
            return
        }

        const payload: UpdateDocumentPayload = {}

        // Handle different document types
        if (intergrationDetails.content?.type === 'reference') {
            // For reference documents, build content from form fields
            const referenceContent = {
                type: 'reference',
                documentType: intergrationDetails.content.documentType,
                fullName: referenceFullName.trim(),
                email: referenceEmail.trim(),
                submittedAt: intergrationDetails.content.submittedAt,
            }

            payload.title = updateTitle.trim()
            payload.content = JSON.stringify(referenceContent)
        } else {
            // For other documents, use existing logic from original code
            let validatedContent = updateContent.trim()
            if (validatedContent) {
                try {
                    JSON.parse(validatedContent)
                } catch (error) {
                    toast.push(
                        <Notification
                            title="Invalid JSON content"
                            type="danger"
                            description="Please ensure content is valid JSON format"
                        />,
                        {
                            placement: 'top-center',
                        },
                    )
                    return
                }
            }

            if (updateTitle.trim()) {
                payload.title = updateTitle.trim()
            }

            if (validatedContent) {
                payload.content = validatedContent
            }

            // Only add files for non-reference documents
            if (selectedFile) {
                payload.files = selectedFile // Send the File object directly (from original)
            }
        }

        // Check if we have any changes to make
        if (Object.keys(payload).length === 0) {
            toast.push(
                <Notification title="No changes to update" type="warning" />,
                {
                    placement: 'top-center',
                },
            )
            return
        }

        console.log('Payload being sent:', payload)

        dispatch(
            updateDocument({
                id: intergrationDetails._id!,
                payload: payload,
            }),
        )
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    // Updated delete function to use the new API structure
    const handleDeleteFile = (filePublicId: string) => {
        if (!intergrationDetails._id) {
            toast.push(
                <Notification title="No document selected" type="danger" />,
                {
                    placement: 'top-center',
                },
            )
            return
        }

        const deletePayload: DeleteDocumentPayload = {
            documentId: intergrationDetails._id,
            filesToDelete: [filePublicId], // Array of file public_ids to delete
        }

        console.log('Deleting file with payload:', deletePayload)
        dispatch(deleteDocument(deletePayload))
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return {
                    className:
                        'text-[#34C759] text-[700] border border-[#34C759] rounded-full',
                    text: 'Approved',
                }
            case 'rejected':
                return {
                    className:
                        'text-red-800 text-[700] border border-red-200 rounded-full',
                    text: 'Rejected',
                }
            case 'pending':
                return {
                    className:
                        'text-[#FF9500] text-[700] border border-[#FF9500] rounded-full',
                    text: 'Pending',
                }
            default:
                return {
                    className: 'text-gray-800 border border-gray-200',
                    text: status.charAt(0).toUpperCase() + status.slice(1),
                }
        }
    }

    return (
        <>
            <div className="mt-4 px-2 sm:px-0">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-base sm:text-lg">
                        My Documents
                    </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 mt-4">
                    {data?.available?.map((app) => (
                        <Card
                            key={app._id}
                            bodyClass="p-0"
                            footerClass="flex justify-end p-2"
                            footer={
                                <Button
                                    variant="plain"
                                    size="sm"
                                    onClick={() =>
                                        onViewIntegrationOpen(app, false)
                                    }
                                    className="text-xs sm:text-sm"
                                >
                                    View Document
                                </Button>
                            }
                        >
                            <div className="p-4 sm:p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div className="flex items-center flex-1 min-w-0 pr-2">
                                        <Avatar
                                            className="bg-transparent dark:bg-transparent flex-shrink-0"
                                            src="/img/others/doc.png"
                                            size="sm"
                                        />
                                        <div className="ltr:ml-2 rtl:mr-2 flex-1 min-w-0">
                                            <h6 className="truncate text-sm sm:text-base font-medium">
                                                {app.name}
                                            </h6>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-block text-xs font-semibold px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                                            getStatusColor(app.status).className
                                        }`}
                                    >
                                        {getStatusColor(app.status).text}
                                    </span>
                                </div>
                                <p className="mt-auto text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                    {app.desc}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                {data?.available?.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <div className="text-gray-500 dark:text-gray-400">
                            <p className="text-sm sm:text-base">
                                No documents available
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal with file upload AND delete functionality */}
            <Modal
                isOpen={viewIntegration}
                onClose={onViewIntegrationClose}
                width={650}
                maxWidth="95vw"
                title="Document Details"
            >
                <div className="flex items-center flex-wrap sm:flex-nowrap">
                    <Avatar
                        className="bg-transparent dark:bg-transparent flex-shrink-0"
                        src={intergrationDetails.img}
                        size="md"
                    />
                </div>

                <div className="mt-[-30px]">
                    <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                        Update {intergrationDetails.name}
                    </span>
                </div>

                <div className="mt-4 sm:mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Document Title
                        </label>
                        <input
                            type="text"
                            value={updateTitle}
                            onChange={(e) => setUpdateTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
                            placeholder="Enter document title"
                            disabled={true}
                        />
                    </div>

                    {/* Conditional rendering based on document type */}
                    {intergrationDetails.content?.type === 'reference' ? (
                        // Reference document specific fields - NO file upload
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={referenceFullName}
                                    onChange={(e) =>
                                        setReferenceFullName(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={referenceEmail}
                                    onChange={(e) =>
                                        setReferenceEmail(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter email address"
                                />
                            </div>
                        </>
                    ) : (
                        // Regular document fields - WITH file upload and JSON content
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Document Content (JSON Format)
                                </label>
                                <textarea
                                    value={updateContent}
                                    onChange={(e) =>
                                        setUpdateContent(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                                    placeholder='{"certificateTitle": "Your Title", "documentType": "Your Type"}'
                                    rows={4}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Content must be valid JSON format. Current
                                    document structure is prefilled.
                                </p>
                            </div>

                            {/* Show existing files if they exist */}
                            {intergrationDetails.files &&
                                intergrationDetails.files.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Existing Files
                                        </label>
                                        <div className="space-y-2">
                                            {intergrationDetails.files.map(
                                                (file) => (
                                                    <div
                                                        key={file.public_id}
                                                        className="flex items-center justify-between p-2 border rounded"
                                                    >
                                                        <span className="text-sm truncate">
                                                            {file.filename}
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                size="xs"
                                                                variant="plain"
                                                                onClick={() =>
                                                                    handleDeleteFile(
                                                                        file.public_id,
                                                                    )
                                                                }
                                                                className="text-red-600"
                                                                loading={
                                                                    deleteDocumentLoading
                                                                }
                                                                disabled={
                                                                    deleteDocumentLoading
                                                                }
                                                            >
                                                                <Trash2
                                                                    size={14}
                                                                />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        {/* Success message under existing files */}
                                        {showDeleteSuccess && (
                                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-4 h-4 text-green-600 mr-2"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="text-sm text-green-800 font-medium">
                                                        File deleted
                                                        successfully!
                                                    </span>
                                                </div>
                                                <p className="text-xs text-green-600 mt-1">
                                                    The file has been
                                                    permanently removed from the
                                                    document.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                            {/* File upload section - ONLY for non-reference documents */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Upload File{' '}
                                    {intergrationDetails.files?.length
                                        ? '(Optional)'
                                        : ''}
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {selectedFile && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {updateDocumentError && (
                        <div className="text-red-600 text-sm">
                            {updateDocumentError}
                        </div>
                    )}

                    {deleteDocumentError && (
                        <div className="text-red-600 text-sm">
                            {deleteDocumentError}
                        </div>
                    )}
                </div>

                <div className="text-right mt-4 sm:mt-6">
                    <Button
                        variant="solid"
                        loading={updateDocumentLoading}
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={handleUpdateDocument}
                    >
                        Update Document
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default Integration
