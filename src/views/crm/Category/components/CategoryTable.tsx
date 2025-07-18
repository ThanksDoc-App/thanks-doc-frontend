import React, { useEffect, useState } from 'react'
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Loader2,
    X,
} from 'lucide-react'
import type { RootState } from '@/store'
import {
    fetchCategories,
    deleteCategory,
    selectCategories,
    selectCategoriesLoading,
    selectCategoriesError,
    selectDeleteLoading,
    selectDeleteError,
} from '../store/categorySlice'
import { useAppDispatch, useAppSelector } from '../store'
import SkeletonTable from '@/components/shared/SkeletonTable'
import { categoryStorage, type Category } from '../store/categoryStorage'
// import { categoryStorage, type Category } from '@/utils/categoryStorage'

const CategoryTable = ({ className }: any) => {
    const dispatch = useAppDispatch()

    // Use the selectors for cleaner code
    const categories = useAppSelector(selectCategories)
    const loading = useAppSelector(selectCategoriesLoading)
    const error = useAppSelector(selectCategoriesError)
    const deleteLoading = useAppSelector(selectDeleteLoading)
    const deleteError = useAppSelector(selectDeleteError)

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [showDropdown, setShowDropdown] = useState(false)
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    )
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    // Save categories to localStorage whenever categories change
    useEffect(() => {
        if (categories && Array.isArray(categories) && categories.length > 0) {
            categoryStorage.saveCategories(categories)
        }
    }, [categories])

    // Ensure categories is always an array
    const categoriesArray = Array.isArray(categories) ? categories : []

    const totalItems = categoriesArray.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = categoriesArray.slice(startIndex, endIndex)

    console.log('categories:', categories)

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

    const handleActionClick = (
        category: Category,
        action: string,
        event?: React.MouseEvent,
    ) => {
        if (event && action === 'menu') {
            const rect = event.currentTarget.getBoundingClientRect()
            const x = Math.min(
                window.innerWidth - 140,
                Math.max(10, rect.left - 40),
            )
            const y = Math.min(
                window.innerHeight - 60,
                Math.max(10, rect.bottom + 5),
            )
            setDropdownPosition({ x, y })
        }
        setSelectedCategory(category)
        setActiveModal(action)
    }

    const closeModal = () => {
        setActiveModal(null)
        setSelectedCategory(null)
    }

    const handleDelete = async () => {
        if (selectedCategory) {
            try {
                await dispatch(deleteCategory(selectedCategory._id)).unwrap()
                // Remove from localStorage
                categoryStorage.removeCategory(selectedCategory._id)
                closeModal()
                console.log('Category deleted successfully')
            } catch (error) {
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

    // Show skeleton loader when loading
    if (loading) {
        return <SkeletonTable />
    }

    // Show error state
    if (error) {
        return (
            <div className="w-full mx-auto flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-red-500 mb-2">
                        Error loading categories
                    </p>
                    <p className="text-[#8c91a0] text-sm">{error}</p>
                    <button
                        onClick={() => dispatch(fetchCategories())}
                        className="mt-4 px-4 py-2 bg-[#0F9297] text-white rounded hover:bg-[#0d7f84] text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full mx-auto relative ${className}`}>
            <div className="overflow-x-auto scrollbar-hidden">
                <table className="min-w-[700px] w-full border border-[#D6DDEB]">
                    <thead className="border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-[13px] font-medium text-[#8c91a0] w-16">
                                Category
                            </th>
                            <th className="px-6 py-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriesArray.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="px-6 py-12 text-center"
                                >
                                    <div className="text-[#8c91a0]">
                                        <p className="mb-2">
                                            No categories found
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentData.map((cat: Category, index: number) => (
                                <tr
                                    key={cat._id}
                                    className={`text-[13px] whitespace-nowrap cursor-pointer transition-colors ${
                                        (index + 1) % 2 === 0
                                            ? 'bg-[#F8F8FD] dark:bg-transparent'
                                            : ''
                                    }`}
                                >
                                    <td className="px-6 py-4">{cat.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <button
                                                className="p-1 hover:bg-gray-100 rounded relative"
                                                onClick={(e) =>
                                                    handleActionClick(
                                                        cat,
                                                        'menu',
                                                        e,
                                                    )
                                                }
                                            >
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>

                                            {activeModal === 'menu' &&
                                                selectedCategory?._id ===
                                                    cat._id && (
                                                    <div
                                                        className="fixed inset-0 z-40"
                                                        onClick={closeModal}
                                                    >
                                                        <div
                                                            className="absolute bg-white border border-[#D6DDEB] rounded-lg shadow-lg z-50 min-w-[120px]"
                                                            style={{
                                                                left: `${dropdownPosition.x}px`,
                                                                top: `${dropdownPosition.y}px`,
                                                            }}
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() =>
                                                                        handleActionClick(
                                                                            cat,
                                                                            'delete',
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-3 w-full px-4 py-2 text-[13px] text-[#25324B] hover:bg-gray-50"
                                                                >
                                                                    Delete
                                                                    category
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {activeModal === 'delete' && (
                <div className="fixed inset-0 bg-[#2155A329] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#25324B]">
                                Delete category
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
                            {selectedCategory?.name}"? This action cannot be
                            undone.
                        </p>
                        {deleteError && (
                            <p className="text-red-500 text-sm mb-4">
                                {deleteError}
                            </p>
                        )}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-[#25324B] border border-[#D6DDEB] rounded hover:bg-gray-50"
                                disabled={deleteLoading}
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

            {/* Only show pagination if there are categories */}
            {categoriesArray.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border border-[#D6DDEB]">
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
                                                : 'dark:text-[white] light:text-[#25324B] '
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
        </div>
    )
}

export default CategoryTable
