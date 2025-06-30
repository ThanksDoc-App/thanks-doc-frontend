import { apiGetBusiness } from '@/services/CrmService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Business {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  businessType?: string;
  registrationNumber?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  profileImage?: string | null;
  location?: string | null;
  role?: string;
  isEmailVerified?: boolean;
  isIdentityVerified?: boolean;
  signedUpAs?: string;
  jobsPosted?: number;
}

interface BusinessState {
  data: Business[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchBusinesses = createAsyncThunk(
  'business/fetchBusinesses',
  async (_, thunkAPI) => {
    try {
      const response = await apiGetBusiness<any>();

      if (!response || !response.data) {
        throw new Error('No data in response');
      }

      let businesses;

      if (response.data.data && response.data.data.users) {
        businesses = response.data.data.users;
      } else if (response.data.users) {
        businesses = response.data.users;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        businesses = response.data.data;
      } else if (Array.isArray(response.data)) {
        businesses = response.data;
      } else {
        throw new Error('Users/businesses data not found in expected response structure');
      }

      if (!Array.isArray(businesses)) {
        throw new Error(`Businesses data is not an array. Got: ${typeof businesses}`);
      }

      const filteredBusinesses = businesses.filter(
        (user: any) => user.role === 'business' || user.signedUpAs === 'business'
      );

      return filteredBusinesses;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch businesses'
      );
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = [];
      });
  },
});

export const { clearError } = businessSlice.actions;

export const selectBusinesses = (state: { business?: BusinessState }) => {
  return state.business?.data || [];
};

export const selectBusinessesLoading = (state: { business?: BusinessState }) => {
  return state.business?.loading || false;
};

export const selectBusinessesError = (state: { business?: BusinessState }) => {
  return state.business?.error || null;
};

export default businessSlice.reducer;
