import React, { useState } from 'react'
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'

const JobHistoryTable = () => {
    const [currentPage, setCurrentPage] = useState(1)

    const jobData = [
        {
            id: 1,
            company: 'Nomad Health',
            role: 'Menopause specialist',
            dateApplied: '24 July 2021',
            status: 'In Review',
        },
        {
            id: 2,
            company: 'Nomad Health',
            role: 'Menopause specialist',
            dateApplied: '20 July 2021',
            status: 'In Review',
        },
        {
            id: 3,
            company: 'Nomad Health',
            role: 'Menopause specialist',
            dateApplied: '16 July 2021',
            status: 'Completed',
        },
        {
            id: 4,
            company: 'Nomad Health',
            role: 'Menopause specialist',
            dateApplied: '14 July 2021',
            status: 'Completed',
        },
        {
            id: 5,
            company: 'Nomad Health',
            role: 'Menopause specialist',
            dateApplied: '10 July 2021',
            status: 'Completed',
        },
    ]

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-2 py-1 rounded-full text-[12px] font-semibold'

        if (status === 'In Review') {
            return `${baseClasses} text-[#FFB836] border border-[#FFB836]`
        } else if (status === 'Completed') {
            return `${baseClasses} text-[#0F9297] border border-[#0F9297]`
        }
        return baseClasses
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
                                key={job.id}
                                className={`hover:bg-gray-50 text-[#25324B] text-[13px] ${
                                    (index + 1) % 2 === 0 ? 'bg-[#F8F8FD]' : ''
                                }`}
                            >
                                <td className="px-6 py-4">{job.id}</td>
                                <td className="px-6 py-4">{job.company}</td>
                                <td className="px-6 py-4">{job.role}</td>
                                <td className="px-6 py-4">{job.dateApplied}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={getStatusBadge(job.status)}
                                    >
                                        {job.status}
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
        </div>
    )
}

export default JobHistoryTable
