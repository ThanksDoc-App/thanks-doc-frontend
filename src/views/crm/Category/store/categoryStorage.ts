// utils/categoryStorage.ts
export interface Category {
    _id: string
    name: string
    createdAt?: string
    updatedAt?: string
    __v?: number
}

const CATEGORIES_STORAGE_KEY = 'crm_categories'

export const categoryStorage = {
    // Save categories to localStorage
    saveCategories: (categories: Category[]): void => {
        try {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
        } catch (error) {
            console.error('Failed to save categories to localStorage:', error)
        }
    },

    // Get categories from localStorage
    getCategories: (): Category[] => {
        try {
            const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY)
            return stored ? JSON.parse(stored) : []
        } catch (error) {
            console.error('Failed to get categories from localStorage:', error)
            return []
        }
    },

    // Clear categories from localStorage
    clearCategories: (): void => {
        try {
            localStorage.removeItem(CATEGORIES_STORAGE_KEY)
        } catch (error) {
            console.error('Failed to clear categories from localStorage:', error)
        }
    },

    // Add a single category
    addCategory: (category: Category): void => {
        try {
            const categories = categoryStorage.getCategories()
            const updatedCategories = [...categories, category]
            categoryStorage.saveCategories(updatedCategories)
        } catch (error) {
            console.error('Failed to add category to localStorage:', error)
        }
    },

    // Remove a category by ID
    removeCategory: (categoryId: string): void => {
        try {
            const categories = categoryStorage.getCategories()
            const filteredCategories = categories.filter(cat => cat._id !== categoryId)
            categoryStorage.saveCategories(filteredCategories)
        } catch (error) {
            console.error('Failed to remove category from localStorage:', error)
        }
    }
}