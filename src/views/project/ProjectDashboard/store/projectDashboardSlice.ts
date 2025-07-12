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
        date?: string
        amount?: number
        location?: string
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
    error?: string
}

export const SLICE_NAME = 'projectDashboard'

export const getProjectDashboardData = createAsyncThunk(
    SLICE_NAME + '/getProjectDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetProjectDashboardData()
            
            console.log('Full API Response:', response)
            console.log('response.data:', response.data)
            console.log('response.data.data:', response.data.data)
            console.log('response.data.data.jobs:', response.data.data.jobs)
            
            // Fix: Access the correct nested data path
            const apiResponseData = response.data.data
            
            // Transform API response to match your component expectations
            const transformedData: DashboardData = {
                userName: apiResponseData?.userName || 'Doctor',
                taskCount: apiResponseData?.totalJobs || 0,
                myTasksData: apiResponseData?.jobs?.map((job: any) => ({
    taskId: job._id,
    taskSubject: job.service?.name || job.name || 'Untitled Job', // ✅ Use service.name first
    priority: job.status === 'pending' ? 1 : job.status === 'completed' ? 2 : 0,
    date: job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }) : undefined,
    amount: job.amount,
    location: job.location ? 
        `${job.location.city || ''}, ${job.location.country || ''}`.replace(/^,\s*|,\s*$/g, '') : 
        undefined,
    assignees: job.businessOwner ? [{
        id: job.businessOwner._id,
        name: job.businessOwner.name,
        email: job.businessOwner.email,
        img: job.businessOwner.profileImage?.url || ''
    }] : []
})) || []

            }
            
            console.log('Jobs array length:', apiResponseData?.jobs?.length)
            console.log('Transformed myTasksData length:', transformedData.myTasksData?.length)
            console.log('Transformed Data:', transformedData)
            
            return transformedData
        } catch (error: any) {
            console.error('API Error:', error)
            return rejectWithValue(error.response?.data || error.message)
        }
    },
)

const initialState: ProjectDashboardState = {
    loading: true,
    dashboardData: {
        myTasksData: []
    },
    error: undefined,
}

const projectDashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectDashboardData.fulfilled, (state, action) => {
                state.dashboardData = action.payload
                state.loading = false
                state.error = undefined
                console.log('Data loaded successfully:', action.payload)
            })
            .addCase(getProjectDashboardData.pending, (state) => {
                state.loading = true
                state.error = undefined
                console.log('Loading dashboard data...')
            })
            .addCase(getProjectDashboardData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string || 'Failed to load dashboard data'
                console.error('Failed to load dashboard data:', action.payload)
                // Set empty data to prevent undefined errors
                state.dashboardData = {
                    myTasksData: []
                }
            })
    },
})

export const { clearError } = projectDashboardSlice.actions
export default projectDashboardSlice.reducer
