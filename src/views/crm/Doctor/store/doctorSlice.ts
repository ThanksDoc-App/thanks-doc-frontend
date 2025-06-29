import { apiGetDoctors } from '@/services/CrmService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Doctor {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  // Add other fields from your API response
  gmcNumber?: string;
  rating?: number;
  profileImage?: string | null;
  location?: string | null;
  role?: string;
  isEmailVerified?: boolean;
  isIdentityVerified?: boolean;
  signedUpAs?: string;
}

interface DoctorState {
  data: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  data: [],
  loading: false,
  error: null,
};

// Fetch doctors async thunk with correct response handling
export const fetchDoctors = createAsyncThunk(
  'doctor/fetchDoctors',
  async (_, thunkAPI) => {
    try {
      console.log('🚀 fetchDoctors thunk started - calling apiGetDoctors...');
      
      const response = await apiGetDoctors<any>();
      
      console.log('✅ API Response received:', response);
      console.log('📊 Response status:', response?.status);
      console.log('📦 Response data:', response?.data);
      
      // Check if response exists
      if (!response) {
        console.error('❌ No response received from API');
        throw new Error('No response received from API');
      }
      
      // Check if response.data exists
      if (!response.data) {
        console.error('❌ No data in response');
        throw new Error('No data in response');
      }
      
      console.log('🔍 Looking for users data...');
      
      // Handle the actual API response structure: { data: { users: [...] } }
      let doctors;
      
      if (response.data.data && response.data.data.users) {
        // Structure: response.data.data.users
        doctors = response.data.data.users;
        console.log('✅ Found doctors in response.data.data.users:', doctors);
      } else if (response.data.users) {
        // Structure: response.data.users
        doctors = response.data.users;
        console.log('✅ Found doctors in response.data.users:', doctors);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Structure: response.data.data (direct array)
        doctors = response.data.data;
        console.log('✅ Found doctors array in response.data.data:', doctors);
      } else if (Array.isArray(response.data)) {
        // Structure: response.data (direct array)
        doctors = response.data;
        console.log('✅ Found doctors array in response.data:', doctors);
      } else {
        console.error('❌ Could not find users/doctors array in response structure');
        console.log('Full response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('Users/doctors data not found in expected response structure');
      }
      
      if (!doctors || !Array.isArray(doctors)) {
        console.error('❌ Doctors data is not an array:', typeof doctors, doctors);
        throw new Error(`Doctors data is not an array. Got: ${typeof doctors}`);
      }
      
      // Filter only doctors if the API returns mixed user types
      const filteredDoctors = doctors.filter((user: any) => 
        user.role === 'doctor' || user.signedUpAs === 'doctor'
      );
      
      console.log('✅ Successfully extracted doctors array:', filteredDoctors.length, 'items');
      console.log('👥 Sample doctor:', filteredDoctors[0]);
      
      return filteredDoctors;
    } catch (error: any) {
      console.error('❌ Error in fetchDoctors thunk:', error);
      console.error('📍 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to fetch doctors'
      );
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctors cases
      .addCase(fetchDoctors.pending, (state) => {
        console.log('⏳ fetchDoctors.pending - setting loading to true');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        console.log('✅ fetchDoctors.fulfilled - payload received:', action.payload?.length, 'doctors');
        console.log('📝 State before update:', state.data?.length, 'doctors');
        state.data = action.payload;
        state.loading = false;
        console.log('📝 State after update:', state.data?.length, 'doctors');
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        console.error('❌ fetchDoctors.rejected - error:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
        state.data = []; // Clear any existing data on error
      });
  },
});

// Export actions
export const { clearError } = doctorSlice.actions;

// Export selectors with safe fallbacks and proper typing
export const selectDoctors = (state: { doctor?: DoctorState }) => {
  // Add null check for state.doctor
  if (!state.doctor) {
    console.warn('⚠️ state.doctor is undefined, returning empty array');
    return [];
  }
  
  const doctors = state.doctor.data || [];
  console.log('🔍 selectDoctors called - returning:', doctors?.length, 'doctors');
  return doctors;
};

export const selectDoctorsLoading = (state: { doctor?: DoctorState }) => {
  // Add null check for state.doctor
  if (!state.doctor) {
    console.warn('⚠️ state.doctor is undefined, returning false for loading');
    return false;
  }
  
  const loading = state.doctor.loading;
  console.log('⏳ selectDoctorsLoading called - returning:', loading);
  return loading;
};

export const selectDoctorsError = (state: { doctor?: DoctorState }) => {
  // Add null check for state.doctor
  if (!state.doctor) {
    console.warn('⚠️ state.doctor is undefined, returning null for error');
    return null;
  }
  
  const error = state.doctor.error;
  if (error) console.log('❌ selectDoctorsError called - returning:', error);
  return error;
};

export default doctorSlice.reducer;
