import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetProjectDashboardData } from '@/services/ProjectService'

type ProjectOverviewChart = {
    onGoing: number
    finished: number
    total: number
    series: {
        name: string
        data: number[]
    }[]
    range: string[]
}

type DashboardData = {
    userName?: string
    taskCount?: number
    projectOverviewData?: {
        chart: {
            daily: ProjectOverviewChart
            weekly: ProjectOverviewChart
            monthly: ProjectOverviewChart
        }
    }
    myTasksData?: {
        taskId: string
        taskSubject: string
        priority: number
        assignees: {
            id: string
            name: string
            email: string
            img: string
        }[]
    }[]
    scheduleData?: {
        id: string
        time: string
        eventName: string
        desciption: string
        type: string
    }[]
    activitiesData?: {
        type: string
        dateTime: number
        ticket: string
        status?: number
        userName: string
        userImg?: string
        comment?: string
        tags?: string[]
        files?: string[]
    }[]
    projectsData?: {
        id: number
        name: string
        category: string
        desc: string
        attachmentCount: number
        totalTask: number
        completedTask: number
        progression: number
        dayleft: number
        status: string
        member: {
            name: string
            img: string
        }[]
    }[]
}

type GetProjectDashboardDataResponse = DashboardData

export type ProjectDashboardState = {
    loading: boolean
    dashboardData: DashboardData
    // error?: string // Optional: add error state
}

export const SLICE_NAME = 'projectDashboard'

export const getProjectDashboardData = createAsyncThunk(
    SLICE_NAME + '/getProjectDashboardData',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await apiGetProjectDashboardData<GetProjectDashboardDataResponse>()
            return response.data
        } catch (error: any) {
            if (error.response?.status === 403) {
                // Token expired, redirect to login
                // dispatch(logout()) or window.location.href = '/login'
            }
            return rejectWithValue(error.response?.data || error.message)
        }
    },
)

const initialState: ProjectDashboardState = {
    loading: true,
    dashboardData: {},
    // error: undefined,
}

const projectDashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProjectDashboardData.fulfilled, (state, action) => {
                state.dashboardData = action.payload
                state.loading = false
                // state.error = undefined // Clear any previous errors
            })
            .addCase(getProjectDashboardData.pending, (state) => {
                state.loading = true
                // state.error = undefined // Clear any previous errors
            })
            .addCase(getProjectDashboardData.rejected, (state, action) => {
                state.loading = false // THIS WAS MISSING!
                // state.error = action.error.message || 'Failed to load dashboard data'
            })
    },
})

export default projectDashboardSlice.reducer