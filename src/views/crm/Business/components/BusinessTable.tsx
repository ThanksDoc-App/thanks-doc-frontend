import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from 'lucide-react'
// ✅ Import from your main store
import { useAppDispatch, useAppSelector } from '@/store' // Update this path to your main store
import {
    fetchBusinesses,
    selectBusinesses,
    selectBusinessesLoading,
    selectBusinessesError,
} from '../store/businessSlice' // Update this path to match your businessSlice location
import SkeletonTable from '@/components/shared/SkeletonTable'

// ✅ Error Boundary Component
class TableErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Table rendering error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-red-500 bg-red-50 rounded">
                    <h3>Something went wrong with the table rendering.</h3>
                    <p className="text-sm mt-2">{this.state.error?.message}</p>
                    <button
                        onClick={() =>
                            this.setState({ hasError: false, error: null })
                        }
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Try Again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

const BusinessTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // Redux state
    const businessesData = useAppSelector(selectBusinesses)
    const loading = useAppSelector(selectBusinessesLoading)
    const error = useAppSelector(selectBusinessesError)

    // Local state for pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showDropdown, setShowDropdown] = useState(false)

    // Fetch businesses on component mount
    useEffect(() => {
        console.log('🚀 BusinessTable mounted - dispatching fetchBusinesses')
        dispatch(fetchBusinesses())
    }, [dispatch])

    // ✅ Debug logging to understand data structure
    useEffect(() => {
        console.log('📊 Raw businesses data:', businessesData)
        if (businessesData && businessesData.length > 0) {
            console.log('📊 First business object:', businessesData[0])
            console.log('📊 Address field:', businessesData[0].address)
            console.log('📊 Location field:', businessesData[0].location)
        }
    }, [businessesData])

    // ✅ Helper function to safely extract address
    const extractAddress = (business: any): string => {
        // Handle address field
        if (business.address) {
            if (typeof business.address === 'string') {
                return business.address
            }
            if (typeof business.address === 'object' && business.address) {
                return (
                    business.address.address1 ||
                    business.address.street ||
                    business.address.city ||
                    business.address.full ||
                    'Address not specified'
                )
            }
        }

        // Handle location field
        if (business.location) {
            if (typeof business.location === 'string') {
                return business.location
            }
            if (typeof business.location === 'object' && business.location) {
                return (
                    business.location.address1 ||
                    business.location.street ||
                    business.location.city ||
                    business.location.full ||
                    'Location not specified'
                )
            }
        }

        return 'Not specified'
    }

    // ✅ Helper function to safely convert values to strings
    const safeString = (value: any): string => {
        if (value === null || value === undefined) {
            return 'N/A'
        }
        if (typeof value === 'string') {
            return value
        }
        if (typeof value === 'number') {
            return value.toString()
        }
        if (typeof value === 'object') {
            // If it's an object, try to extract meaningful data
            if (value.name) return value.name
            if (value.title) return value.title
            if (value.value) return value.value
            return 'N/A'
        }
        return String(value)
    }

    // ✅ Transform API data to match original table structure with proper error handling
    const BusinessJob = React.useMemo(() => {
        if (!businessesData || !Array.isArray(businessesData)) {
            return []
        }

        return businessesData.map((business, index) => {
            try {
                return {
                    id: business._id || business.id || index,
                    name: safeString(business.name || business.businessName),
                    date: business.createdAt
                        ? new Date(business.createdAt).toLocaleDateString()
                        : business.dateJoined
                          ? new Date(business.dateJoined).toLocaleDateString()
                          : 'N/A',
                    address: extractAddress(business),
                    jobs: business.jobsPosted
                        ? `${business.jobsPosted} jobs`
                        : business.totalJobs
                          ? `${business.totalJobs} jobs`
                          : 'No jobs posted',
                }
            } catch (err) {
                console.error(
                    'Error transforming business data:',
                    err,
                    business,
                )
                return {
                    id: index,
                    name: 'Error loading business',
                    date: 'N/A',
                    address: 'N/A',
                    jobs: 'N/A',
                }
            }
        })
    }, [businessesData])

    console.log('🔄 Transformed BusinessJob data:', BusinessJob)

    // Calculate pagination
    const totalItems = BusinessJob.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = BusinessJob.slice(startIndex, endIndex)

    // Handle business row click
    const handleBusinessClick = (businessId: any) => {
        navigate(`/app/crm/business/${businessId}`)
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
        setCurrentPage(1) // Reset to first page
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

    // Loading state
    if (loading && BusinessJob.length === 0) {
        return <SkeletonTable />
    }

    // Error state
    if (error && BusinessJob.length === 0) {
        return (
            <div className="w-full mx-auto bg-white">
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="text-red-500 mb-4">Error: {error}</div>
                    <button
                        onClick={() => dispatch(fetchBusinesses())}
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
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16 whitespace-nowrap">
                                Business name
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16 whitespace-nowrap">
                                Date Joined
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16 whitespace-nowrap">
                                Address
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16 whitespace-nowrap">
                                Jobs posted
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((bus, index) => (
                            <tr
                                key={bus.id || index}
                                onClick={() =>
                                    handleBusinessClick(bus.id || index)
                                }
                                className={`hover:bg-gray-50 text-[#25324B] text-[13px] whitespace-nowrap cursor-pointer transition-colors ${
                                    (index + 1) % 2 === 0 ? 'bg-[#F8F8FD]' : ''
                                }`}
                            >
                                {/* ✅ Safe string rendering with fallbacks */}
                                <td className="px-6 py-4">
                                    {safeString(bus.name)}
                                </td>
                                <td className="px-6 py-4">
                                    {safeString(bus.date)}
                                </td>
                                <td className="px-6 py-4">
                                    {safeString(bus.address)}
                                </td>
                                <td className="px-6 py-4">
                                    {safeString(bus.jobs)}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        className="p-1 hover:bg-gray-200 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation() // Prevent row click when clicking menu
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

// ✅ Wrapped component with error boundary
const WrappedBusinessTable = () => {
    return (
        <TableErrorBoundary>
            <BusinessTable />
        </TableErrorBoundary>
    )
}

export default WrappedBusinessTable
