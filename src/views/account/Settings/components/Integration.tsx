import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import { apiGetAccountSettingIntegrationData } from '@/services/AccountServices'

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
            // img: `/img/other/doc.png?text=${doc.content.type
            //     .charAt(0)
            //     .toUpperCase()}`,
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
            <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg">My Documents</h4>
                </div>
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
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
                                >
                                    View Document
                                </Button>
                            }
                        >
                            <div className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center flex-1 min-w-0">
                                        <Avatar
                                            className="bg-transparent dark:bg-transparent flex-shrink-0"
                                            src="/img/others/doc.png"
                                        />
                                        <div className="ltr:ml-2 rtl:mr-2 flex-1 min-w-0">
                                            <h6 className="truncate">
                                                {app.name}
                                            </h6>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-block text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 flex-shrink-0 ${
                                            getStatusColor(app.status).className
                                        }`}
                                    >
                                        {getStatusColor(app.status).text}
                                    </span>
                                </div>
                                <p className="mt-auto text-sm text-gray-600 dark:text-gray-300">
                                    {app.desc}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog
                width={650}
                isOpen={viewIntegration}
                onClose={onViewIntegrationClose}
                onRequestClose={onViewIntegrationClose}
            >
                <div className="flex items-center">
                    <Avatar
                        className="bg-transparent dark:bg-transparent"
                        src={intergrationDetails.img}
                    />
                    <div className="ltr:ml-3 rtl:mr-3">
                        <h6>{intergrationDetails.name}</h6>
                        {intergrationDetails.content?.fullName && (
                            <p className="text-xs text-gray-600 mt-1">
                                Reference:{' '}
                                {intergrationDetails.content.fullName}
                            </p>
                        )}
                        {intergrationDetails.user?.email && (
                            <p className="text-xs text-gray-600 mt-1">
                                Email: {intergrationDetails.user.email}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Preview of {intergrationDetails.name}
                    </span>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                                Status:
                            </span>
                            <span
                                className={`text-xs font-semibold px-2 py-1 rounded ${
                                    getStatusColor(
                                        intergrationDetails.status || '',
                                    ).className
                                }`}
                            >
                                {
                                    getStatusColor(
                                        intergrationDetails.status || '',
                                    ).text
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                                Created:
                            </span>
                            <span className="text-sm">
                                {intergrationDetails.createdAt
                                    ? new Date(
                                          intergrationDetails.createdAt,
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                                Updated:
                            </span>
                            <span className="text-sm">
                                {intergrationDetails.updatedAt
                                    ? new Date(
                                          intergrationDetails.updatedAt,
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">
                                Submitted by:
                            </span>
                            <span className="text-sm">
                                {intergrationDetails.user?.name}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onViewIntegrationClose}
                    >
                        Cancel
                    </Button>
                    {intergrationDetails?.content?.hasFile ? (
                        <Button variant="solid" loading={installing}>
                            Download
                        </Button>
                    ) : (
                        <Button
                            variant="solid"
                            loading={installing}
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
            </Dialog>
        </>
    )
}

export default Integration
