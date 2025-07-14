import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../../../store'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { CiMail } from 'react-icons/ci'
import { BsPhone } from 'react-icons/bs'
import {
    MoreHorizontal,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react'

import {
    fetchPaymentHistory,
    selectPaymentHistory,
    selectPaymentHistoryLoading,
    selectPaymentHistoryError,
    clearPaymentHistoryError,
    updatePaymentStatus,
} from '../store/businessSlice'

const BusinessDetails = () => {
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()

    // Redux selectors
    const paymentHistory = useSelector(selectPaymentHistory)
    const paymentHistoryLoading = useSelector(selectPaymentHistoryLoading)
    const paymentHistoryError = useSelector(selectPaymentHistoryError)

    // Tab state
    const [activeTab, setActiveTab] = useState('jobs')

    // Jobs pagination state
    const [currentJobsPage, setCurrentJobsPage] = useState(1)
    const [jobsPerPage, setJobsPerPage] = useState(10)
    const [showJobsDropdown, setShowJobsDropdown] = useState(false)

    // Job actions state
    const [jobActions, setJobActions] = useState<JobActionsState>({})

    // Filter state
    const [selectedFilter, setSelectedFilter] = useState('All')

    // Get the business data passed from the table
    const businessData = location.state?.businessData

    // Interface definitions
    interface Job {
        _id: string
        title: string
        jobId: string
        location?: string
        amount: number
        currency?: string
        paymentDate: string
        status: string
    }

    interface JobActionsState {
        [jobId: string]: boolean
    }

    // Helper functions
    const getBusinessName = () => {
        if (!businessData) return 'Unknown Business'
        return (
            businessData.name || businessData.businessName || 'Unknown Business'
        )
    }

    const getDateJoined = () => {
        if (!businessData) return 'Unknown Date'
        if (businessData.createdAt) {
            return new Date(businessData.createdAt).toLocaleDateString()
        }
        if (businessData.dateJoined) {
            return new Date(businessData.dateJoined).toLocaleDateString()
        }
        return 'Unknown Date'
    }

    // Fetch payment history when component mounts or pagination changes
    useEffect(() => {
        if (businessData?._id) {
            dispatch(
                fetchPaymentHistory({
                    businessOwnerId: businessData._id,
                    page: currentJobsPage,
                    limit: jobsPerPage,
                }),
            )
        }
    }, [dispatch, businessData?._id, currentJobsPage, jobsPerPage])

    // Debug: Log the payment history data
    useEffect(() => {
        console.log('Payment History from Redux:', paymentHistory)
        console.log('Loading:', paymentHistoryLoading)
        console.log('Error:', paymentHistoryError)
    }, [paymentHistory, paymentHistoryLoading, paymentHistoryError])

    const navigate = useNavigate()

    // Handle back navigation
    const handleGoBack = () => {
        navigate(-1)
    }

    // Jobs pagination logic using Redux data
    const totalJobsPages = Math.ceil(paymentHistory.length / jobsPerPage)
    const startIndex = (currentJobsPage - 1) * jobsPerPage
    const endIndex = startIndex + jobsPerPage
    const currentJobsData = paymentHistory.slice(startIndex, endIndex)

    console.log('currentJobsData', currentJobsData)

    // Generate page numbers for pagination
    const generatePageNumbers = (current: any, total: any) => {
        const pages = []
        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i)
            }
        } else {
            if (current <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', total)
            } else if (current >= total - 3) {
                pages.push(
                    1,
                    '...',
                    total - 4,
                    total - 3,
                    total - 2,
                    total - 1,
                    total,
                )
            } else {
                pages.push(
                    1,
                    '...',
                    current - 1,
                    current,
                    current + 1,
                    '...',
                    total,
                )
            }
        }
        return pages
    }

    const jobsPageNumbers = generatePageNumbers(currentJobsPage, totalJobsPages)

    // Handle page change
    const handleJobsPageChange = (page: any) => {
        if (page >= 1 && page <= totalJobsPages) {
            setCurrentJobsPage(page)
        }
    }

    // Handle per page change
    const handleJobsPerPageChange = (newPerPage: number) => {
        setJobsPerPage(newPerPage)
        setCurrentJobsPage(1)
        setShowJobsDropdown(false)
    }

    // Handle job action menu
    const handleJobActionMenu = (jobId: string): void => {
        setJobActions((prev: JobActionsState) => ({
            ...prev,
            [jobId]: !prev[jobId],
        }))
    }

    // Handle mark as paid using Redux
    const handleMarkAsPaid = (jobId: string) => {
        dispatch(updatePaymentStatus({ jobId, status: 'paid' }))
        setJobActions((prev: JobActionsState) => ({
            ...prev,
            [jobId]: false,
        }))
    }

    // Clear error using Redux
    const clearError = () => {
        dispatch(clearPaymentHistoryError())
    }

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    // If no business data is available
    if (!businessData) {
        return (
            <div className="w-full mx-auto bg-white p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-[#8c91a0] hover:text-[#25324B] transition-colors"
                    >
                        <IoMdArrowRoundBack size={24} />
                        Back
                    </button>
                </div>
                <div className="text-center py-8">
                    <div className="text-red-500 mb-4">
                        No business data available
                    </div>
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 bg-[#0F9297] text-white rounded hover:bg-[#0d7b7f]"
                    >
                        Go Back
                    </button>
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
                    <span className="text-lg font-medium">
                        Business Details
                    </span>
                </button>
            </div>

            {/* Business Information Card */}
            <div className="grid grid-cols-1 md:grid-cols-10 w-full gap-3 mt-5">
                {/* Left Section: Business Info */}
                <div className="md:col-span-3 border border-[#D6DDEB] p-5 h-fit">
                    <div className="flex items-center gap-6">
                        <div>
                            <img
                                src={
                                    businessData.profileImage?.url ||
                                    '/public/img/avatars/Avatar.png'
                                }
                                alt="Business Avatar"
                                className="w-[75px] h-[75px] object-cover rounded-full"
                            />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[#25324B] text-[17px] font-bold">
                                {getBusinessName()}
                            </p>
                            <p className="text-[#7C8493] text-[12px]">
                                Business
                            </p>
                        </div>
                    </div>
                    <div className="border-b border-[#D6DDEB] py-2" />
                    {/* Contact Section */}
                    <div className="py-3">
                        <p className="text-[#25324B] text-[14px] font-[600] mb-2">
                            Contact{' '}
                        </p>
                        <div className="flex gap-3 mb-3">
                            <CiMail size={16} />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Contact person{' '}
                                </p>
                                <p className="text-[#25324B] text-[11.5px] break-all">
                                    {businessData.name || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-3">
                            <CiMail size={16} />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Email{' '}
                                </p>
                                <p className="text-[#25324B] text-[11.5px] break-all">
                                    {businessData.email || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <BsPhone size={16} />
                            <div>
                                <p className="text-[#7C8493] text-[11.5px] font-[400]">
                                    Phone{' '}
                                </p>
                                <p className="text-[#25324B] text-[11.5px] break-all">
                                    {businessData.phone || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right section */}
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
                    </div>

                    {/* Jobs Table */}
                    <div className="w-full mx-auto bg-white">
                        {/* Error Display */}
                        {paymentHistoryError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-red-600 text-sm">
                                        {paymentHistoryError}
                                    </span>
                                    <button
                                        onClick={clearError}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {paymentHistoryLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                            </div>
                        ) : (
                            <div className="bg-white">
                                {/* Responsive Table Wrapper */}
                                <div className="overflow-x-auto bg-white scrollbar-hidden">
                                    <table className="min-w-[600px] w-full border border-[#D6DDEB]">
                                        <thead className="border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16 whitespace-nowrap">
                                                    Job
                                                </th>
                                                <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16 whitespace-nowrap">
                                                    Location
                                                </th>
                                                <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16 whitespace-nowrap">
                                                    Payment
                                                </th>
                                                <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16 whitespace-nowrap">
                                                    Date
                                                </th>
                                                <th className="px-6 py-4 w-12">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentJobsData.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-6 py-8 text-center text-gray-500"
                                                    >
                                                        No jobs found for this
                                                        business
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentJobsData.map(
                                                    (job, index) => (
                                                        <tr
                                                            key={job._id}
                                                            className={`hover:bg-gray-50 text-[#25324B] text-[13px] whitespace-nowrap transition-colors ${
                                                                (index + 1) %
                                                                    2 ===
                                                                0
                                                                    ? 'bg-[#F8F8FD]'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            job.title
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {job.location ||
                                                                    'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex gap-1">
                                                                    {job.amount}
                                                                    <p>
                                                                        {' '}
                                                                        {
                                                                            job.currency
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {job.paymentDate
                                                                    ? formatDate(
                                                                          job.paymentDate,
                                                                      )
                                                                    : 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 relative">
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation()
                                                                        handleJobActionMenu(
                                                                            job._id,
                                                                        )
                                                                    }}
                                                                    className="p-1 hover:bg-gray-200 rounded"
                                                                >
                                                                    <MoreHorizontal className="w-5 h-5" />
                                                                </button>
                                                                {jobActions[
                                                                    job._id
                                                                ] && (
                                                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-[#D6DDEB] rounded shadow-lg z-10">
                                                                        <button
                                                                            className="block w-full text-left px-4 py-2 text-[13px] text-[#25324B] hover:bg-gray-50"
                                                                            onClick={() =>
                                                                                handleMarkAsPaid(
                                                                                    job._id,
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
                            </div>
                        )}

                        {/* Pagination */}
                        {!paymentHistoryLoading &&
                            currentJobsData.length > 0 && (
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
                </div>
            </div>
        </div>
    )
}

export default BusinessDetails
