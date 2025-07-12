import React, { useState, useEffect, useMemo } from 'react'
import {
    X,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from 'lucide-react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { FaStar } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'
import { BsPhone } from 'react-icons/bs'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    selectDoctors,
    fetchPaymentHistory,
    fetchUserAccount,
    selectPaymentHistory,
    selectPaymentHistoryLoading,
    selectPaymentHistoryError,
    selectUserAccount,
    selectUserAccountLoading,
    selectUserAccountError,
    clearPaymentHistoryError,
    clearUserAccountError,
} from './store/doctorSlice'
import {
    getDocumentsByUser,
    selectDocuments,
    selectDocumentsLoading,
    selectDocumentsError,
    clearError,
} from './store/documentSlice'
import { apiApproveRejectDocument } from '@/services/CrmService'
import DoctorTool from './components/DoctorTool'
import DocumentViewModal from './components/modals/DocumentViewModal'
import ConfirmationModal from './components/modals/ConfirmationModal'

// **TypeScript Interfaces**
interface Doctor {
    _id: string
    name: string
    email: string
    phone?: string
    role: string
    rating?: number
    specialization: string
    gmcNumber?: string
    profileImage?: {
        url: string
    }
}

interface PaymentHistory {
    _id: string
    jobId: string
    amount: number
    currency: string
    paymentDate: string
    status: 'paid' | 'pending' | 'completed' | 'failed'
}

interface UserAccount {
    sortCode?: string
    accountNumber?: string
    accountName?: string
    bankName?: string
    balance?: number
    currency?: string
    accountStatus?: 'active' | 'inactive'
}

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

