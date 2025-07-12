import { apiGetBusiness, apiGetPaymentHistory } from '@/services/CrmService';
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

// Add Payment History interface
interface PaymentHistoryItem {
  _id: string;
  title: string;
  jobId: string;
  location?: string;
  amount: number;
  currency?: string;
  paymentDate: string;
  status: string;
}

interface BusinessState {
  data: Business[];
  loading: boolean;
  error: string | null;
  // Add payment history state
  paymentHistory: PaymentHistoryItem[];
  paymentHistoryLoading: boolean;
  paymentHistoryError: string | null;
}

const initialState: BusinessState = {
  data: [],
  loading: false,
  error: null,
  // Initialize payment history state
  paymentHistory: [],
  paymentHistoryLoading: false,
  paymentHistoryError: null,
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

// Add new async thunk for payment history
export const fetchPaymentHistory = createAsyncThunk(
  'business/fetchPaymentHistory',
  async (
    params: {
      businessOwnerId: string;
      page?: number;
      limit?: number;
      timeframe?: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await apiGetPaymentHistory<any>(params);

      if (!response || !response.data) {
        throw new Error('No payment history data in response');
      }

      // Handle different response structures
      let paymentData;
      if (response.data.data && Array.isArray(response.data.data)) {
        paymentData = response.data.data;
      } else if (Array.isArray(response.data)) {
        paymentData = response.data;
      } else {
        throw new Error('Payment history data not found in expected response structure');
      }

      // Transform the data to match our interface
      const transformedData = paymentData.map((payment: any) => ({
        _id: payment._id || payment.id,
        title: payment.jobTitle || payment.title || 'N/A',
        jobId: payment.jobId || payment.id,
        location: payment.location || 'N/A',
        amount: payment.amount || 0,
        currency: payment.currency || 'NGN',
        paymentDate: payment.paymentDate || payment.createdAt,
        status: payment.status || 'pending'
      }));

      return transformedData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch payment history'
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
    clearPaymentHistoryError: (state) => {
      state.paymentHistoryError = null;
    },
    // Add action to update payment status
    updatePaymentStatus: (state, action) => {
      const { jobId, status } = action.payload;
      const paymentIndex = state.paymentHistory.findIndex(payment => payment._id === jobId);
      if (paymentIndex !== -1) {
        state.paymentHistory[paymentIndex].status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing business cases
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
      })
      // Payment history cases
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.paymentHistoryLoading = true;
        state.paymentHistoryError = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.paymentHistory = action.payload;
        state.paymentHistoryLoading = false;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.paymentHistoryLoading = false;
        state.paymentHistoryError = action.payload as string;
        state.paymentHistory = [];
      });
  },
});

export const { clearError, clearPaymentHistoryError, updatePaymentStatus } = businessSlice.actions;

// Existing selectors
export const selectBusinesses = (state: { business?: BusinessState }) => {
  return state.business?.data || [];
};

export const selectBusinessesLoading = (state: { business?: BusinessState }) => {
  return state.business?.loading || false;
};

export const selectBusinessesError = (state: { business?: BusinessState }) => {
  return state.business?.error || null;
};

// New payment history selectors
export const selectPaymentHistory = (state: { business?: BusinessState }) => {
  return state.business?.paymentHistory || [];
};

export const selectPaymentHistoryLoading = (state: { business?: BusinessState }) => {
  return state.business?.paymentHistoryLoading || false;
};

export const selectPaymentHistoryError = (state: { business?: BusinessState }) => {
  return state.business?.paymentHistoryError || null;
};

export default businessSlice.reducer;
