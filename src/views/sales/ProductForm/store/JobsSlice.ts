import { apiCreateJob } from '@/services/CrmService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Location {
  country: string;
  city: string;
  state: string;
  address1: string;
  address2?: string;
  zipCode: string;
}

interface Job {
  _id: string;
  name: string;
  service: string;
  category: string;
  description: string;
  location: Location;
  amount: number;
  currency: string;
  time: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface CreateJobData {
  name: string;
  service: string;
  category: string;
  description: string;
  location: Location;
  amount: number;
  currency: string;
  time: string;
  date: string;
}

interface JobState {
  data: Job[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
}

const initialState: JobState = {
  data: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
};

// Create job async thunk
export const createJob = createAsyncThunk(
  'job/createJob',
  async (jobData: CreateJobData, thunkAPI) => {
    try {
      const response = await apiCreateJob<any, CreateJobData>(jobData);
      console.log('Create job response:', response);
      console.log('Created job data:', response.data);
      
      // Extract the created job from the response
      const createdJob = response.data.data || response.data;
      
      if (!createdJob) {
        throw new Error('No job data returned from server');
      }
      
      return createdJob;
    } catch (error: any) {
      console.error('Error in createJob:', error);
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to create job'
      );
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    // Clear create error
    clearCreateError: (state) => {
      state.createError = null;
    },
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
    },
    // Reset job state
    resetJobState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.createLoading = false;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create job cases
      .addCase(createJob.pending, (state) => {
        console.log('createJob.pending - setting createLoading to true');
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        console.log('createJob.fulfilled - payload:', action.payload);
        state.createLoading = false;
        state.createError = null;
        
        // Add the newly created job to the data array
        state.data.push(action.payload);
        console.log('createJob.fulfilled - updated jobs:', state.data);
      })
      .addCase(createJob.rejected, (state, action) => {
        console.log('createJob.rejected - error:', action.payload);
        state.createLoading = false;
        state.createError = action.payload as string;
      });
  },
});

// Export actions
export const { clearCreateError, clearErrors, resetJobState } = jobSlice.actions;

// Export selectors
export const selectJobs = (state: { job: JobState }) => state.job.data;
export const selectJobsLoading = (state: { job: JobState }) => state.job.loading;
export const selectJobsError = (state: { job: JobState }) => state.job.error;
export const selectCreateJobLoading = (state: { job: JobState }) => state.job.createLoading;
export const selectCreateJobError = (state: { job: JobState }) => state.job.createError;

export default jobSlice.reducer;