const DoctorDetails = () => {
    // **State Management**
    const [doctor, setDoctor] = useState<Doctor | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] =
        useState<DocumentItem | null>(null)
    const [activeTab, setActiveTab] = useState('jobs')
    const [jobActions, setJobActions] = useState<{ [key: string]: boolean }>({})
    const [approvalLoading, setApprovalLoading] = useState(false)
    const [declineLoading, setDeclineLoading] = useState(false)

    // Confirmation modal states
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false)
    const [confirmationAction, setConfirmationAction] = useState<
        'accept' | 'decline' | null
    >(null)
    const [confirmationLoading, setConfirmationLoading] = useState(false)

    // Jobs pagination state
    const [currentJobsPage, setCurrentJobsPage] = useState(1)
    const [jobsPerPage, setJobsPerPage] = useState(10)
    const [showJobsDropdown, setShowJobsDropdown] = useState(false)

    // Filter state for payment history
    const [selectedFilter, setSelectedFilter] = useState('This Week')
    const [searchTerm, setSearchTerm] = useState('')

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams<{ id: string }>()

    // **Redux Selectors**
    const doctorsData = useAppSelector(selectDoctors)
    const paymentHistory = useAppSelector(selectPaymentHistory)
    const paymentLoading = useAppSelector(selectPaymentHistoryLoading)
    const paymentError = useAppSelector(selectPaymentHistoryError)
    const userAccount = useAppSelector(selectUserAccount)
    const userAccountLoading = useAppSelector(selectUserAccountLoading)
    const userAccountError = useAppSelector(selectUserAccountError)
    const documents = useAppSelector(selectDocuments)
    const documentsLoading = useAppSelector(selectDocumentsLoading)
    const documentsError = useAppSelector(selectDocumentsError)

    // **Helper function to check if buttons should be disabled**
    const isButtonsDisabled = (status?: string) => {
        return status === 'approved' || status === 'rejected'
    }

    // **useEffect Hooks**
    useEffect(() => {
        if (location.state?.doctorData) {
            setDoctor(location.state.doctorData)
        } else if (id && doctorsData.length > 0) {
            const foundDoctor = doctorsData.find((doc) => doc._id === id)
            if (foundDoctor) {
                setDoctor(foundDoctor)
            }
        }
    }, [location.state, id, doctorsData])

    useEffect(() => {
        if (doctor?._id) {
            dispatch(fetchUserAccount(doctor._id))
        }
    }, [dispatch, doctor?._id])

    useEffect(() => {
        if (doctor?._id && activeTab === 'documents') {
            dispatch(
                getDocumentsByUser({
                    userId: doctor._id,
                    page: 1,
                    limit: 10,
                }),
            )
        }
    }, [dispatch, doctor?._id, activeTab])

    useEffect(() => {
        if (doctor?._id && activeTab === 'jobs') {
            const timeframe = selectedFilter === 'This Week' ? 'week' : 'month'
            dispatch(
                fetchPaymentHistory({
                    doctorId: doctor._id,
                    timeframe,
                    page: currentJobsPage,
                    limit: jobsPerPage,
                }),
            )
        }
    }, [
        dispatch,
        doctor?._id,
        selectedFilter,
        currentJobsPage,
        jobsPerPage,
        activeTab,
    ])

    // **Memoized Calculations**
    const paginatedData = useMemo(() => {
        const startIndex = (currentJobsPage - 1) * jobsPerPage
        const endIndex = startIndex + jobsPerPage
        return paymentHistory.slice(startIndex, endIndex)
    }, [paymentHistory, currentJobsPage, jobsPerPage])

    const totalJobsItems = paymentHistory.length
    const totalJobsPages = Math.ceil(totalJobsItems / jobsPerPage)
    const startJobsIndex = (currentJobsPage - 1) * jobsPerPage
    const endJobsIndex = startJobsIndex + jobsPerPage
    const currentJobsData = paymentHistory.slice(startJobsIndex, endJobsIndex)

    const jobsPageNumbers = useMemo(() => {
        const pages: (number | string)[] = []
        const maxVisiblePages = 5

        if (totalJobsPages <= maxVisiblePages) {
            for (let i = 1; i <= totalJobsPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentJobsPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalJobsPages)
            } else if (currentJobsPage >= totalJobsPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalJobsPages - 3; i <= totalJobsPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                for (
                    let i = currentJobsPage - 1;
                    i <= currentJobsPage + 1;
                    i++
                ) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalJobsPages)
            }
        }

        return pages
    }, [currentJobsPage, totalJobsPages])

    // **Handler Functions**
    const handleJobsPageChange = (page: number) => {
        if (page >= 1 && page <= totalJobsPages) {
            setCurrentJobsPage(page)
        }
    }

    const handleJobsPerPageChange = (items: number) => {
        setJobsPerPage(items)
        setCurrentJobsPage(1)
        setShowJobsDropdown(false)
    }

    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter)
        setCurrentJobsPage(1)
    }

    const validateDocumentUrl = (url: string): boolean => {
        try {
            new URL(url)
            return url.startsWith('https://') || url.startsWith('http://')
        } catch {
            return false
        }
    }

    const findCorrespondingFile = (item: any, files: any[]) => {
        if (!item.content?.documentRef || !files) return null

        const documentRef = item.content.documentRef
        const baseRef = documentRef.replace('.pdf', '')

        return files.find((file) => {
            if (!file.public_id) return false
            const fileName = file.public_id.split('/').pop() || ''
            return fileName.includes(baseRef)
        })
    }

    const handleViewDocument = (
        document: any,
        fileUrl?: string,
        documentId?: string,
    ): void => {
        const isProfessionalReference =
            document.content?.documentType === 'Professional References' ||
            document.title?.toLowerCase().includes('professional reference')

        if (isProfessionalReference) {
            const referenceData = {
                fullName:
                    document.content?.fullName ||
                    document.content?.referenceName ||
                    'N/A',
                email:
                    document.content?.email ||
                    document.content?.referenceEmail ||
                    'N/A',
                position:
                    document.content?.position ||
                    document.content?.jobTitle ||
                    '',
                organization:
                    document.content?.organization ||
                    document.content?.company ||
                    '',
                phone:
                    document.content?.phone ||
                    document.content?.phoneNumber ||
                    '',
            }

            setSelectedDocument({
                id: document.id || Math.random(),
                name: document.name || document.label || document.title,
                type: 'Professional Reference',
                status: document.status,
                documentId: documentId,
                referenceData: referenceData,
            })
        } else {
            if (fileUrl && !validateDocumentUrl(fileUrl)) {
                console.error('Invalid document URL:', fileUrl)
                return
            }

            setSelectedDocument({
                id: document.id || Math.random(),
                name: document.name || document.label || document.title,
                type: document.type || 'PDF',
                fileUrl: fileUrl,
                status: document.status,
                documentId: documentId,
            })
        }

        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedDocument(null)
    }

    // **Modal Workflow Handlers**
    const handleAccept = () => {
        setConfirmationAction('accept')
        setIsConfirmationModalOpen(true)
        setIsModalOpen(false)
    }

    const handleDecline = () => {
        setConfirmationAction('decline')
        setIsConfirmationModalOpen(true)
        setIsModalOpen(false)
    }

    const handleConfirmAction = async () => {
        if (!selectedDocument?.documentId) {
            console.error('No document ID available for action')
            return
        }

        try {
            setConfirmationLoading(true)

            if (confirmationAction === 'accept') {
                await apiApproveRejectDocument(
                    selectedDocument.documentId,
                    'approved',
                )
                console.log('Document approved successfully')
            } else if (confirmationAction === 'decline') {
                await apiApproveRejectDocument(
                    selectedDocument.documentId,
                    'rejected',
                )
                console.log('Document rejected successfully')
            }

            // Refresh documents after action
            if (doctor?._id) {
                dispatch(
                    getDocumentsByUser({
                        userId: doctor._id,
                        page: 1,
                        limit: 10,
                    }),
                )
            }

            // Close confirmation modal and clear selected document
            handleCloseConfirmationModal()
            setSelectedDocument(null)
        } catch (error) {
            console.error(`Error ${confirmationAction}ing document:`, error)
        } finally {
            setConfirmationLoading(false)
        }
    }

    const handleCloseConfirmationModal = () => {
        setIsConfirmationModalOpen(false)
        setConfirmationAction(null)
        setConfirmationLoading(false)
    }

    const handleCancelConfirmation = () => {
        setIsConfirmationModalOpen(false)
        setConfirmationAction(null)
        setConfirmationLoading(false)
        setIsModalOpen(true)
    }

    const handleJobActionMenu = (jobId: string) => {
        setJobActions((prev) => ({
            ...prev,
            [jobId]: !prev[jobId],
        }))
    }

    const handleMarkAsPaid = (jobId: string) => {
        setJobActions((prev) => ({
            ...prev,
            [jobId]: false,
        }))
        console.log('Marking job as paid:', jobId)
    }

    // **Utility Functions**
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'N/A'
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'N/A'
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
        } catch (error) {
            console.error('Date formatting error:', error)
            return 'N/A'
        }
    }

    const formatCurrency = (amount: number, currency: string = 'GBP') => {
        return `${amount} ${currency}`
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

    const isLoading = paymentLoading || documentsLoading || userAccountLoading

    if (!doctor) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-6 flex flex-col lg:flex-row justify-between items-center gap-5">
                <button
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => navigate(-1)}
                    aria-label="Go back to previous page"
                >
                    <IoMdArrowRoundBack size={24} />
                    <span className="text-lg font-medium">Doctor Details</span>
                </button>
                {activeTab === 'jobs' && (
                    <DoctorTool
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onFilterClick={() => {}}
                        selectedFilter={selectedFilter}
                        onFilterChange={handleFilterChange}
                    />
                )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-10 w-full gap-3 mt-5">
                {/* Left Section: Doctor Info */}
                <div className="md:col-span-3 border border-[#D6DDEB] p-5 h-fit">
                    <div className="flex items-center gap-4">
                        <div>
                            <img
                                src={
                                    doctor.profileImage?.url ||
                                    '/public/img/avatars/Avatar.png'
                                }
                                alt=""
                                className="w-[65px] h-[65px] object-cover rounded-full"
                            />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[#25324B] text-[17px] font-bold">
                                {doctor.name}
                            </p>
                            <p className="text-[#7C8493] text-[12px]">
                                {doctor.role?.charAt(0).toUpperCase() +
                                    doctor.role?.slice(1)}
                            </p>
                            <div className="flex items-center gap-1">
                                <FaStar color="#FFB836" />
                                <p className="text-[12px] font-[500] text-[#25324B]">
                                    {doctor.rating !== undefined &&
                                    doctor.rating !== null
                                        ? Number(doctor.rating).toFixed(1)
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[#0F9297] text-[11px] font-[400] mt-2 border-b border-[#D6DDEB] py-3">
                        {doctor.specialization}
                    </p>

                    {/* Contact Information */}
                    <div className="border-b border-[#D6DDEB] py-3">
                        <p className="text-[#25324B] text-[14px] font-[600] mb-2">
                            Contact
                        </p>
                        <div className="flex gap-3">
                            <CiMail />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Email
                                </p>
                                <p className="text-[#25324B] text-[11.5px] break-all">
                                    {doctor.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <BsPhone />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Phone
                                </p>
                                <p className="text-[#25324B] text-[11.5px]">
                                    {doctor.phone || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <BsPhone />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    GMC Number
                                </p>
                                <p className="text-[#25324B] text-[11.5px]">
                                    {doctor.gmcNumber || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details Section */}
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[#25324B] text-[14px] font-[600]">
                                Bank Details
                            </p>
                            {userAccountLoading && (
                                <div className="text-[10px] text-gray-500">
                                    Loading...
                                </div>
                            )}
                        </div>

                        {userAccountError && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-[10px]">
                                <div className="flex items-center justify-between">
                                    <span className="text-red-600">
                                        {userAccountError}
                                    </span>
                                    <button
                                        onClick={() =>
                                            dispatch(clearUserAccountError())
                                        }
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {userAccount ? (
                            <>
                                <div className="flex gap-3">
                                    <BsPhone />
                                    <div>
                                        <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                            Sort Code
                                        </p>
                                        <p className="text-[#25324B] text-[11.5px]">
                                            {userAccount.sortCode || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-3">
                                    <BsPhone />
                                    <div>
                                        <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                            Account Number
                                        </p>
                                        <p className="text-[#25324B] text-[11.5px]">
                                            {userAccount.accountNumber || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-3">
                                    <BsPhone />
                                    <div>
                                        <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                            Account Name
                                        </p>
                                        <p className="text-[#25324B] text-[11.5px]">
                                            {userAccount.accountName ||
                                                doctor.name}
                                        </p>
                                    </div>
                                </div>
                                {userAccount.bankName && (
                                    <div className="flex gap-3 mt-3">
                                        <BsPhone />
                                        <div>
                                            <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                                Bank Name
                                            </p>
                                            <p className="text-[#25324B] text-[11.5px]">
                                                {userAccount.bankName}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : !userAccountLoading ? (
                            <div className="text-[#7C8493] text-[11.5px] italic">
                                No bank details available
                            </div>
                        ) : null}

                        {/* Account Balance Display */}
                        {userAccount?.balance !== undefined && (
                            <div className="flex gap-3 mt-3 pt-3 border-t border-[#D6DDEB]">
                                <BsPhone />
                                <div>
                                    <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                        Account Balance
                                    </p>
                                    <p className="text-[#25324B] text-[11.5px] font-[600]">
                                        {formatCurrency(
                                            userAccount.balance,
                                            userAccount.currency,
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Account Status Display */}
                        {userAccount?.accountStatus && (
                            <div className="flex gap-3 mt-3">
                                <BsPhone />
                                <div>
                                    <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                        Account Status
                                    </p>
                                    <p
                                        className={`text-[11.5px] font-[500] ${
                                            userAccount.accountStatus ===
                                            'active'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {userAccount.accountStatus
                                            .charAt(0)
                                            .toUpperCase() +
                                            userAccount.accountStatus.slice(1)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Tabs and Content */}
                <div className="md:col-span-7">
                    {/* Tabs */}
                    <div className="flex items-center justify-center gap-6 border-b mb-6">
                        <button
                            className={`py-2 px-4 ${
                                activeTab === 'jobs'
                                    ? 'border-b-2 border-[#0F9297] font-bold'
                                    : 'text-gray-500'
                            }`}
                            onClick={() => setActiveTab('jobs')}
                        >
                            Jobs
                        </button>
                        <button
                            className={`py-2 px-4 ${
                                activeTab === 'documents'
                                    ? 'border-b-2 border-[#0F9297] font-bold'
                                    : 'text-gray-500'
                            }`}
                            onClick={() => setActiveTab('documents')}
                        >
                            Documents
                        </button>
                    </div>

                    {/* Jobs Table */}
                    {activeTab === 'jobs' && (
                        <div className="w-full mx-auto bg-white">
                            {/* Error Display */}
                            {paymentError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-red-600 text-sm">
                                            {paymentError}
                                        </span>
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    clearPaymentHistoryError(),
                                                )
                                            }
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {paymentLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                                </div>
                            ) : (
                                <div className="bg-white">
                                    <table className="w-full border border-[#D6DDEB]">
                                        <thead className="border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                                    Job ID
                                                </th>
                                                <th className="px-4 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                                    Amount
                                                </th>
                                                <th className="px-4 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                                    Payment Date
                                                </th>
                                                <th className="px-4 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                                    Status
                                                </th>
                                                <th className="px-4 py-4 w-12"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentJobsData.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-4 py-8 text-center text-gray-500"
                                                    >
                                                        No payment history found
                                                        for{' '}
                                                        {selectedFilter.toLowerCase()}
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentJobsData.map(
                                                    (payment, index) => (
                                                        <tr
                                                            key={payment._id}
                                                            className={`hover:bg-gray-50 text-[#25324B] text-[13px] transition-colors ${
                                                                (index + 1) %
                                                                    2 ===
                                                                0
                                                                    ? 'bg-[#F8F8FD]'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <td className="px-4 py-4">
                                                                {payment.jobId ||
                                                                    'N/A'}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                {formatCurrency(
                                                                    payment.amount,
                                                                    payment.currency,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                {formatDate(
                                                                    payment.paymentDate,
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <span
                                                                    className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                                                                        payment.status ===
                                                                            'paid' ||
                                                                        payment.status ===
                                                                            'completed'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : payment.status ===
                                                                                'pending'
                                                                              ? 'bg-yellow-100 text-yellow-800'
                                                                              : 'bg-red-100 text-red-800'
                                                                    }`}
                                                                >
                                                                    {
                                                                        payment.status
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 relative">
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation()
                                                                        handleJobActionMenu(
                                                                            payment._id,
                                                                        )
                                                                    }}
                                                                    className="p-1 hover:bg-gray-200 rounded"
                                                                >
                                                                    <MoreHorizontal className="w-5 h-5" />
                                                                </button>
                                                                {jobActions[
                                                                    payment._id
                                                                ] && (
                                                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-[#D6DDEB] rounded shadow-lg z-10">
                                                                        <button
                                                                            className="block w-full text-left px-4 py-2 text-[13px] text-[#25324B] hover:bg-gray-50"
                                                                            onClick={() =>
                                                                                handleMarkAsPaid(
                                                                                    payment._id,
                                                                                )
                                                                            }
                                                                        >
                                                                            Mark
                                                                            as
                                                                            paid
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {!paymentLoading && currentJobsData.length > 0 && (
                                <div className="flex items-center justify-between px-6 py-4 border border-[#D6DDEB] bg-white">
                                    {/* Left side - View dropdown */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] text-[#8c91a0]">
                                            View
                                        </span>
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setShowJobsDropdown(
                                                        !showJobsDropdown,
                                                    )
                                                }
                                                className="flex items-center gap-1 px-3 py-1 text-[13px] text-[#25324B] border border-[#D6DDEB] rounded bg-white hover:bg-gray-50"
                                            >
                                                {jobsPerPage}
                                                <ChevronDown className="w-4 h-4" />
                                            </button>

                                            {showJobsDropdown && (
                                                <div className="absolute top-full left-0 mt-1 bg-white border border-[#D6DDEB] rounded shadow-lg z-10">
                                                    {[5, 10, 15, 20, 25].map(
                                                        (num) => (
                                                            <button
                                                                key={num}
                                                                onClick={() =>
                                                                    handleJobsPerPageChange(
                                                                        num,
                                                                    )
                                                                }
                                                                className="block w-full px-3 py-2 text-[13px] text-left hover:bg-gray-50 text-[#25324B]"
                                                            >
                                                                {num}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right side - Page navigation */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handleJobsPageChange(
                                                    currentJobsPage - 1,
                                                )
                                            }
                                            disabled={currentJobsPage === 1}
                                            className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {jobsPageNumbers.map(
                                                (page, index) => (
                                                    <React.Fragment key={index}>
                                                        {page === '...' ? (
                                                            <span className="px-2 py-1 text-[13px] text-[#8c91a0]">
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleJobsPageChange(
                                                                        page as number,
                                                                    )
                                                                }
                                                                className={`px-3 py-1 text-[13px] rounded ${
                                                                    currentJobsPage ===
                                                                    page
                                                                        ? 'bg-[#0F9297] text-white'
                                                                        : 'text-[#25324B] hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        )}
                                                    </React.Fragment>
                                                ),
                                            )}
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleJobsPageChange(
                                                    currentJobsPage + 1,
                                                )
                                            }
                                            disabled={
                                                currentJobsPage ===
                                                totalJobsPages
                                            }
                                            className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Documents List */}
                    {activeTab === 'documents' && (
                        <div className="space-y-3">
                            {/* Error Display */}
                            {documentsError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-red-600 text-sm">
                                            {documentsError}
                                        </span>
                                        <button
                                            onClick={() =>
                                                dispatch(clearError())
                                            }
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {documentsLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-gray-500">
                                        No documents found for this doctor
                                    </div>
                                </div>
                            ) : (
                                documents.map((doc, index) => {
                                    const statusBadge = getStatusBadge(
                                        doc.status,
                                    )
                                    const correspondingFile = doc.files?.[0]
                                    const isProfessionalReference =
                                        doc.content?.documentType ===
                                            'Professional References' ||
                                        doc.title
                                            ?.toLowerCase()
                                            .includes('professional reference')

                                    return (
                                        <div
                                            key={`${doc._id}-${index}`}
                                            className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {doc.title}
                                                </p>

                                                {doc.content?.documentType && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Type:{' '}
                                                        {
                                                            doc.content
                                                                .documentType
                                                        }
                                                    </p>
                                                )}

                                                {isProfessionalReference &&
                                                    doc.content?.fullName && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Fullname:{' '}
                                                            {
                                                                doc.content
                                                                    .fullName
                                                            }
                                                        </p>
                                                    )}

                                                {doc.content?.email && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Email:{' '}
                                                        {doc.content.email}
                                                    </p>
                                                )}

                                                {doc.content?.submittedAt && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Submitted:{' '}
                                                        {formatDate(
                                                            doc.content
                                                                .submittedAt,
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                                                >
                                                    {statusBadge.text}
                                                </span>

                                                {isProfessionalReference ? (
                                                    <button
                                                        onClick={() => {
                                                            handleViewDocument(
                                                                {
                                                                    id: index,
                                                                    name: doc.title,
                                                                    type: 'Professional Reference',
                                                                    status: doc.status,
                                                                    content:
                                                                        doc.content,
                                                                },
                                                                undefined,
                                                                doc._id,
                                                            )
                                                        }}
                                                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors w-full sm:w-auto"
                                                    >
                                                        View
                                                    </button>
                                                ) : correspondingFile ? (
                                                    <button
                                                        onClick={() => {
                                                            handleViewDocument(
                                                                {
                                                                    id: index,
                                                                    name: doc.title,
                                                                    type: 'PDF',
                                                                    status: doc.status,
                                                                },
                                                                correspondingFile.url,
                                                                doc._id,
                                                            )
                                                        }}
                                                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors w-full sm:w-auto"
                                                    >
                                                        View PDF
                                                    </button>
                                                ) : (
                                                    <div className="bg-gray-100 px-4 py-2 rounded text-sm text-gray-600">
                                                        No File
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* **Document View Modal with Status-Based Button Disabling** */}
            <DocumentViewModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                document={selectedDocument}
                onAccept={handleAccept}
                onDecline={handleDecline}
                approvalLoading={
                    approvalLoading ||
                    isButtonsDisabled(selectedDocument?.status)
                }
                declineLoading={
                    declineLoading ||
                    isButtonsDisabled(selectedDocument?.status)
                }
            />

            {/* **Confirmation Modal** */}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={handleCloseConfirmationModal}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelConfirmation}
                action={confirmationAction}
                documentName={selectedDocument?.name}
                loading={confirmationLoading}
            />
        </div>
    )
}

export default DoctorDetails
