import { KycFormState } from '../store/kycFormSlice'

const FORM_STORAGE_KEY = 'kycFormState'
const STORAGE_VERSION = '1.0'

export interface PersistedFormState {
    currentStep: number
    stepStatus: Record<number, { status: string }>
    formData: any
    version: string
    timestamp: number
}

export const saveFormState = (state: Partial<KycFormState>): void => {
    try {
        const dataToSave: PersistedFormState = {
            currentStep: state.currentStep || 0,
            stepStatus: state.stepStatus || {},
            formData: state.formData || {},
            version: STORAGE_VERSION,
            timestamp: Date.now(),
        }
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
        console.error('Error saving form state:', error)
    }
}

export const loadFormState = (): PersistedFormState | null => {
    try {
        const saved = localStorage.getItem(FORM_STORAGE_KEY)
        if (!saved) return null
        
        const parsedData = JSON.parse(saved) as PersistedFormState
        
        // Check if data is expired (24 hours)
        const ONE_DAY = 24 * 60 * 60 * 1000
        if (Date.now() - parsedData.timestamp > ONE_DAY) {
            clearSavedFormState()
            return null
        }
        
        return parsedData
    } catch (error) {
        console.error('Error loading form state:', error)
        return null
    }
}

export const clearSavedFormState = (): void => {
    try {
        localStorage.removeItem(FORM_STORAGE_KEY)
    } catch (error) {
        console.error('Error clearing form state:', error)
    }
}

export const isFormStateExpired = (state: PersistedFormState): boolean => {
    const ONE_DAY = 24 * 60 * 60 * 1000
    return Date.now() - state.timestamp > ONE_DAY
}
