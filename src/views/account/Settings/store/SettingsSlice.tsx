import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiUpdateUser } from '@/services/CommonService'

// Define the user update payload type
export interface UserUpdatePayload {
    name: string
    businessName: string
    phone: string
    gmcNumber: string
    rating: number
    gender: string
    location: {
        country: string
        city: string
        state: string
        address1: string
        address2: string
        zipCode: string
    }
    maritalStatus: string
    countryCode: string
    dateOfBirth: string
    bio: string
    website: string
    category: string
    isCorrespondenceAddressSame: boolean
    correspondenceAddress: {
        country: string
        city: string
        state: string
        address1: string
        address2: string
        zipCode: string
    }
    identityImages: {
        cover: {
            url: string
            public_id: string
        }
        back: {
            url: string
            public_id: string
        }
    }
}

// Define the state interface
interface SettingsState {
    updateUserLoading: boolean
    updateUserSuccess: boolean
    updateUserError: string | null
    userData: any
}

// Initial state
const initialState: SettingsState = {
    updateUserLoading: false,
    updateUserSuccess: false,
    updateUserError: null,
    userData: null,
}

// Async thunk for updating user
export const updateUserProfile = createAsyncThunk(
    'settings/updateUserProfile',
    async (userData: UserUpdatePayload, { rejectWithValue }) => {
        try {
            const response = await apiUpdateUser(userData)
            return response.data
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update profile',
            )
        }
    },
)

// Create the slice
const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        // Reset update status
        resetUpdateStatus: (state) => {
            state.updateUserSuccess = false
            state.updateUserError = null
        },
        // Clear error
        clearUpdateError: (state) => {
            state.updateUserError = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Update user profile
            .addCase(updateUserProfile.pending, (state) => {
                state.updateUserLoading = true
                state.updateUserSuccess = false
                state.updateUserError = null
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.updateUserLoading = false
                state.updateUserSuccess = true
                state.userData = action.payload
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.updateUserLoading = false
                state.updateUserError = action.payload as string
            })
    },
})

export const { resetUpdateStatus, clearUpdateError } = settingsSlice.actions
export default settingsSlice.reducer
