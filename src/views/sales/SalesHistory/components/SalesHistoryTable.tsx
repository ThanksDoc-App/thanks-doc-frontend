import React, { useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    MoreHorizontal,
} from 'lucide-react'

const salesData = [
    {
        id: 1,
        jobs: 'Surgery',
        status: 'Active',
        date: '2023-05-23',
        amount: '$7,000',
        doctor: 'Dr. Khalifa Bello',
    },
    {
        id: 2,
        jobs: 'Dentist',
        status: 'Closed',
        date: '2023-06-15',
        amount: '$4,500',
        doctor: 'Dr. Seyi Adeniyi',
    },
    {
        id: 3,
        jobs: 'Cardiology',
        status: 'Active',
        date: '2023-07-10',
        amount: '$8,200',
        doctor: 'Dr. Alice Johnson',
    },
    {
        id: 4,
        jobs: 'Neurology',
        status: 'Closed',
        date: '2023-08-01',
        amount: '$9,000',
        doctor: 'Dr. Michael Smith',
    },
    {
        id: 5,
        jobs: 'Orthopedics',
        status: 'Active',
        date: '2023-09-14',
        amount: '$5,600',
        doctor: 'Dr. Emma Brown',
    },
    {
        id: 6,
        jobs: 'Pediatrics',
        status: 'Closed',
        date: '2023-10-22',
        amount: '$3,400',
        doctor: 'Dr. Daniel Lee',
    },
    {
        id: 7,
        jobs: 'Oncology',
        status: 'Active',
        date: '2023-11-30',
        amount: '$10,500',
        doctor: 'Dr. Sophia Martinez',
    },
    {
        id: 8,
        jobs: 'Dermatology',
        status: 'Closed',
        date: '2023-12-05',
        amount: '$2,800',
        doctor: 'Dr. William Anderson',
    },
    {
        id: 9,
        jobs: 'Psychiatry',
        status: 'Active',
        date: '2024-01-18',
        amount: '$6,200',
        doctor: 'Dr. Olivia Taylor',
    },
    {
        id: 10,
        jobs: 'Radiology',
        status: 'Closed',
        date: '2024-02-27',
        amount: '$7,800',
        doctor: 'Dr. James Wilson',
    },
    {
        id: 11,
        jobs: 'Anesthesiology',
        status: 'Active',
        date: '2024-03-10',
        amount: '$5,900',
        doctor: 'Dr. Mia Thompson',
    },
    {
        id: 12,
        jobs: 'Gastroenterology',
        status: 'Closed',
        date: '2024-04-12',
        amount: '$6,700',
        doctor: 'Dr. Benjamin White',
    },
    {
        id: 13,
        jobs: 'Nephrology',
        status: 'Active',
        date: '2024-05-20',
        amount: '$9,100',
        doctor: 'Dr. Charlotte Harris',
    },
    {
        id: 14,
        jobs: 'Urology',
        status: 'Closed',
        date: '2024-06-01',
        amount: '$4,900',
        doctor: 'Dr. Lucas Martin',
    },
    {
        id: 15,
        jobs: 'Ophthalmology',
        status: 'Active',
        date: '2024-07-08',
        amount: '$3,300',
        doctor: 'Dr. Amelia Clark',
    },
    {
        id: 16,
        jobs: 'ENT',
        status: 'Closed',
        date: '2024-08-22',
        amount: '$2,500',
        doctor: 'Dr. Henry Lewis',
    },
    {
        id: 17,
        jobs: 'Rheumatology',
        status: 'Active',
        date: '2024-09-30',
        amount: '$6,600',
        doctor: 'Dr. Grace Walker',
    },
    {
        id: 18,
        jobs: 'Pathology',
        status: 'Closed',
        date: '2024-10-10',
        amount: '$7,300',
        doctor: 'Dr. Ethan Hall',
    },
]

const SalesHistory = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [showDropdown, setShowDropdown] = useState(false)

    const totalItems = salesData.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = salesData.slice(startIndex, endIndex)

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
        if (status === 'Active')
            return `${baseClasses} text-[#FF9500] border border-[#FF9500]`
        if (status === 'Closed')
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
                                Doctor in charge{' '}
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`hover:bg-gray-50 text-[#25324B] text-[13px] whitespace-nowrap ${
                                    index % 2 === 1 ? 'bg-[#F8F8FD]' : ''
                                }`}
                            >
                                <td className="px-6 py-4">{item.jobs}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={getStatusBadge(item.status)}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4">{item.amount}</td>
                                <td className="px-6 py-4">{item.doctor}</td>
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
                        disabled={currentPage === totalPages}
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
