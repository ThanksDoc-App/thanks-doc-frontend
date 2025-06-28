import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import type { AppDispatch, RootState } from '@/store'
import { clearServiceError, createService } from '../store'

const CrmCreateService = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    // Update 'crmDashboard' to the correct slice name as defined in your RootState, e.g., 'crm'
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

        if (serviceError) {
            dispatch(clearServiceError())
        }
    }

    const showErrorToast = (error: any) => {
        if (error?.message && Array.isArray(error.message)) {
            error?.message.forEach((msg: string) => {
                toast.error(msg)
            })
        } else if (typeof error === 'string') {
            toast.error(error)
        } else if (error?.message) {
            toast.error(error.message)
        } else {
            toast.error('An unexpected error occurred')
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
                toast.success('Service created successfully!')
                setFormData({ category: '', name: '' })
                navigate('/app/crm/service')
            } else if (createService.rejected.match(result)) {
                showErrorToast(result.payload || result.error)
            }
        } catch (error) {
            console.error('Failed to create service:', error)
            showErrorToast(error)
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
