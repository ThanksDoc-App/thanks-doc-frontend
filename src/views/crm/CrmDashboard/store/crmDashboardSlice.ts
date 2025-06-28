import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetCrmDashboardData, apiCreateCategory, apiCreateService } from '@/services/CrmService'

export type Statistic = {
    key: string
    label: string
    value: number
    growShrink: number
}

export type LeadRegion = {
    name: string
    value: number
}

export type Lead = {
    id: number
    name: string
    avatar: string
    status: number
    createdTime: number
    email: string
    assignee: string
}

export type Emails = {
    precent: number
    opened: number
    unopen: number
    total: number
}

export type Category = {
    id?: number
    name: string
    createdAt?: string
    updatedAt?: string
}

export type Service = {
    id?: number
    name: string
    category?: string
    createdAt?: string
    updatedAt?: string
}

export type DashboardData = {
    statisticData: Statistic[]
    leadByRegionData: LeadRegion[]
    recentLeadsData: Lead[]
    emailSentData: Emails
}

type CrmDashboardDataResponse = DashboardData
type CreateCategoryResponse = Category
type CreateServiceResponse = Service

export type CrmDashboardState = {
    loading: boolean
    dashboardData: Partial<DashboardData>
    categoryLoading: boolean
    categoryError: string | null
    categories: Category[]
    serviceLoading: boolean
    serviceError: string | null
    services: Service[]
}

export const SLICE_NAME = 'crmDashboard'

// Fetch CRM dashboard data
export const getCrmDashboardData = createAsyncThunk(
    'crmDashboard/data/getCrmDashboardData',
    async () => {
        const response = await apiGetCrmDashboardData<CrmDashboardDataResponse>()
        return response.data
    }
)

// Create new category
export const createCategory = createAsyncThunk(
    'crmDashboard/category/createCategory',
    async (categoryData: { name: string }, { rejectWithValue }) => {
        try {
            const response = await apiCreateCategory<CreateCategoryResponse, typeof categoryData>(categoryData)
            return response.data
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to create category')
        }
    }
)

// Create new service
export const createService = createAsyncThunk(
    'crmDashboard/service/createService',
    async (serviceData: { name: string }, { rejectWithValue }) => {
        try {
            const response = await apiCreateService<CreateServiceResponse, typeof serviceData>(serviceData)
            return response.data
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to create service')
        }
    }
)

const initialState: CrmDashboardState = {
    loading: true,
    dashboardData: {},
    categoryLoading: false,
    categoryError: null,
    categories: [],
    serviceLoading: false,
    serviceError: null,
    services: [],
}

const crmDashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        clearCategoryError: (state) => {
            state.categoryError = null
        },
        clearServiceError: (state) => {
            state.serviceError = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Dashboard data
            .addCase(getCrmDashboardData.pending, (state) => {
                state.loading = true
            })
            .addCase(getCrmDashboardData.fulfilled, (state, action) => {
                state.dashboardData = action.payload
                state.loading = false
            })
            // Category creation
            .addCase(createCategory.pending, (state) => {
                state.categoryLoading = true
                state.categoryError = null
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categoryLoading = false
                state.categoryError = null
                state.categories.push(action.payload)
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.categoryLoading = false
                state.categoryError = action.payload as string
            })
            // Service creation
            .addCase(createService.pending, (state) => {
                state.serviceLoading = true
                state.serviceError = null
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.serviceLoading = false
                state.serviceError = null
                state.services.push(action.payload)
            })
            .addCase(createService.rejected, (state, action) => {
                state.serviceLoading = false
                state.serviceError = action.payload as string
            })
    },
})

export const { clearCategoryError, clearServiceError } = crmDashboardSlice.actions
export default crmDashboardSlice.reducer