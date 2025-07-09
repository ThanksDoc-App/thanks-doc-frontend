import { apiGetJobBrowse } from '@/services/ProjectService'
import { apiUpdateJobStatus } from '@/services/SalesService'
import { apiRateJob } from '@/services/SalesService' // Add this import
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Job {
    _id: string
    title: string
    company?: string
    location?: string
    description?: string
    salary?: string
    type?: string
    status?: string
    rating?: number // Add rating field
    createdAt?: string
    updatedAt?: string
    __v?: number
    job?: any
    doctor?: any
}

interface JobHistoryState {
    data: Job[]
    loading: boolean
    error: string | null
    updateLoading: boolean
    updateError: string | null
    ratingLoading: boolean // Add rating loading state
    ratingError: string | null // Add rating error state
}

const initialState: JobHistoryState = {
    data: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    ratingLoading: false,
    ratingError: null,
}

// Fetch job history async thunk
export const fetchJobHistory = createAsyncThunk(
    'jobHistory/fetchJobHistory',
    async (_, thunkAPI) => {
        try {
            const response = await apiGetJobBrowse<any>()
            console.log(response, 'full job browse response')
            console.log(response.data, 'response.data')
            console.log(response.data.data, 'response.data.data')
            console.log(response.data.data.jobs, 'jobs array')

            // Extract the nested jobs array (adjust path based on actual API response structure)
            const jobs =
                response.data.data?.jobs || response.data.data || response.data

            if (!jobs || !Array.isArray(jobs)) {
                throw new Error('Job history data is not an array')
            }

            return jobs // This is the actual array
        } catch (error: any) {
            console.error('Error in fetchJobHistory:', error)
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message ||
                    error.message ||
                    'Failed to fetch job history',
            )
        }
    },
)

// Update job status async thunk
export const updateJobStatus = createAsyncThunk(
    'jobHistory/updateJobStatus',
    async (
        { id, data }: { id: string | number; data: Record<string, unknown> },
        thunkAPI,
    ) => {
        try {
            const response = await apiUpdateJobStatus<Job, typeof data>(
                id,
                data,
            )
            console.log('Job status updated successfully:', response)
            return { id, updatedJob: response.data }
        } catch (error: any) {
            console.error('Error in updateJobStatus:', error)
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message ||
                    error.message ||
                    'Failed to update job status',
            )
        }
    },
)

// Rate job async thunk
export const rateJob = createAsyncThunk(
    'jobHistory/rateJob',
    async (
        { id, data }: { id: string | number; data: { rating: number } },
        thunkAPI,
    ) => {
        try {
            const response = await apiRateJob<Job, typeof data>(id, data)
            console.log('Job rated successfully:', response)
            return { id, ratedJob: response.data }
        } catch (error: any) {
            console.error('Error in rateJob:', error)
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message ||
                    error.message ||
                    'Failed to rate job',
            )
        }
    },
)

const jobHistorySlice = createSlice({
    name: 'jobHistory',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null
        },
        // Clear update error
        clearUpdateError: (state) => {
            state.updateError = null
        },
        // Clear rating error
        clearRatingError: (state) => {
            state.ratingError = null
        },
        // Reset job history state
        resetJobHistory: (state) => {
            state.data = []
            state.loading = false
            state.error = null
            state.updateLoading = false
            state.updateError = null
            state.ratingLoading = false
            state.ratingError = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch job history cases
            .addCase(fetchJobHistory.pending, (state) => {
                console.log('fetchJobHistory.pending - setting loading to true')
                state.loading = true
                state.error = null
            })
            .addCase(fetchJobHistory.fulfilled, (state, action) => {
                console.log(
                    'fetchJobHistory.fulfilled - payload:',
                    action.payload,
                )
                console.log(
                    'fetchJobHistory.fulfilled - state before:',
                    state.data,
                )
                state.data = action.payload // Now this will be the actual jobs array
                state.loading = false
                console.log(
                    'fetchJobHistory.fulfilled - state after:',
                    state.data,
                )
            })
            .addCase(fetchJobHistory.rejected, (state, action) => {
                console.log('fetchJobHistory.rejected - error:', action.payload)
                state.loading = false
                state.error = action.payload as string
            })
            // Update job status cases
            .addCase(updateJobStatus.pending, (state) => {
                console.log(
                    'updateJobStatus.pending - setting updateLoading to true',
                )
                state.updateLoading = true
                state.updateError = null
            })
            .addCase(updateJobStatus.fulfilled, (state, action) => {
                console.log(
                    'updateJobStatus.fulfilled - payload:',
                    action.payload,
                )
                state.updateLoading = false
                // Update the specific job in the array
                const index = state.data.findIndex(
                    (job) => job._id === action.payload.id,
                )
                if (index !== -1) {
                    state.data[index] = {
                        ...state.data[index],
                        ...action.payload.updatedJob,
                    }
                    console.log('Job updated in state:', state.data[index])
                }
            })
            .addCase(updateJobStatus.rejected, (state, action) => {
                console.log('updateJobStatus.rejected - error:', action.payload)
                state.updateLoading = false
                state.updateError = action.payload as string
            })
            // Rate job cases
            .addCase(rateJob.pending, (state) => {
                console.log('rateJob.pending - setting ratingLoading to true')
                state.ratingLoading = true
                state.ratingError = null
            })
            .addCase(rateJob.fulfilled, (state, action) => {
                console.log('rateJob.fulfilled - payload:', action.payload)
                state.ratingLoading = false
                // Update the specific job in the array with rating
                const index = state.data.findIndex(
                    (job) => job._id === action.payload.id,
                )
                if (index !== -1) {
                    state.data[index] = {
                        ...state.data[index],
                        ...action.payload.ratedJob,
                    }
                    console.log('Job rated in state:', state.data[index])
                }
            })
            .addCase(rateJob.rejected, (state, action) => {
                console.log('rateJob.rejected - error:', action.payload)
                state.ratingLoading = false
                state.ratingError = action.payload as string
            })
    },
})

// Export actions
export const {
    clearError,
    clearUpdateError,
    clearRatingError,
    resetJobHistory,
} = jobHistorySlice.actions

// Export selectors
export const selectJobHistory = (state: { jobHistory: JobHistoryState }) =>
    state.jobHistory.data
export const selectJobHistoryLoading = (state: {
    jobHistory: JobHistoryState
}) => state.jobHistory.loading
export const selectJobHistoryError = (state: { jobHistory: JobHistoryState }) =>
    state.jobHistory.error
export const selectUpdateLoading = (state: { jobHistory: JobHistoryState }) =>
    state.jobHistory.updateLoading
export const selectUpdateError = (state: { jobHistory: JobHistoryState }) =>
    state.jobHistory.updateError
export const selectRatingLoading = (state: { jobHistory: JobHistoryState }) =>
    state.jobHistory.ratingLoading
export const selectRatingError = (state: { jobHistory: JobHistoryState }) =>
    state.jobHistory.ratingError

export default jobHistorySlice.reducer
