import { apiGetAdminDashboard, apiCreateService, apiCreateCategory } from '@/services/CrmService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type AdminStats = {
    businesses: number
    doctors: number
    services: number
    categories: number
}

export type AdminDashboardResponse = {
    status: boolean
    statusCode: number
    message: string
    data: AdminStats
}

export type ServiceData = {
    name: string
    category?: string
    price: number
    currency: string
}

export type CategoryData = {
    name: string
}

export type AdminDashboardState = {
    loading: boolean
    error: string | null
    stats: AdminStats | null
    serviceLoading: boolean
    serviceError: string | null
    categoryLoading: boolean
    categoryError: string | null
    data: any
}

export const SLICE_NAME = 'adminDashboard'

// Fetch admin dashboard stats
export const getAdminDashboardStats = createAsyncThunk(
    'adminDashboard/getAdminDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetAdminDashboard<AdminDashboardResponse>()
            console.log('Full API Response:', response) // Debug log
            console.log('Response data:', response.data) // Debug log
            return response.data.data // Fix: Get the nested data object
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch admin dashboard stats')
        }
    }
)

// Create service async thunk
export const createService = createAsyncThunk(
    'adminDashboard/createService',
    async (serviceData: ServiceData, { rejectWithValue }) => {
        try {
            console.log('Creating service with data:', serviceData)
            const response = await apiCreateService(serviceData)
            return response.data
        } catch (error: any) {
            console.error('Service creation error:', error)
            return rejectWithValue(
                error?.response?.data?.message || 
                error?.message || 
                'Failed to create service'
            )
        }
    }
)

// Create category async thunk
export const createCategory = createAsyncThunk(
    'adminDashboard/createCategory',
    async (categoryData: CategoryData, { rejectWithValue }) => {
        try {
            console.log('Creating category with data:', categoryData)
            const response = await apiCreateCategory(categoryData)
            return response.data
        } catch (error: any) {
            console.error('Category creation error:', error)
            return rejectWithValue(
                error?.response?.data?.message || 
                error?.message || 
                'Failed to create category'
            )
        }
    }
)

const initialState: AdminDashboardState = {
    loading: false,
    error: null,
    stats: null,
    serviceLoading: false,
    serviceError: null,
    categoryLoading: false,
    categoryError: null,
    data: {
        
    }
}

const adminDashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        resetStats: (state) => {
            state.stats = null
            state.error = null
            state.loading = false
        },
        clearServiceError: (state) => {
            state.serviceError = null
        },
        clearCategoryError: (state) => {
            state.categoryError = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Admin dashboard stats
            .addCase(getAdminDashboardStats.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAdminDashboardStats.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.stats = action.payload
            })
            .addCase(getAdminDashboardStats.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.stats = null
            })
            // Create service
            .addCase(createService.pending, (state) => {
                state.serviceLoading = true
                state.serviceError = null
            })
            .addCase(createService.fulfilled, (state) => {
                state.serviceLoading = false
                state.serviceError = null
                // Optionally update stats here if needed
                if (state.stats) {
                    state.stats.services += 1
                }
            })
            .addCase(createService.rejected, (state, action) => {
                state.serviceLoading = false
                state.serviceError = action.payload as string
            })
            // Create category
            .addCase(createCategory.pending, (state) => {
                state.categoryLoading = true
                state.categoryError = null
            })
            .addCase(createCategory.fulfilled, (state) => {
                state.categoryLoading = false
                state.categoryError = null
                // Optionally update stats here if needed
                if (state.stats) {
                    state.stats.categories += 1
                }
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.categoryLoading = false
                state.categoryError = action.payload as string
            })
    },
})

export const { clearError, resetStats, clearServiceError, clearCategoryError } = adminDashboardSlice.actions
export default adminDashboardSlice.reducer