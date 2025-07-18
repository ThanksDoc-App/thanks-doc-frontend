import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import {
    fetchJobHistory,
    selectJobHistory,
    selectJobHistoryLoading,
    selectJobHistoryError,
} from '../JobHistory/store/jobHistorySlice'
import SkeletonTable from '@/components/shared/SkeletonTable'

const JobHistoryTable = ({ className }: any) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const jobData = useSelector((state: RootState) => selectJobHistory(state))
    const loading = useSelector((state: RootState) =>
        selectJobHistoryLoading(state),
    )
    const error = useSelector((state: RootState) =>
        selectJobHistoryError(state),
    )

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        dispatch(fetchJobHistory())
    }, [dispatch])

    // Capitalize first letter of status or payment
    const capitalize = (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1)

    const transformedJobData = jobData.map((job, index) => ({
        id: job._id || index,
        companyName: (job as any).businessOwner?.name || 'N/A',
        role: (job as any)?.name || 'N/A',
        dateApplied: job.createdAt
            ? new Date(job.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
              })
            : 'N/A',
        status: job.status || 'pending',
        amount: job.amount || 0,
        currency: job.currency || 'GBP',
        hasPaid: job.hasPaid ? 'paid' : 'pending',
    }))

    const totalItems = transformedJobData.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = transformedJobData.slice(startIndex, endIndex)

    const handleJobClick = (jobId: any) => {
        navigate(`/app/project/job-details/${jobId}`)
    }

    const handlePageChange = (page: any) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleItemsPerPageChange = (items: any) => {
        setItemsPerPage(items)
        setCurrentPage(1)
        setShowDropdown(false)
    }

    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-2 py-1 rounded-full text-[12px] font-semibold'

        if (status === 'In Review' || status === 'pending') {
            return `${baseClasses} text-[#FFB836] border border-[#FFB836]`
        } else if (status === 'Completed' || status === 'completed') {
            return `${baseClasses} text-[#0F9297] border border-[#0F9297]`
        } else if (status === 'rejected' || status === 'cancelled') {
            return `${baseClasses} text-red-500 border border-red-500`
        } else if (status === 'Accepted' || status === 'accepted') {
            return `${baseClasses} text-green-500 border border-green-300 bg-green-50`
        }

        return baseClasses
    }

    const getPaymentBadge = (status: string) => {
        const baseClasses = 'px-2 py-1 rounded-full text-[12px] font-semibold'

        if (status === 'pending') {
            return `${baseClasses} text-gray-500 border border-gray-400 bg-gray-100`
        }

        if (status === 'paid') {
            return `${baseClasses} text-blue-500 border border-blue-500 bg-blue-50`
        }

        return baseClasses
    }

    if (loading && transformedJobData.length === 0) {
        return <SkeletonTable />
    }

    if (error && transformedJobData.length === 0) {
        return (
            <div className="w-full mx-auto bg-white">
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="text-red-500 mb-4">Error: {error}</div>
                    <button
                        onClick={() => dispatch(fetchJobHistory())}
                        className="px-4 py-2 bg-[#0F9297] text-white rounded hover:bg-[#0d7b7f]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full mx-auto">
            <div className={`overflow-x-auto scrollbar-hidden ${className}`}>
                <table
                    className={`min-w-[700px] w-full border border-[#D6DDEB] ${className}`}
                >
                    <thead className="border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                #
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                Company Name
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                Date Applied
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                Payment Status
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((job, index) => (
                                <tr
                                    key={job.id}
                                    onClick={() => handleJobClick(job.id)}
                                    className={`text-[13px] whitespace-nowrap cursor-pointer transition-colors ${
                                        (index + 1) % 2 === 0
                                            ? 'bg-[#F8F8FD] dark:bg-transparent'
                                            : ''
                                    }`}
                                >
                                    <td className="px-6 py-4">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        {job.companyName}
                                    </td>
                                    <td className="px-2 py-4">{job.role}</td>
                                    <td className="px-6 py-4">
                                        {job.dateApplied}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={getStatusBadge(
                                                job.status,
                                            )}
                                        >
                                            {capitalize(job.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={getPaymentBadge(
                                                job.hasPaid,
                                            )}
                                        >
                                            {capitalize(job.hasPaid)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="p-1 hover:bg-gray-200 rounded"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-12 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-gray-600 mb-4 text-lg">
                                            No job history found
                                        </p>
                                        <p className="text-gray-500 text-sm mb-4">
                                            You haven't applied to any jobs yet.
                                            Start exploring opportunities!
                                        </p>
                                        <button
                                            onClick={() =>
                                                dispatch(fetchJobHistory())
                                            }
                                            className="px-4 py-2 bg-[#0F9297] text-white rounded hover:bg-[#0d7b7f] transition-colors"
                                        >
                                            Refresh
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {transformedJobData.length > 0 && (
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
                        <span className="text-[13px] text-[#8c91a0]">
                            Showing {startIndex + 1} to{' '}
                            {Math.min(endIndex, totalItems)} of {totalItems}{' '}
                            entries
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, index) => (
                                <React.Fragment key={index}>
                                    {page === '...' ? (
                                        <span className="px-2 py-1 text-[13px] text-[#8c91a0]">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`px-3 py-1 text-[13px] rounded ${
                                                currentPage === page
                                                    ? 'bg-[#0F9297] text-white'
                                                    : 'dark:text-[white] light:text-[#25324B]'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobHistoryTable
