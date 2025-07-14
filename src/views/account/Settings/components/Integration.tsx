import { useState, useEffect, ReactNode } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { X } from 'lucide-react'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import { apiGetAccountSettingIntegrationData } from '@/services/AccountServices'

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
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#2155A329] bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto w-full ${className}`}
                style={{
                    maxWidth: `min(${width}px, ${maxWidth})`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
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

                {/* Close button when no title */}
                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10 p-1"
                    >
                        <X size={18} className="sm:hidden" />
                        <X size={20} className="hidden sm:block" />
                    </button>
                )}

                {/* Content */}
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

// Types remain the same...
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
    }
    user: {
        _id: string
        name: string
        email: string
    }
    createdAt: string
    updatedAt: string
    files?: any[]
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
    const [data, setData] = useState<Partial<DocumentsType>>({})
    const [viewIntegration, setViewIntegration] = useState(false)
    const [intergrationDetails, setIntergrationDetails] = useState<
        Partial<DocumentDetail>
    >({})
    const [installing, setInstalling] = useState(false)

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

    const handleToggle = (
        bool: boolean,
        name: string,
        category: keyof DocumentsType,
    ) => {
        setData((prevState) => {
            const nextState = cloneDeep(prevState as DocumentsType)
            const nextCategoryValue = nextState[category].map((app) => {
                if (app?.name === name) {
                    app.active = !bool
                }
                return app
            })
            nextState[category] = nextCategoryValue
            return nextState
        })
    }

    const onViewIntegrationOpen = (
        details: DocumentDetail,
        installed: boolean,
    ) => {
        setViewIntegration(true)
        setIntergrationDetails({ ...details, installed })
    }

    const onViewIntegrationClose = () => {
        setViewIntegration(false)
    }

    const handleInstall = (details: DocumentDetail) => {
        setInstalling(true)
        setTimeout(() => {
            setData((prevState) => {
                const nextState = cloneDeep(prevState)
                const nextAvailableApp = nextState?.available?.filter(
                    (app) => app.name !== details.name,
                )
                nextState.available = nextAvailableApp
                nextState?.installed?.push(details)
                return nextState
            })
            setInstalling(false)
            onViewIntegrationClose()
            toast.push(
                <Notification title="Document viewed" type="success" />,
                {
                    placement: 'top-center',
                },
            )
        }, 1000)
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
            case 'under_review':
                return {
                    className:
                        'text-blue-800 text-[700] border border-blue-200 rounded-full',
                    text: 'Under Review',
                }
            case 'accepted':
                return {
                    className:
                        'text-green-800 text-[700] border border-green-200 rounded-full',
                    text: 'Accepted',
                }
            case 'declined':
                return {
                    className:
                        'text-[#FF3B30] text-[700] border border-[#FF3B30] rounded-full',
                    text: 'Declined',
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

                {/* Responsive Grid - Single column on mobile, preserve desktop layout */}
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

                {/* Empty state for better UX */}
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

            {/* Responsive Modal */}
            <Modal
                isOpen={viewIntegration}
                onClose={onViewIntegrationClose}
                width={650}
                maxWidth="95vw"
            >
                <div className="flex items-center flex-wrap sm:flex-nowrap">
                    <Avatar
                        className="bg-transparent dark:bg-transparent flex-shrink-0"
                        src={intergrationDetails.img}
                        size="md"
                    />
                    <div className=" flex-1 min-w-0 mt-[-60px] ml-[-30px]">
                        <h6 className="text-sm sm:text-base font-semibold truncate">
                            {intergrationDetails.name}
                        </h6>
                        {intergrationDetails.content?.fullName && (
                            <p className="text-xs text-gray-600 mt-1 truncate">
                                Reference:{' '}
                                {intergrationDetails.content.fullName}
                            </p>
                        )}
                        {intergrationDetails.user?.email && (
                            <p className="text-xs text-gray-600 mt-1 truncate">
                                Email: {intergrationDetails.user.email}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 sm:mt-6">
                    <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                        Preview of {intergrationDetails.name}
                    </span>
                </div>

                <div className="text-right mt-4 sm:mt-6">
                    {intergrationDetails?.content?.hasFile ? (
                        <Button
                            variant="solid"
                            loading={installing}
                            size="sm"
                            className="w-full sm:w-auto"
                        >
                            Update
                        </Button>
                    ) : (
                        <Button
                            variant="solid"
                            loading={installing}
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() =>
                                handleInstall(
                                    intergrationDetails as DocumentDetail,
                                )
                            }
                        >
                            View Details
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    )
}

export default Integration
