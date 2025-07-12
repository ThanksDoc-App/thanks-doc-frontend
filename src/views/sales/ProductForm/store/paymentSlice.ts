import { apiPayForJob } from '@/services/CrmService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Updated response type to match your API response
interface PayForJobResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        status: boolean;
        statusCode: number;
        message: string;
        data: {
            session_id: string;
            url: string;
        };
    };
}

// Define the payment state
interface PaymentState {
    loading: boolean;
    error: string | null;
    lastPayment: PayForJobResponse | null;
}

const initialState: PaymentState = {
    loading: false,
    error: null,
    lastPayment: null,
};

// Create async thunk for paying for a job
export const payForJob = createAsyncThunk<
    PayForJobResponse,
    string,
    { rejectValue: string }
>(
    'payment/payForJob',
    async (jobId: string, { rejectWithValue }) => {
        try {
            console.log('Making API call for job:', jobId)
            const response = await apiPayForJob<PayForJobResponse>(jobId);
            console.log('API response received:', response)
            return response;
        } catch (error: any) {
            console.error('API call error:', error)
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to process payment'
            );
        }
    }
);

// Create the payment slice
const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        },
        resetPaymentState: (state) => {
            state.loading = false;
            state.error = null;
            state.lastPayment = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(payForJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(payForJob.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastPayment = action.payload;
            })
            .addCase(payForJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Payment failed';
                state.lastPayment = null;
            });
    },
});

export const { clearPaymentError, resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
