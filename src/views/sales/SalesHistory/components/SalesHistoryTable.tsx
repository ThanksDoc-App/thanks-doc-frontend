import React, { useState, useEffect, useRef } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    MoreHorizontal,
    Check,
    X,
    Star,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchJobHistory,
    updateJobStatus,
    rateJob,
    selectJobHistory,
    selectJobHistoryLoading,
    selectJobHistoryError,
    selectUpdateLoading,
    selectUpdateError,
    selectRatingLoading,
    selectRatingError,
    clearUpdateError,
    clearRatingError,
} from '../store/jobHistorySlice'
import SkeletonTable from '@/components/shared/SkeletonTable'
import toast from '@/components/ui/toast' // Add toast import
import Notification from '@/components/ui/Notification' // Add Notification import

const SalesHistory = ({ className }: any) => {
    const dispatch = useAppDispatch()
    const jobs = useAppSelector(selectJobHistory)
    const loading = useAppSelector(selectJobHistoryLoading)
    const error = useAppSelector(selectJobHistoryError)
    const updateLoading = useAppSelector(selectUpdateLoading)
    const updateError = useAppSelector(selectUpdateError)
    const ratingLoading = useAppSelector(selectRatingLoading)
    const ratingError = useAppSelector(selectRatingError)

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [showDropdown, setShowDropdown] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    // Refs for modal elements
    const confirmationModalRef = useRef(null)
    const ratingModalRef = useRef(null)

    // Fetch jobs from Redux on component mount
    useEffect(() => {
        dispatch(fetchJobHistory())
    }, [dispatch])

    // Clear errors when component unmounts or when needed
    useEffect(() => {
        return () => {
            if (updateError) {
                dispatch(clearUpdateError())
            }
            if (ratingError) {
                dispatch(clearRatingError())
            }
        }
    }, [updateError, ratingError, dispatch])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveDropdown(null)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    // Handle click outside for modals
    useEffect(() => {
        const handleModalClickOutside = (event) => {
            if (
                showModal &&
                confirmationModalRef.current &&
                !confirmationModalRef.current.contains(event.target)
            ) {
                handleCloseModal()
            }

            if (
                showRatingModal &&
                ratingModalRef.current &&
                !ratingModalRef.current.contains(event.target)
            ) {
                handleCloseRatingModal()
            }
        }

        if (showModal || showRatingModal) {
            document.addEventListener('mousedown', handleModalClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleModalClickOutside)
        }
    }, [showModal, showRatingModal])

    // Use Redux data
    const totalItems = jobs.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = jobs.slice(startIndex, endIndex)

    const getDropdownPosition = (index) => {
        const isLastRow = index === currentData.length - 1
        return isLastRow ? 'above' : 'below'
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items)
        setCurrentPage(1)
        setShowDropdown(false)
    }

    const handleDropdownToggle = (jobId: string) => {
        setActiveDropdown(activeDropdown === jobId ? null : jobId)
    }

    const handleMarkAsCompleted = (job: any) => {
        setSelectedJob(job)
        setShowModal(true)
        setActiveDropdown(null)
    }

    const handleConfirmCompletion = async () => {
        if (!selectedJob) return

        try {
            await dispatch(
                updateJobStatus({
                    id: selectedJob._id,
                    data: { status: 'completed' },
                }),
            ).unwrap()

            // Show success toast
            toast.push(
                <Notification title="Job Completed" type="success">
                    Job "{selectedJob.title || selectedJob.name}" has been
                    marked as completed successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            console.log('Job marked as completed successfully!')

            // Close modal first
            setShowModal(false)

            // Refresh the job history data to reflect changes
            dispatch(fetchJobHistory())

            // Then show rating modal
            setShowRatingModal(true)
            setRating(0)
            setHoverRating(0)
        } catch (error) {
            console.error('Failed to mark job as completed:', error)

            // Show error toast
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to mark job as completed. Please try again.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedJob(null)
        if (updateError) {
            dispatch(clearUpdateError())
        }
    }

    const handleCloseRatingModal = () => {
        setShowRatingModal(false)
        setSelectedJob(null)
        setRating(0)
        setHoverRating(0)
        // Clear rating error when closing modal
        if (ratingError) {
            dispatch(clearRatingError())
        }
    }

    const handleRatingSubmit = async () => {
        if (!selectedJob || rating === 0) return

        try {
            // Use the dedicated rateJob thunk instead of updateJobStatus
            await dispatch(
                rateJob({
                    id: selectedJob._id,
                    data: { rating: rating },
                }),
            ).unwrap()

            // Show success toast for rating
            toast.push(
                <Notification title="Rating Submitted" type="success">
                    Thank you for rating the service! Your {rating}-star rating
                    has been submitted.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            console.log(
                'Rating submitted successfully:',
                rating,
                'for job:',
                selectedJob._id,
            )

            // Close rating modal
            setShowRatingModal(false)
            setSelectedJob(null)
            setRating(0)
            setHoverRating(0)

            // Refresh the job history data to reflect rating changes
            dispatch(fetchJobHistory())
        } catch (error) {
            console.error('Failed to submit rating:', error)

            // Show error toast for rating
            toast.push(
                <Notification title="Rating Error" type="danger">
                    Failed to submit rating. Please try again.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    // Rest of your component code remains the same...
    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-3 py-1.5 rounded-full text-[12px] font-semibold'
        if (status === 'Accepted' || status === 'accepted')
            return `${baseClasses} text-[#FF9500] border border-[#FF9500]`
        if (status === 'Closed' || status === 'closed')
            return `${baseClasses} text-[#FF6550] border border-[#FF6550]`
        if (
            status === 'Completed' ||
            status === 'completed' ||
            status === 'active' ||
            status === 'Active'
        )
            return `${baseClasses} text-[#10B981] border border-[#10B981]`
        return `${baseClasses} text-gray-500 border border-gray-300`
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...')
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
            } else {
                pages.push(1, '...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++)
                    pages.push(i)
                pages.push('...', totalPages)
            }
        }

        return pages
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'

        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'N/A'

            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }

            return date.toLocaleDateString('en-GB', options)
        } catch (error) {
            return 'N/A'
        }
    }

    const StarRating = () => {
        return (
            <div className="flex items-center justify-center gap-1 my-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-colors duration-200"
                        disabled={ratingLoading}
                    >
                        <Star
                            className={`w-8 h-8 ${
                                star <= (hoverRating || rating)
                                    ? 'fill-[#FFD700] text-[#FFD700]'
                                    : 'text-gray-300'
                            }`}
                        />
                    </button>
                ))}
            </div>
        )
    }

    // Show loading state
    if (loading) {
        return <SkeletonTable />
    }

    // Show error state
    if (error) {
        return (
            <div className="w-full bg-white rounded-lg p-8 text-center">
                <div className="text-red-500">Error: {error}</div>
                <button
                    onClick={() => dispatch(fetchJobHistory())}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        )
    }

    // Rest of your JSX remains the same...

    return (
        <>
            <div className={`w-full rounded-lg ${className}`}>
                {/* Error Display */}
                {(updateError || ratingError) && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-red-600 text-sm">
                                {updateError || ratingError}
                            </span>
                            <button
                                onClick={() => {
                                    if (updateError)
                                        dispatch(clearUpdateError())
                                    if (ratingError)
                                        dispatch(clearRatingError())
                                }}
                                className="text-red-400 hover:text-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-[700px] w-full border border-gray-200 whitespace-nowrap">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#6b6d74]">
                                    Jobs
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#6b6d74]">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#6b6d74]">
                                    Date Posted
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#6b6d74]">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#6b6d74]">
                                    Doctor in charge
                                </th>
                                <th className="px-6 py-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No jobs found
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((item: any, index: any) => (
                                    <tr
                                        key={item._id || index}
                                        className={`text-[13px] whitespace-nowrap cursor-pointer transition-colors ${
                                            (index + 1) % 2 === 0
                                                ? 'bg-[#F8F8FD] dark:bg-transparent'
                                                : ''
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            {item.title || item.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={getStatusBadge(
                                                    item.status || 'N/A',
                                                )}
                                            >
                                                {item.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(item.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-0.5">
                                                <p>
                                                    {item?.amount ||
                                                        item?.salary}
                                                </p>
                                                <p>{item?.currency || 'USD'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.doctor?.name || 'N/A'}
                                        </td>

                                        <td className="px-6 py-4 relative">
                                            <div className="dropdown-container">
                                                <button
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDropdownToggle(
                                                            item._id,
                                                        )
                                                    }}
                                                    disabled={
                                                        updateLoading ||
                                                        ratingLoading
                                                    }
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>

                                                {activeDropdown ===
                                                    item._id && (
                                                    <div
                                                        className={`absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px] ${
                                                            getDropdownPosition(
                                                                index,
                                                            ) === 'above'
                                                                ? 'bottom-9'
                                                                : 'top-9'
                                                        }`}
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleMarkAsCompleted(
                                                                    item,
                                                                )
                                                            }}
                                                            disabled={
                                                                updateLoading ||
                                                                ratingLoading ||
                                                                item.status ===
                                                                    'completed'
                                                            }
                                                            className="w-full px-4 py-3 text-left text-sm font-[600] text-[#272D37] hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {updateLoading
                                                                ? 'Updating...'
                                                                : 'Mark as completed'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - keeping the same pagination code */}
                <div
                    className={`flex items-center justify-between px-6 py-4 border border-[#D6DDEB] ${className}`}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#8c91a0]">View</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-1 px-3 py-1 text-[13px] text-[#25324B] border border-[#D6DDEB] rounded bg-white hover:bg-gray-50"
                            >
                                {itemsPerPage}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {showDropdown && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-[#D6DDEB] rounded shadow-lg z-10">
                                    {[5, 10, 15, 20, 25].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() =>
                                                handleItemsPerPageChange(num)
                                            }
                                            className="block w-full px-3 py-2 text-[13px] text-left hover:bg-gray-50 text-[#25324B]"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, idx) =>
                                page === '...' ? (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 text-[13px]"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            handlePageChange(Number(page))
                                        }
                                        className={`px-3 py-1 text-[13px] rounded ${
                                            currentPage === page
                                                ? 'bg-[#0F9297] text-white'
                                                : 'dark:text-[white] light:text-[#25324B] '
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ),
                            )}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                            className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && selectedJob && (
                <div className="fixed inset-0 bg-[#2155A329] bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={confirmationModalRef}
                        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                    >
                        <div className="relative border-b border-[#EDEDED] pb-2">
                            <h3 className="text-[16px] font-semibold text-[#101010]">
                                Mark Job as Completed
                            </h3>
                        </div>

                        <div className="py-10">
                            {updateError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">
                                        {updateError}
                                    </p>
                                </div>
                            )}

                            <div className="mb-6 text-center px-10">
                                <p className="text-[#515B6F] font-[600] text-[14px] mb-4 leading-6">
                                    Do you confirm that this job "
                                    {selectedJob.title || selectedJob.name}" has
                                    been completed by the Doctor?
                                </p>
                            </div>
                            <div className="flex gap-3 justify-center w-full">
                                <button
                                    onClick={handleCloseModal}
                                    disabled={updateLoading}
                                    className="px-6 py-2.5 w-full text-[#6b6d74] border border-[#D6DDEB] rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleConfirmCompletion}
                                    disabled={updateLoading}
                                    className="px-6 py-2.5 w-full bg-[#0F9297] text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {updateLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        'Yes'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Enhanced Rating Modal with dedicated rateJob functionality */}
            {showRatingModal && selectedJob && (
                <div className="fixed inset-0 bg-[#2155A329] bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={ratingModalRef}
                        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                    >
                        <div>
                            <div className="border-b border-[#EDEDED] pb-2">
                                <h3 className="text-[16px] font-semibold text-[#101010]">
                                    Rate the service
                                </h3>
                            </div>
                            <div className="text-center mt-5">
                                {/* Show rating error in modal */}
                                {ratingError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">
                                            {ratingError}
                                        </p>
                                    </div>
                                )}

                                <p className="text-[#515B6F] text-[16px] mb-6">
                                    Rate{' '}
                                    {selectedJob.doctor?.name ||
                                        selectedJob.doctor ||
                                        'Dr'}{' '}
                                    service
                                </p>

                                <StarRating />

                                <button
                                    onClick={handleRatingSubmit}
                                    disabled={rating === 0 || ratingLoading}
                                    className="w-full py-3 bg-[#0F9297] text-white rounded-lg text-[16px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0d7d82] transition-colors"
                                >
                                    {ratingLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Submitting...
                                        </div>
                                    ) : (
                                        'Rate'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SalesHistory
