import React, { useState, useEffect } from 'react'
import { apiAddAdmin, apiGetAdmins } from '@/services/CommonService'
import { MoreHorizontal, X, Eye, EyeOff } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SkeletonTable from '@/components/shared/SkeletonTable'

const RolesPermission = () => {
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
        <div className="w-full">
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
            <div className="overflow-x-auto bg-white rounded-md border border-[#D6DDEB]">
                <table className="min-w-[600px] w-full">
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
                        {admins.map((ad, index) => (
                            <tr
                                key={ad.id}
                                className={`hover:bg-gray-50 text-[#25324B] text-[13px] whitespace-nowrap ${
                                    (index + 1) % 2 === 0 ? 'bg-[#F8F8FD]' : ''
                                }`}
                            >
                                <td className="px-6 py-4">{ad.name}</td>
                                <td className="px-6 py-4">{ad.email}</td>
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

                            <div className="mb-6 relative">
                                <label className="block text-[12px] font-[500] text-[#344054] mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-md text-[13px] outline-0 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
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
