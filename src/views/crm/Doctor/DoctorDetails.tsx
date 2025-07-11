import React, { useState, useEffect } from 'react'
import {
    X,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ExternalLink,
} from 'lucide-react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { FaStar } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'
import { BsPhone } from 'react-icons/bs'
import { IoIosArrowForward } from 'react-icons/io'
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
import { Button } from '@/components/ui'
import DoctorTool from './components/DoctorTool'

interface DocumentItem {
    id: number
    name: string
    type: string
    fileUrl?: string
    status?: string
    documentId?: string
}

const DoctorDetails = () => {
    const [doctor, setDoctor] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDocument, setSelectedDocument] =
        useState<DocumentItem | null>(null)
    const [activeTab, setActiveTab] = useState('jobs')
    const [jobActions, setJobActions] = useState<{ [key: string]: boolean }>({})
    const [approvalLoading, setApprovalLoading] = useState(false)

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

    // Redux selectors
    const doctorsData = useAppSelector(selectDoctors)
    const paymentHistory = useAppSelector(selectPaymentHistory)
    const paymentLoading = useAppSelector(selectPaymentHistoryLoading)
    const paymentError = useAppSelector(selectPaymentHistoryError)

    // User account selectors
    const userAccount = useAppSelector(selectUserAccount)
    const userAccountLoading = useAppSelector(selectUserAccountLoading)
    const userAccountError = useAppSelector(selectUserAccountError)

    // Documents Redux selectors
    const documents = useAppSelector(selectDocuments)
    const documentsLoading = useAppSelector(selectDocumentsLoading)
    const documentsError = useAppSelector(selectDocumentsError)

    console.log('userAccount', userAccount)
    console.log('documents', documents)

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

    // Fetch user account when doctor is loaded
    useEffect(() => {
        if (doctor?._id) {
            dispatch(fetchUserAccount(doctor._id))
        }
    }, [dispatch, doctor?._id])

    // Fetch documents when documents tab is active
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

    // Fetch payment history when doctor is loaded or filter changes
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

    // Jobs pagination calculations using payment history data
    const totalJobsItems = paymentHistory.length
    const totalJobsPages = Math.ceil(totalJobsItems / jobsPerPage)
    const startJobsIndex = (currentJobsPage - 1) * jobsPerPage
    const endJobsIndex = startJobsIndex + jobsPerPage
    const currentJobsData = paymentHistory.slice(startJobsIndex, endJobsIndex)

    // Handle jobs page change
    const handleJobsPageChange = (page: number) => {
        if (page >= 1 && page <= totalJobsPages) {
            setCurrentJobsPage(page)
        }
    }

    // Handle jobs per page change
    const handleJobsPerPageChange = (items: number) => {
        setJobsPerPage(items)
        setCurrentJobsPage(1)
        setShowJobsDropdown(false)
    }

    // Handle filter change
    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter)
        setCurrentJobsPage(1)
    }

    // Generate page numbers for jobs
    const getJobsPageNumbers = () => {
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
    }

    // Enhanced file matching function
    const findCorrespondingFile = (item: any, files: any[]) => {
        if (!item.content?.documentRef || !files) return null

        // Extract the base filename without extension
        const documentRef = item.content.documentRef
        const baseRef = documentRef.replace('.pdf', '')

        // Find file that contains this base reference
        return files.find((file) => {
            if (!file.public_id) return false

            // Extract filename from public_id path
            const fileName = file.public_id.split('/').pop() || ''

            // Check if the filename contains the base reference
            return fileName.includes(baseRef)
        })
    }

    // Enhanced handleViewDocument to support both API documents and modal with PDF viewer
    const handleViewDocument = (
        document: any,
        fileUrl?: string,
        documentId?: string,
    ): void => {
        setSelectedDocument({
            id: document.id || Math.random(),
            name: document.name || document.label || document.title,
            type: document.type || 'PDF',
            fileUrl: fileUrl,
            status: document.status,
            documentId: documentId,
        })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedDocument(null)
    }

    // Enhanced approve/reject functions with API integration
    const handleAccept = async () => {
        if (!selectedDocument?.documentId) {
            console.error('No document ID available for approval')
            return
        }

        try {
            setApprovalLoading(true)
            await apiApproveRejectDocument(
                selectedDocument.documentId,
                'approved',
            )

            // Refresh documents after approval
            if (doctor?._id) {
                dispatch(
                    getDocumentsByUser({
                        userId: doctor._id,
                        page: 1,
                        limit: 10,
                    }),
                )
            }

            console.log('Document approved successfully')
            handleCloseModal()
        } catch (error) {
            console.error('Error approving document:', error)
        } finally {
            setApprovalLoading(false)
        }
    }

    const handleDecline = async () => {
        if (!selectedDocument?.documentId) {
            console.error('No document ID available for rejection')
            return
        }

        try {
            setApprovalLoading(true)
            await apiApproveRejectDocument(
                selectedDocument.documentId,
                'rejected',
            )

            // Refresh documents after rejection
            if (doctor?._id) {
                dispatch(
                    getDocumentsByUser({
                        userId: doctor._id,
                        page: 1,
                        limit: 10,
                    }),
                )
            }

            console.log('Document rejected successfully')
            handleCloseModal()
        } catch (error) {
            console.error('Error rejecting document:', error)
        } finally {
            setApprovalLoading(false)
        }
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

    // Format date helper
    const formatDate = (dateString: string) => {
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
            return 'N/A'
        }
    }

    // Format currency
    const formatCurrency = (amount: number, currency: string = 'GBP') => {
        return `${amount} ${currency}`
    }

    if (!doctor) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">
                        Loading doctor details...
                    </div>
                </div>
            </div>
        )
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return {
                    className:
                        'bg-green-100 text-green-800 border border-green-200',
                    text: 'Approved',
                }
            case 'rejected':
                return {
                    className: 'bg-red-100 text-red-800 border border-red-200',
                    text: 'Rejected',
                }
            case 'pending':
                return {
                    className:
                        'bg-yellow-100 text-yellow-800 border border-yellow-200',
                    text: 'Pending',
                }
            case 'under_review':
                return {
                    className:
                        'bg-blue-100 text-blue-800 border border-blue-200',
                    text: 'Under Review',
                }
            case 'accepted':
                return {
                    className:
                        'bg-green-100 text-green-800 border border-green-200',
                    text: 'Accepted',
                }
            case 'declined':
                return {
                    className: 'bg-red-100 text-red-800 border border-red-200',
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

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-6 flex flex-col lg:flex-row justify-between items-center gap-5">
                <button
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => navigate(-1)}
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

                    {/* Enhanced Bank Details Section with Real Data */}
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

                        {/* User Account Error Display */}
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

                        {/* Account Balance Display (if available) */}
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

                        {/* Account Status Display (if available) */}
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
                                    <div className="text-gray-500">
                                        Loading payment history...
                                    </div>
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
                                        {/* Previous button */}
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

                                        {/* Page numbers */}
                                        <div className="flex items-center gap-1">
                                            {getJobsPageNumbers().map(
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

                                        {/* Next button */}
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

                    {/* Documents List with Fixed File Matching */}
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
                                    <div className="text-gray-500">
                                        Loading documents...
                                    </div>
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-gray-500">
                                        No documents found for this doctor
                                    </div>
                                </div>
                            ) : (
                                // Fixed Documents Display with Proper File Matching
                                documents.flatMap((doc) =>
                                    doc.content.documents.map((item, index) => {
                                        const statusBadge = getStatusBadge(
                                            doc.status,
                                        )

                                        // Use the enhanced file matching function
                                        const correspondingFile =
                                            findCorrespondingFile(
                                                item,
                                                doc.files,
                                            )

                                        return (
                                            <div
                                                key={`${doc._id}-${index}`}
                                                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {item.label ||
                                                            item.title}
                                                    </p>

                                                    {/* Show additional info for reference documents */}
                                                    {item.content.fullName && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Contact:{' '}
                                                            {
                                                                item.content
                                                                    .fullName
                                                            }{' '}
                                                            (
                                                            {item.content.email}
                                                            )
                                                        </p>
                                                    )}

                                                    {/* Show expiry date if available */}
                                                    {item.content
                                                        .expiryDate && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Expires:{' '}
                                                            {formatDate(
                                                                item.content
                                                                    .expiryDate,
                                                            )}
                                                        </p>
                                                    )}

                                                    {/* Show document title if available */}
                                                    {item.content
                                                        .documentTitle && (
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Title:{' '}
                                                            {
                                                                item.content
                                                                    .documentTitle
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {/* Status Badge */}
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                                                    >
                                                        {statusBadge.text}
                                                    </span>

                                                    {/* Conditional View Button based on document type */}
                                                    {item.content.fullName ? (
                                                        // For reference documents (no PDF), show contact info
                                                        <div className="bg-gray-100 px-4 py-2 rounded text-sm text-gray-600">
                                                            Contact Info
                                                        </div>
                                                    ) : correspondingFile ? (
                                                        // For documents with PDF files
                                                        <button
                                                            onClick={() => {
                                                                handleViewDocument(
                                                                    {
                                                                        id: index,
                                                                        name:
                                                                            item.label ||
                                                                            item.title,
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
                                                        // For documents without files
                                                        <div className="bg-gray-100 px-4 py-2 rounded text-sm text-gray-600">
                                                            No File
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }),
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal with PDF Viewer and Accept/Decline */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#2155A329] bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] p-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4">
                            <h3 className="text-[17px] font-semibold text-[#272D37]">
                                View Document
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" color="#0A1629" />
                            </button>
                        </div>

                        <div className="p-6 mt-[-20px]">
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium text-[#344054] mb-2">
                                    Document Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedDocument?.name || ''}
                                    readOnly
                                    className="w-full px-3 py-2 border border-[#D6DDEB] rounded-md text-[#25324B] text-[13px] bg-gray-50"
                                />
                            </div>

                            {/* PDF Link Section - Clickable link to open in new tab */}
                            {selectedDocument?.fileUrl && (
                                <div className="mb-4">
                                    <label className="block text-[13px] font-medium text-[#344054] mb-2">
                                        PDF Document
                                    </label>
                                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className="text-sm font-bold text-[#000000]">
                                                {selectedDocument?.type ||
                                                    'PDF'}
                                            </span>
                                            <span className="text-[#25324B] text-[13px] font-[500]">
                                                Click to view
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                window.open(
                                                    selectedDocument.fileUrl,
                                                    '_blank',
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Open PDF
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PDF Viewer Section */}
                            {selectedDocument?.fileUrl ? (
                                <div className="mb-6">
                                    <label className="block text-[13px] font-medium text-[#344054] mb-2">
                                        Document Preview
                                    </label>
                                    <div className="border border-gray-200 rounded-lg h-[500px] bg-gray-50">
                                        <iframe
                                            src={`${selectedDocument.fileUrl}#view=fitH`}
                                            className="w-full h-full rounded-lg"
                                            title="Document Preview"
                                            style={{ border: 'none' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <div className="flex items-center justify-center px-3 py-8 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="text-center">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-bold text-[#000000]">
                                                    {selectedDocument?.type ||
                                                        'PDF'}
                                                </span>
                                                <span className="text-[#25324B] text-[13px] font-[500]">
                                                    Document not available for
                                                    preview
                                                </span>
                                                <IoIosArrowForward
                                                    color="#25324B"
                                                    size={20}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Document Status */}
                            {selectedDocument?.status && (
                                <div className="mb-4">
                                    <label className="block text-[13px] font-medium text-[#344054] mb-2">
                                        Current Status
                                    </label>
                                    <div className="flex items-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                getStatusBadge(
                                                    selectedDocument.status,
                                                ).className
                                            }`}
                                        >
                                            {
                                                getStatusBadge(
                                                    selectedDocument.status,
                                                ).text
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Accept/Decline Buttons with API Integration */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAccept}
                                    disabled={approvalLoading}
                                    className="flex-1 bg-[#0F9297] h-[45px] text-white rounded-md font-medium transition-colors hover:bg-[#0d7a7f] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {approvalLoading
                                        ? 'Processing...'
                                        : 'Accept Document'}
                                </button>
                                <button
                                    onClick={handleDecline}
                                    disabled={approvalLoading}
                                    className="flex-1 bg-[#DC3454] h-[45px] text-white rounded-md font-medium transition-colors hover:bg-[#c42d49] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {approvalLoading
                                        ? 'Processing...'
                                        : 'Decline Document'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DoctorDetails
