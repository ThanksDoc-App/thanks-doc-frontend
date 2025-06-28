import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import {
//     createService,
//     clearServiceError,
// } from '@/store/slices/crmDashboardSlice'
import { toast } from 'react-toastify'
import type { AppDispatch, RootState } from '@/store'
import { clearServiceError, createService } from '../store'

const CrmCreateService = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const { serviceLoading = false, serviceError = null } = useSelector(
        (state: RootState) => state.crmDashboard || {},
    )

    const [formData, setFormData] = useState({
        category: '',
        name: '',
    })

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when user starts typing
        if (serviceError) {
            dispatch(clearServiceError())
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            return
        }

        try {
            const result = await dispatch(
                createService({ name: formData.name }),
            )

            if (createService.fulfilled.match(result)) {
                // Success - show toast and navigate
                toast.success('Service created successfully!')
                setFormData({ category: '', name: '' })
                navigate('/app/crm/service')
            }
        } catch (error) {
            // Error is handled by the reducer
            console.error('Failed to create service:', error)
        }
    }

    return (
        <div>
            <div className="ml-[-26px]">
                <Button
                    className="flex items-center justify-center gap-2 border-0"
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack size={30} color="#25324B" />
                    <span className="text-[#25324B] text-[18px]">
                        Create a service
                    </span>
                </Button>
            </div>

            <div className="mt-7">
                {serviceError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {serviceError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#515B6F] font-[15px] font-[600]">
                            Select a Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="border-[#D6DDEB] border placeholder:text-[#A8ADB7] text-[13px] h-[40px] pl-1.5 outline-0"
                        >
                            <option value="">Select a category</option>
                            <option value="engineering">Engineering</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="sales">Sales</option>
                            <option value="product">Product Management</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[#515B6F] font-[15px] font-[600]">
                            Enter Job
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter service title"
                            className="border-[#D6DDEB] border placeholder:text-[#A8ADB7] text-[13px] h-[40px] pl-2 outline-0"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="solid"
                        className="w-[207px] mt-4"
                        disabled={serviceLoading || !formData.name.trim()}
                    >
                        {serviceLoading ? 'Creating...' : 'Create a service'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CrmCreateService
