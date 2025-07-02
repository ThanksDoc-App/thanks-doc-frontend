import { apiGetJobBrowse } from '@/services/ProjectService'
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
    createdAt?: string
    updatedAt?: string
    __v?: number
}

interface JobHistoryState {
    data: Job[]
    loading: boolean
    error: string | null
}

const initialState: JobHistoryState = {
    data: [],
    loading: false,
    error: null,
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

const jobHistorySlice = createSlice({
    name: 'jobHistory',
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null
        },
        // Reset job history state
        resetJobHistory: (state) => {
            state.data = []
            state.loading = false
            state.error = null
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
    },
})

// Export actions
export const { clearError, resetJobHistory } = jobHistorySlice.actions

// Export selectors
export const selectJobHistory = (state: { jobHistory: JobHistoryState }) =>
    state.jobHistory.data
export const selectJobHistoryLoading = (state: {
    jobHistory: JobHistoryState
}) => state.jobHistory.loading
export const selectJobHistoryError = (state: { jobHistory: JobHistoryState }) =>
    state.jobHistory.error

export default jobHistorySlice.reducer
