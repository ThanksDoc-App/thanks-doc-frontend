import React, { useState, useEffect } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    MoreHorizontal,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchJobHistory,
    selectJobHistory,
    selectJobHistoryLoading,
    selectJobHistoryError,
} from '../store/jobHistorySlice' // Adjust import path based on your file structure

const SalesHistory = () => {
    const dispatch = useAppDispatch()
    const jobs = useAppSelector(selectJobHistory)
    const loading = useAppSelector(selectJobHistoryLoading)
    const error = useAppSelector(selectJobHistoryError)

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [showDropdown, setShowDropdown] = useState(false)

    // Fetch jobs from Redux on component mount
    useEffect(() => {
        dispatch(fetchJobHistory())
    }, [dispatch])

    // Use Redux data instead of empty salesData
    const totalItems = jobs.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = jobs.slice(startIndex, endIndex)

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

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-3 py-1.5 rounded-full text-[12px] font-semibold'
        if (status === 'Accepted' || status === 'accepted')
            return `${baseClasses} text-[#FF9500] border border-[#FF9500]`
        if (status === 'Closed' || status === 'closed')
            return `${baseClasses} text-[#FF6550] border border-[#FF6550]`
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

    // Format date helper
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString()
    }

    // Show loading state
    if (loading) {
        return (
            <div className="w-full bg-white rounded-lg p-8 text-center">
                <div className="text-gray-500">Loading jobs...</div>
            </div>
        )
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

    return (
        <div className="w-full bg-white rounded-lg">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full border border-gray-200">
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
                                    className={`hover:bg-gray-50 text-[#25324B] text-[13px] whitespace-nowrap ${
                                        index % 2 === 1 ? 'bg-[#F8F8FD]' : ''
                                    }`}
                                >
                                    <td className="px-6 py-4">{item.name}</td>
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
                                            <p> {item?.amount}</p>{' '}
                                            <p> {item?.currency}</p>{' '}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.doctor?.name ||
                                            item.doctor ||
                                            'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-1">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border border-[#D6DDEB] bg-white">
                {/* Items per page */}
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

                {/* Page navigation */}
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
                                    className="px-2 py-1 text-[13px] text-[#8c91a0]"
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
                                            : 'text-[#25324B] hover:bg-gray-100'
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
    )
}

export default SalesHistory
