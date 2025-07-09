import { apiGetDoctors, apiGetPaymentHistory, apiGetUserAccount } from '@/services/CrmService';
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

interface PaymentHistory {
  _id: string;
  doctorId?: string;
  businessOwnerId?: string;
  jobId?: string;
  amount: number;
  currency?: string;
  status: string;
  paymentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ New UserAccount interface
interface UserAccount {
  _id: string;
  userId: string;
  accountType?: string;
  accountStatus?: string;
  balance?: number;
  currency?: string;
  bankDetails?: {
    accountNumber?: string;
    sortCode?: string;
    accountName?: string;
    bankName?: string;
  };
  paymentMethods?: Array<{
    type: string;
    details: any;
    isDefault: boolean;
  }>;
  transactionHistory?: Array<{
    transactionId: string;
    amount: number;
    type: string;
    status: string;
    date: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface DoctorState {
  data: Doctor[];
  loading: boolean;
  error: string | null;
  paymentHistory: PaymentHistory[];
  paymentHistoryLoading: boolean;
  paymentHistoryError: string | null;
  // ✅ User account state
  userAccount: UserAccount | null;
  userAccountLoading: boolean;
  userAccountError: string | null;
}

const initialState: DoctorState = {
  data: [],
  loading: false,
  error: null,
  paymentHistory: [],
  paymentHistoryLoading: false,
  paymentHistoryError: null,
  userAccount: null,
  userAccountLoading: false,
  userAccountError: null,
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

export const fetchPaymentHistory = createAsyncThunk(
  'doctor/fetchPaymentHistory',
  async (params: {
    page?: number;
    limit?: number;
    doctorId?: string;
    businessOwnerId?: string;
    jobId?: string;
    timeframe?: string;
  }, thunkAPI) => {
    try {
      const response = await apiGetPaymentHistory<any, typeof params>(params);
      console.log('Payment history response:', response);

      let paymentHistory;

      if (response?.data?.data?.payments) {
        paymentHistory = response.data.data.payments;
      } else if (response?.data?.payments) {
        paymentHistory = response.data.payments;
      } else if (Array.isArray(response?.data?.data)) {
        paymentHistory = response.data.data;
      } else if (Array.isArray(response?.data)) {
        paymentHistory = response.data;
      } else {
        throw new Error('Payment history data not found in expected response structure');
      }

      if (!Array.isArray(paymentHistory)) {
        throw new Error(`Payment history data is not an array. Got: ${typeof paymentHistory}`);
      }

      return paymentHistory;
    } catch (error: any) {
      console.error('Error in fetchPaymentHistory:', error);
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch payment history'
      );
    }
  }
);

// ✅ New async thunk for fetching user account
export const fetchUserAccount = createAsyncThunk(
  'doctor/fetchUserAccount',
  async (userId: string, thunkAPI) => {
    try {
      const response = await apiGetUserAccount<any>(userId);
      console.log('User account response:', response);

      // Extract user account data based on response structure
      let userAccount;

      if (response?.data?.data?.account) {
        userAccount = response.data.data.account;
      } else if (response?.data?.account) {
        userAccount = response.data.account;
      } else if (response?.data?.data) {
        userAccount = response.data.data;
      } else if (response?.data) {
        userAccount = response.data;
      } else {
        throw new Error('User account data not found in expected response structure');
      }

      return userAccount;
    } catch (error: any) {
      console.error('Error in fetchUserAccount:', error);
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch user account'
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
    clearPaymentHistoryError: (state) => {
      state.paymentHistoryError = null;
    },
    // ✅ New user account error clearing action
    clearUserAccountError: (state) => {
      state.userAccountError = null;
    },
    resetPaymentHistory: (state) => {
      state.paymentHistory = [];
      state.paymentHistoryLoading = false;
      state.paymentHistoryError = null;
    },
    // ✅ New user account reset action
    resetUserAccount: (state) => {
      state.userAccount = null;
      state.userAccountLoading = false;
      state.userAccountError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing doctor cases
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
      })
      // Payment history cases
      .addCase(fetchPaymentHistory.pending, (state) => {
        console.log('fetchPaymentHistory.pending - setting loading to true');
        state.paymentHistoryLoading = true;
        state.paymentHistoryError = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        console.log('fetchPaymentHistory.fulfilled - payload:', action.payload);
        state.paymentHistory = action.payload;
        state.paymentHistoryLoading = false;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        console.log('fetchPaymentHistory.rejected - error:', action.payload);
        state.paymentHistoryLoading = false;
        state.paymentHistoryError = action.payload as string;
        state.paymentHistory = [];
      })
      // ✅ User account cases
      .addCase(fetchUserAccount.pending, (state) => {
        console.log('fetchUserAccount.pending - setting loading to true');
        state.userAccountLoading = true;
        state.userAccountError = null;
      })
      .addCase(fetchUserAccount.fulfilled, (state, action) => {
        console.log('fetchUserAccount.fulfilled - payload:', action.payload);
        state.userAccount = action.payload;
        state.userAccountLoading = false;
      })
      .addCase(fetchUserAccount.rejected, (state, action) => {
        console.log('fetchUserAccount.rejected - error:', action.payload);
        state.userAccountLoading = false;
        state.userAccountError = action.payload as string;
        state.userAccount = null;
      });
  },
});

export const { 
  clearError, 
  clearPaymentHistoryError, 
  clearUserAccountError,
  resetPaymentHistory,
  resetUserAccount
} = doctorSlice.actions;

// Existing selectors
export const selectDoctors = (state: { doctor?: DoctorState }) =>
  state.doctor?.data || [];

export const selectDoctorsLoading = (state: { doctor?: DoctorState }) =>
  state.doctor?.loading || false;

export const selectDoctorsError = (state: { doctor?: DoctorState }) =>
  state.doctor?.error || null;

export const selectPaymentHistory = (state: { doctor?: DoctorState }) =>
  state.doctor?.paymentHistory || [];

export const selectPaymentHistoryLoading = (state: { doctor?: DoctorState }) =>
  state.doctor?.paymentHistoryLoading || false;

export const selectPaymentHistoryError = (state: { doctor?: DoctorState }) =>
  state.doctor?.paymentHistoryError || null;

// ✅ New user account selectors
export const selectUserAccount = (state: { doctor?: DoctorState }) =>
  state.doctor?.userAccount || null;

export const selectUserAccountLoading = (state: { doctor?: DoctorState }) =>
  state.doctor?.userAccountLoading || false;

export const selectUserAccountError = (state: { doctor?: DoctorState }) =>
  state.doctor?.userAccountError || null;

export default doctorSlice.reducer;
