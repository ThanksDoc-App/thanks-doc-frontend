import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store' // Adjust import path as needed
import { clearCategoryError, createCategory } from '../store'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store' // Adjust the path if your RootState is defined elsewhere
// Alternative toast imports (choose one based on your setup):
import { toast } from 'react-toastify'
// import { useToast } from '@/components/ui/use-toast'

const CrmCreateCategory = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [categoryName, setCategoryName] = useState('')

    const { categoryLoading = false, categoryError = null } = useSelector(
        (state: RootState) => state.adminDashboard || {},
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!categoryName.trim()) {
            return
        }

        try {
            const result = await dispatch(
                createCategory({ name: categoryName.trim() }),
            )

            if (createCategory.fulfilled.match(result)) {
                // Success - show toast message
                toast.success('Category created successfully!')

                setCategoryName('')
                navigate(-1) // Go back to previous page
            }
        } catch (error) {
            // Error handling is managed by Redux
            console.error('Failed to create category:', error)
            // Optional: Show error toast
            toast.error('Failed to create category. Please try again.')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value)
        // Clear error when user starts typing
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
                        disabled={categoryLoading}
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
                        disabled={categoryLoading || !categoryName.trim()}
                    >
                        {categoryLoading ? 'Creating...' : 'Create a category'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CrmCreateCategory
