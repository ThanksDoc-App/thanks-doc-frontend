import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from 'lucide-react'
// ✅ Import from your main store, not the doctor-specific store
import { useAppDispatch, useAppSelector } from '@/store' // Update this path to your main store
import {
    fetchDoctors,
    selectDoctors,
    selectDoctorsLoading,
    selectDoctorsError,
} from '../store/doctorSlice' // Update this path to match your doctorSlice location
import SkeletonTable from '@/components/shared/SkeletonTable'

const DoctorTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // Redux state
    const doctorsData = useAppSelector(selectDoctors)
    const loading = useAppSelector(selectDoctorsLoading)
    const error = useAppSelector(selectDoctorsError)

    // Local state for pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showDropdown, setShowDropdown] = useState(false)

    // Fetch doctors on component mount
    useEffect(() => {
        console.log('🚀 DoctorTable mounted - dispatching fetchDoctors')
        dispatch(fetchDoctors())
    }, [dispatch])

    // Transform API data to match original table structure
    const DoctorJob = doctorsData.map((doctor, index) => ({
        id: doctor._id || index,
        name: doctor.name || 'N/A',
        date: doctor.createdAt
            ? new Date(doctor.createdAt).toLocaleDateString()
            : 'N/A',
        payement: doctor.experience ? `${doctor.experience} years exp` : 'N/A',
        jobs: doctor.specialization || 'Not specified',
    }))

    // console.log('🔄 Transformed DoctorJob data:', DoctorJob)

    // Calculate pagination
    const totalItems = DoctorJob.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = DoctorJob.slice(startIndex, endIndex)

    // Handle doctor row click
    const handleDoctorClick = (doctorId: any) => {
        navigate(`/app/crm/doctor/${doctorId}`)
    }

    // Handle page change
    const handlePageChange = (page: any) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    // Handle items per page change
    const handleItemsPerPageChange = (items: any) => {
        setItemsPerPage(items)
        setCurrentPage(1)
        setShowDropdown(false)
    }

    // Generate page numbers to display
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

    // Show skeleton loader when loading
    if (loading && DoctorJob.length === 0) {
        return <SkeletonTable />
    }

    // Error state
    if (error && DoctorJob.length === 0) {
        return (
            <div className="w-full mx-auto bg-white">
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="text-red-500 mb-4">Error: {error}</div>
                    <button
                        onClick={() => dispatch(fetchDoctors())}
                        className="px-4 py-2 bg-[#0F9297] text-white rounded hover:bg-[#0d7b7f]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full mx-auto bg-white">
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto bg-white scrollbar-hidden">
                <table className="min-w-[700px] w-full border border-[#D6DDEB]">
                    <thead className="border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Doctors name
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Date Joined
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Total payment
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Jobs applied
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((doc, index) => (
                            <tr
                                key={doc.id || index}
                                onClick={() =>
                                    handleDoctorClick(doc.id || index)
                                }
                                className={`hover:bg-gray-50 text-[#25324B] text-[13px] whitespace-nowrap cursor-pointer transition-colors ${
                                    (index + 1) % 2 === 0 ? 'bg-[#F8F8FD]' : ''
                                }`}
                            >
                                <td className="px-6 py-4">{doc.name}</td>
                                <td className="px-6 py-4">{doc.date}</td>
                                <td className="px-6 py-4">{doc.payement}</td>
                                <td className="px-6 py-4">{doc.jobs}</td>
                                <td className="px-6 py-4">
                                    <button
                                        className="p-1 hover:bg-gray-200 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // Add your menu logic here
                                        }}
                                    >
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
                {/* Left side - View dropdown */}
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

                {/* Right side - Page navigation */}
                <div className="flex items-center gap-2">
                    {/* Previous button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <span className="px-2 py-1 text-[13px] text-[#8c91a0]">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 text-[13px] rounded ${
                                            currentPage === page
                                                ? 'bg-[#0F9297] text-white'
                                                : 'text-[#25324B] hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Next button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DoctorTable
