import React, { useState, useEffect } from 'react'
import { apiAddAdmin, apiGetAdmins } from '@/services/CommonService'
import {
    MoreHorizontal,
    X,
    Eye,
    EyeOff,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SkeletonTable from '@/components/shared/SkeletonTable'

const RolesPermission = ({ className }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'Password@123',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [admins, setAdmins] = useState<
        { id: string; name: string; email: string }[]
    >([])
    const [loadingAdmins, setLoadingAdmins] = useState(true)

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showDropdown, setShowDropdown] = useState(false)

    type AdminUser = { _id: string; name: string; email: string }
    type AdminsResponse = { users: AdminUser[] }

    const fetchAdmins = async () => {
        setLoadingAdmins(true)
        try {
            const response = await apiGetAdmins()
            if (response.data?.data?.users) {
                setAdmins(
                    response.data.data.users.map((user: AdminUser) => ({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                    })),
                )
            }
        } catch (err) {
            console.error('Failed to fetch admins', err)
            toast.error('Failed to load admin list')
        } finally {
            setLoadingAdmins(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    // Pagination calculations
    const totalItems = admins.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = admins.slice(startIndex, endIndex)

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields')
            toast.error('Please fill in all fields')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await apiAddAdmin(formData)

            if (response.status) {
                setFormData({ name: '', email: '', password: 'Password@123' })
                setIsModalOpen(false)
                toast.success('Admin added successfully!')
                fetchAdmins()
            } else {
                const errorMsg = response.data.message || 'Failed to add admin'
                setError(errorMsg)
                toast.error(errorMsg)
            }
        } catch (err) {
            const errorMsg = 'An error occurred while adding admin'
            setError(errorMsg)
            toast.error(errorMsg)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setFormData({ name: '', email: '', password: 'Password@123' })
        setError('')
    }

    if (loadingAdmins) {
        return <SkeletonTable />
    }

    return (
        <div className={`w-full mx-auto relative ${className}`}>
            <ToastContainer />

            {/* Add user button */}
            <div className="flex justify-end pb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0F9297] h-[36px] text-white rounded-md font-medium text-[13px] px-6 transition-colors hover:bg-[#0d7e83]"
                >
                    Add user
                </button>
            </div>

            {/* Table container */}
            <div className="overflow-x-auto scrollbar-hidden">
                <table className="min-w-[600px] w-full border border-[#D6DDEB]">
                    <thead className="border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                Admin name
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0]">
                                Email address
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((ad, index) => (
                            <tr
                                key={ad.id}
                                className={`text-[13px] whitespace-nowrap cursor-pointer transition-colors ${
                                    (index + 1) % 2 === 0
                                        ? 'bg-[#F8F8FD] dark:bg-transparent'
                                        : ''
                                }`}
                            >
                                <td className="px-6 py-4">{ad.name}</td>
                                <td className="px-6 py-4">{ad.email}</td>
                                <td className="px-6 py-4">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {admins.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border border-[#D6DDEB] border-t-0">
                    {/* View dropdown */}
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
                                                : 'dark:text-[white] light:text-[#25324B] hover:bg-gray-100'
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
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#2155A329] bg-opacity-30 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-[17px] font-semibold text-[#272D37]">
                                Add user
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5 text-[#272D37]" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <div>
                            {error && (
                                <div className="mb-4 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-[12px] font-[500] text-[#344054] mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="James Doe"
                                    className="w-full px-3 py-2 border placeholder:text-[#272D37] border-[#D0D5DD] rounded-md text-[13px] outline-0"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[12px] font-[500] text-[#344054] mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="james@thanksdoc.com"
                                    className="w-full px-3 py-2 placeholder:text-[#272D37] border border-[#D0D5DD] rounded-md text-[13px] outline-0"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="bg-[#0F9297] text-white px-6 py-2 rounded-md text-[13px] font-medium hover:bg-[#0d7e83] transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RolesPermission
