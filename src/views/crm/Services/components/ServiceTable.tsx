import React, { useState, useEffect } from 'react'
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Loader2,
    Edit3,
    Trash2,
    Eye,
    X,
} from 'lucide-react'
import { useAppDispatch, useAppSelector, RootState } from '../store'
import {
    fetchServices,
    deleteService,
    selectServices,
    selectServicesLoading,
    selectServicesError,
    selectDeleteLoading,
    selectDeleteError,
} from '../store/servicesSlice'
import type { Service } from '../store/servicesSlice'
import SkeletonTable from '@/components/shared/SkeletonTable'

const ServiceTable: React.FC = () => {
    const dispatch = useAppDispatch()
    const services = useAppSelector(selectServices)
    const loading = useAppSelector(selectServicesLoading)
    const error = useAppSelector(selectServicesError)
    const deleteLoading = useAppSelector(selectDeleteLoading)
    const deleteError = useAppSelector(selectDeleteError)

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showDropdown, setShowDropdown] = useState(false)
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const [selectedService, setSelectedService] = useState<Service | null>(null)

    // Fetch services once
    useEffect(() => {
        dispatch(fetchServices())
    }, [dispatch])

    const servicesArray = Array.isArray(services) ? services : []

    const totalItems = servicesArray.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentData = servicesArray.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

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

    const handleActionClick = (service: Service, action: string) => {
        setSelectedService(service)
        setActiveModal(action)
    }

    const closeModal = () => {
        setActiveModal(null)
        setSelectedService(null)
    }

    const handleDelete = async () => {
        if (selectedService) {
            try {
                await dispatch(deleteService(selectedService._id)).unwrap()
                closeModal()
            } catch (error) {
                // Error is handled by the store
                console.error('Delete failed:', error)
            }
        }
    }

    const getPageNumbers = () => {
        const pages: (number | '...')[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(
                    1,
                    '...',
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages,
                )
            } else {
                pages.push(
                    1,
                    '...',
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    '...',
                    totalPages,
                )
            }
        }

        return pages
    }

    if (loading) {
        return <SkeletonTable />
    }

    if (error) {
        return (
            <div className="w-full mx-auto flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Error loading services</p>
                    <p className="text-[#8c91a0] text-sm">{String(error)}</p>
                    <button
                        onClick={() => dispatch(fetchServices())}
                        className="mt-4 px-4 py-2 bg-[#0F9297] text-white rounded hover:bg-[#0d7f84] text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (servicesArray.length === 0) {
        return (
            <div className="w-full mx-auto flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-[#8c91a0]">No services found</p>
                    <button
                        onClick={() => dispatch(fetchServices())}
                        className="mt-4 px-4 py-2 bg-[#0F9297] text-white rounded hover:bg-[#0d7f84] text-sm"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full mx-auto bg-white relative">
            <div className="overflow-x-auto scrollbar-hidden">
                <table className="min-w-[700px] w-full border border-[#D6DDEB]">
                    <thead className="border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Service
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Category
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Price
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((service, index) => (
                            <tr
                                key={service._id}
                                className={`hover:bg-gray-50 text-[#25324B] text-[13px] whitespace-nowrap ${
                                    index % 2 === 1 ? 'bg-[#F8F8FD]' : ''
                                }`}
                            >
                                <td className="px-6 py-4">
                                    {String(service.name || '')}
                                </td>
                                <td className="px-6 py-4">
                                    {service.category?.name}
                                </td>
                                <td className="px-6 py-4">
<<<<<<< HEAD
                                    {String(service.price || '')}
=======
                                    <div className="flex items-center gap-1">
                                        <div> {service.price}</div>
                                        <div> {service.currency}</div>{' '}
                                    </div>
>>>>>>> 038235a1ce62b459240e526582b5511e1304fd65
                                </td>
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded"
                                            onClick={() =>
                                                handleActionClick(
                                                    {
                                                        ...service,
                                                        _id: String(
                                                            service._id,
                                                        ),
                                                        category:
                                                            service.category
                                                                ._id, // ← extract string ID
                                                    },
                                                    'menu',
                                                )
                                            }
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>

                                        {activeModal === 'menu' &&
                                            selectedService?._id ===
                                                service._id && (
                                                <div className="absolute right-0 top-0 bg-white border border-[#D6DDEB] rounded-lg shadow-lg z-50 min-w-[120px]">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() =>
                                                                handleActionClick(
                                                                    {
                                                                        ...service,
                                                                        _id: String(
                                                                            service._id,
                                                                        ),
                                                                        category:
                                                                            service
                                                                                .category
                                                                                ._id, // ← extract string ID
                                                                    },
                                                                    'delete',
                                                                )
                                                            }
                                                            className="flex items-center gap-3 w-full px-4 py-2 text-[13px] text-[#25324B] hover:bg-gray-50"
                                                        >
                                                            Delete service
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {activeModal === 'delete' && (
                <div className="fixed inset-0 bg-[#2155A329] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#25324B]">
                                Delete service
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-[#8c91a0] mb-6">
                            Are you sure you want to delete "
                            {selectedService?.name}"? This action cannot be
                            undone.
                        </p>
                        {deleteError && (
                            <p className="text-red-500 text-sm mb-4">
                                {String(deleteError)}
                            </p>
                        )}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-[#25324B] border border-[#D6DDEB] rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {deleteLoading && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between px-6 py-4 border border-[#D6DDEB] bg-white">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#8c91a0]">View</span>
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown((prev) => !prev)}
                            className="flex items-center gap-1 px-3 py-1 text-[13px] text-[#25324B] border border-[#D6DDEB] rounded bg-white hover:bg-gray-50"
                        >
                            {itemsPerPage} <ChevronDown className="w-4 h-4" />
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
                        className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    …
                                </span>
                            ) : (
                                <button
                                    key={idx}
                                    onClick={() =>
                                        handlePageChange(page as number)
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
                        className="p-2 text-[#8c91a0] hover:text-[#25324B] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ServiceTable
