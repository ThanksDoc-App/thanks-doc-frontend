import React, { useState, useEffect } from 'react'
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store' // Adjust import path as needed
import {
    fetchJobHistory,
    selectJobHistory,
    selectJobHistoryLoading,
    selectJobHistoryError,
} from '../JobHistory/store/jobHistorySlice'

const JobHistoryTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const dispatch = useDispatch()

    // Get data from Redux store
    const jobData = useSelector((state: RootState) => selectJobHistory(state))
    const loading = useSelector((state: RootState) =>
        selectJobHistoryLoading(state),
    )
    const error = useSelector((state: RootState) =>
        selectJobHistoryError(state),
    )

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchJobHistory())
    }, [dispatch])

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-2 py-1 rounded-full text-[12px] font-semibold'

        if (status === 'In Review' || status === 'pending') {
            return `${baseClasses} text-[#FFB836] border border-[#FFB836]`
        } else if (
            status === 'Completed' ||
            status === 'completed' ||
            status === 'active'
        ) {
            return `${baseClasses} text-[#0F9297] border border-[#0F9297]`
        } else if (status === 'rejected' || status === 'cancelled') {
            return `${baseClasses} text-red-500 border border-red-500`
        }
        return baseClasses
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    // Loading state
    if (loading) {
        return (
            <div className="w-full mx-auto bg-white">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                    <span className="ml-2 text-gray-600">
                        Loading job history...
                    </span>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="w-full mx-auto bg-white">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-red-600 mb-2">
                            Error loading job history
                        </p>
                        <p className="text-gray-500 text-sm">{error}</p>
                        <button
                            onClick={() => dispatch(fetchJobHistory())}
                            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Empty state
    if (!jobData || jobData.length === 0) {
        return (
            <div className="w-full mx-auto bg-white">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-gray-600 mb-2">
                            No job history found
                        </p>
                        <button
                            onClick={() => dispatch(fetchJobHistory())}
                            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full mx-auto bg-white ">
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto bg-white rounded-lg scrollbar-hidden">
                <table className="min-w-[700px] w-full">
                    <thead className="border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#202430] w-16">
                                #
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#202430]">
                                Company Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#202430]">
                                Roles
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#202430]">
                                Date Applied
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#202430]">
                                Status
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobData.map((job, index) => (
                            <tr
                                key={job._id}
                                className={`hover:bg-gray-50 text-[#25324B] text-[13px] ${
                                    (index + 1) % 2 === 0 ? 'bg-[#F8F8FD]' : ''
                                }`}
                            >
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">
                                    {job.company || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    {job.title || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    {formatDate(job.createdAt || '')}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={getStatusBadge(
                                            job.status || 'pending',
                                        )}
                                    >
                                        {job.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="p-1">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center mt-6 overflow-x-auto scrollbar-hidden">
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button className="px-3 py-1 bg-teal-500 text-white rounded font-medium">
                        1
                    </button>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                        2
                    </button>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                        3
                    </button>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                        4
                    </button>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                        5
                    </button>
                    <span className="px-2 text-gray-400">...</span>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                        33
                    </button>

                    <button
                        className="p-2 text-gray-600 hover:text-gray-800"
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Refresh Button for Development */}
            <div className="mt-4 text-center">
                <button
                    onClick={() => dispatch(fetchJobHistory())}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
        </div>
    )
}

export default JobHistoryTable
