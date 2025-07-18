import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store' // Adjust import path as needed
import { clearCategoryError, createCategory } from '../store'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { toast } from 'react-toastify'

const CrmCreateCategory = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [categoryName, setCategoryName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { categoryError = null } = useSelector(
        (state: RootState) => state.adminDashboard || {},
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!categoryName.trim()) return

        setIsSubmitting(true)

        try {
            const result = await dispatch(
                createCategory({ name: categoryName.trim() }),
            )

            if (createCategory.fulfilled.match(result)) {
                toast.success('Category created successfully!')
                setCategoryName('')
                navigate(-1)
            }
        } catch (error) {
            toast.error('Failed to create category. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value)

        if (categoryError) {
            dispatch(clearCategoryError())
        }
    }

    return (
        <div>
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
                        Create category
                    </span>
                </Button>
            </div>

            <div className="mt-7">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <label className="text-[#515B6F] font-[15px] font-[600]">
                        Enter Job Categories
                    </label>
                    <input
                        type="text"
                        placeholder="Enter a Category"
                        value={categoryName}
                        onChange={handleInputChange}
                        className="border-[#D6DDEB] border placeholder:text-[#A8ADB7] text-[13px] h-[40px] pl-2 outline-0"
                        disabled={isSubmitting}
                    />
                    {categoryError && (
                        <span className="text-red-500 text-sm">
                            {categoryError}
                        </span>
                    )}
                    <Button
                        type="submit"
                        variant="solid"
                        className="w-[207px] mt-4"
                        disabled={isSubmitting || !categoryName.trim()}
                    >
                        {isSubmitting ? 'Creating...' : 'Create a category'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CrmCreateCategory
