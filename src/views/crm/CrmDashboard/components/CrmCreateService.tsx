import { Button } from '@/components/ui'
import React, { useState, useEffect } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import type { RootState } from '@/store'
import { clearServiceError, createService } from '../store'
import { useAppDispatch } from '@/store'
import {
    categoryStorage,
    type Category,
} from '../../Category/store/categoryStorage'

const CrmCreateService = ({ className }: any) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { serviceError = null } = useSelector(
        (state: RootState) => state.adminDashboard || {},
    )

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        category: '',
        name: '',
        price: '',
        currency: 'GBP',
    })

    const [categories, setCategories] = useState<Category[]>([])

    // Load categories from localStorage on component mount
    useEffect(() => {
        const storedCategories = categoryStorage.getCategories()
        setCategories(storedCategories)
    }, [])

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

        if (
            !formData.name.trim() ||
            !formData.price.trim() ||
            !formData.category.trim()
        ) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            const serviceData = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                currency: formData.currency,
            }

            const result = await dispatch(createService(serviceData))

            if (createService.fulfilled.match(result)) {
                toast.success('Service created successfully!')
                setFormData({
                    category: '',
                    name: '',
                    price: '',
                    currency: 'GBP',
                })
                navigate('/app/crm/service')
            } else if (createService.rejected.match(result)) {
                showErrorToast(result.payload || result.error)
            }
        } catch (error) {
            console.error('Failed to create service:', error)
            showErrorToast(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="">
                <Button
                    variant="solid"
                    className="flex items-center justify-center gap-2 border-0"
                    onClick={() => navigate(-1)}
                >
                    <IoMdArrowRoundBack
                        size={20}
                        className="text-[#25324B] dark:text-white"
                    />
                    <span className="text-[#25324B] dark:text-white ">
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
                            required
                            disabled={isSubmitting}
                        >
                            <option value="">Select a category</option>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>
                                ))
                            ) : (
                                <option>No category yet</option>
                            )}
                        </select>
                        {categories.length === 0 && (
                            <p className="text-[#8c91a0] text-xs mt-1">
                                No category yet
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[#515B6F] font-[15px] font-[600]">
                            Service Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter service name"
                            className="border-[#D6DDEB] border placeholder:text-[#A8ADB7] text-[13px] h-[40px] pl-2 outline-0"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[#515B6F] font-[15px] font-[600]">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                            className="border-[#D6DDEB] border placeholder:text-[#A8ADB7] text-[13px] h-[40px] pl-2 outline-0"
                            required
                            min="0"
                            step="0.01"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[#515B6F] font-[15px] font-[600]">
                            Currency
                        </label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="border-[#D6DDEB] border placeholder:text-[#A8ADB7] text-[13px] h-[40px] pl-1.5 outline-0 text-gray-500 cursor-not-allowed"
                            required
                            disabled
                        >
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        variant="solid"
                        className="w-[207px] mt-4"
                        disabled={
                            isSubmitting ||
                            !formData.name.trim() ||
                            !formData.price.trim() ||
                            !formData.category.trim()
                        }
                    >
                        {isSubmitting ? 'Creating...' : 'Create a service'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CrmCreateService
