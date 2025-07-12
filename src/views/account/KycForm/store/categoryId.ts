// utils/categoryStorage.ts
// Utility functions for managing category ID in localStorage across KYC form components

export const CATEGORY_STORAGE_KEY = 'kyc_category_id'

/**
 * Store category ID in localStorage
 * @param categoryId - The category ID to store
 */
export const storeCategoryId = (categoryId: string): void => {
    try {
        localStorage.setItem(CATEGORY_STORAGE_KEY, categoryId)
    } catch (error) {
        console.error('Failed to store category ID:', error)
    }
}

/**
 * Retrieve category ID from localStorage
 * @returns The stored category ID or null if not found
 */
export const getCategoryId = (): string | null => {
    try {
        return localStorage.getItem(CATEGORY_STORAGE_KEY)
    } catch (error) {
        console.error('Failed to retrieve category ID:', error)
        return null
    }
}

/**
 * Clear category ID from localStorage
 */
export const clearCategoryId = (): void => {
    try {
        localStorage.removeItem(CATEGORY_STORAGE_KEY)
    } catch (error) {
        console.error('Failed to clear category ID:', error)
    }
}

/**
 * Check if category ID exists in localStorage
 * @returns boolean indicating if category ID exists
 */
export const hasCategoryId = (): boolean => {
    return getCategoryId() !== null
}

/**
 * Get category ID with validation
 * @returns The category ID or throws an error if not found
 */
export const getCategoryIdRequired = (): string => {
    const categoryId = getCategoryId()
    if (!categoryId) {
        throw new Error('Category ID is required but not found in localStorage')
    }
    return categoryId
}

/**
 * Add category ID to any payload object
 * @param payload - The payload object to enhance
 * @returns Enhanced payload with category ID
 */
export const addCategoryToPayload = <T extends Record<string, any>>(payload: T): T & { categoryId: string } => {
    const categoryId = getCategoryIdRequired()
    return {
        ...payload,
        categoryId,
    }
}

/**
 * Create a payload with category ID for API calls
 * @param data - The data to send
 * @returns Payload with category ID included
 */
export const createPayloadWithCategory = <T extends Record<string, any>>(data: T): T & { categoryId: string } => {
    return addCategoryToPayload(data)
}