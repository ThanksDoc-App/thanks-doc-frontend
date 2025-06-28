import { MoreHorizontal, X } from 'lucide-react'
import React, { useState } from 'react'

const adminData = [
    { name: 'Dr James Doe', email: 'jamesdoe@gmail.com' },
    { name: 'Dr James Doe', email: 'jamesdoe@gmail.com' },
    { name: 'Dr James Doe', email: 'jamesdoe@gmail.com' },
]

const RolesPermission = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    })

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = () => {
        // Handle form submission here
        console.log('Form data:', formData)
        // Reset form and close modal
        setFormData({ name: '', email: '' })
        setIsModalOpen(false)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setFormData({ name: '', email: '' })
    }

    return (
        <div>
            <div className="flex justify-end pb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0F9297] h-[36px] text-white rounded-md font-medium text-[13px] px-7 transition-colors hover:bg-[#0d7e83]"
                >
                    Add user
                </button>
            </div>

            <div>
                <table className="min-w-[700px] w-full border border-[#D6DDEB]">
                    <thead className="border-b border-gray-200">
                        <tr className="">
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Admin name
                            </th>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Email address
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminData.map((ad, index) => (
                            <tr
                                key={index}
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
                <div className="fixed inset-0 bg-[#2155A329]  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-[470px]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[17px] font-semibold text-[#272D37]">
                                Add user{' '}
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
                                    className="w-full px-3 py-1.5 border placeholder:text-[#272D37] border-[#D0D5DD] rounded-md text-[12px] outline-0"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-[12px] font-[500] text-[#344054] mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="james@thanksdoc.com"
                                    className="w-full px-3 py-1.5 placeholder:text-[#272D37] border border-[#D0D5DD] rounded-md text-[12px] outline-0"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-[#0F9297] text-white px-6 py-2 rounded-md text-[13px] font-medium hover:bg-[#0d7e83] transition-colors w-full"
                                >
                                    Add
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
