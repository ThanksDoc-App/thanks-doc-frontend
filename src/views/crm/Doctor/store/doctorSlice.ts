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

export const fetchDoctors = createAsyncThunk(
  'doctor/fetchDoctors',
  async (_, thunkAPI) => {
    try {
      const response = await apiGetDoctors<any>();

      let doctors;

      if (response?.data?.data?.users) {
        doctors = response.data.data.users;
      } else if (response?.data?.users) {
        doctors = response.data.users;
      } else if (Array.isArray(response?.data?.data)) {
        doctors = response.data.data;
      } else if (Array.isArray(response?.data)) {
        doctors = response.data;
      } else {
        throw new Error('Users/doctors data not found in expected response structure');
      }

      if (!Array.isArray(doctors)) {
        throw new Error(`Doctors data is not an array. Got: ${typeof doctors}`);
      }

      const filteredDoctors = doctors.filter(
        (user: any) => user.role === 'doctor' || user.signedUpAs === 'doctor'
      );

      return filteredDoctors;
    } catch (error: any) {
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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = [];
      });
  },
});

export const { clearError } = doctorSlice.actions;

export const selectDoctors = (state: { doctor?: DoctorState }) =>
  state.doctor?.data || [];

export const selectDoctorsLoading = (state: { doctor?: DoctorState }) =>
  state.doctor?.loading || false;

export const selectDoctorsError = (state: { doctor?: DoctorState }) =>
  state.doctor?.error || null;

export default doctorSlice.reducer;
