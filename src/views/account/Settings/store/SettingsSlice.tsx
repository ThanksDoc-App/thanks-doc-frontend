import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiUpdateUser,
    apiChangeProfileImage,
    apiGetUserProfile,
} from '@/services/CommonService'

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
    // Profile image upload states
    profileImageLoading: boolean
    profileImageSuccess: boolean
    profileImageError: string | null
    profileImageData: {
        url: string
        public_id: string
    } | null
    // Get profile states
    getProfileLoading: boolean
    getProfileSuccess: boolean
    getProfileError: string | null
    profileData: any
}

// Initial state
const initialState: SettingsState = {
    updateUserLoading: false,
    updateUserSuccess: false,
    updateUserError: null,
    userData: null,
    // Profile image upload initial states
    profileImageLoading: false,
    profileImageSuccess: false,
    profileImageError: null,
    profileImageData: null,
    // Get profile initial states
    getProfileLoading: false,
    getProfileSuccess: false,
    getProfileError: null,
    profileData: null,
}

console.log('🏪 SettingsSlice initialState:', initialState)

// Async thunk for updating user
export const updateUserProfile = createAsyncThunk(
    'settings/updateUserProfile',
    async (userData: UserUpdatePayload, { rejectWithValue }) => {
        console.log('🔄 updateUserProfile thunk called with:', userData)
        try {
            const response = await apiUpdateUser(userData)
            console.log('✅ updateUserProfile success:', response)
            return response.data
        } catch (error: any) {
            console.error('❌ updateUserProfile error:', error)
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update profile',
            )
        }
    },
)

// Async thunk for changing profile image
export const changeProfileImage = createAsyncThunk(
    'settings/changeProfileImage',
    async (formData: FormData, { rejectWithValue }) => {
        console.log('🖼️ changeProfileImage thunk called with FormData')
        console.log('📦 FormData entries:')
        for (let pair of formData.entries()) {
            console.log(`   ${pair[0]}: ${pair[1]}`)
        }

        try {
            const response = await apiChangeProfileImage(formData)
            console.log('✅ changeProfileImage success:', response)
            return response.data
        } catch (error: any) {
            console.error('❌ changeProfileImage error:', error)
            return rejectWithValue(
                error.response?.data?.message ||
                    'Failed to upload profile image',
            )
        }
    },
)

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
    'settings/getUserProfile',
    async (_, { rejectWithValue }) => {
        console.log('🔥 getUserProfile thunk STARTED')
        console.log('📡 About to call apiGetUserProfile...')

        try {
            console.log('📞 Making API call to /api/v1/user/profile')
            const response = await apiGetUserProfile()
            console.log('✅ getUserProfile API Response received:', response)
            console.log('📦 Response data:', response.data)
            console.log('🔍 Response status:', response.status)
            console.log('💬 Response message:', response.message)
            return response.data
        } catch (error: any) {
            console.error('💥 getUserProfile API Error caught:', error)
            console.error('💥 Error message:', error.message)
            console.error('💥 Error response:', error.response)
            console.error('💥 Error status:', error.response?.status)
            console.error('💥 Error data:', error.response?.data)
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch profile',
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
            console.log('🔄 resetUpdateStatus called')
            state.updateUserSuccess = false
            state.updateUserError = null
        },
        // Clear error
        clearUpdateError: (state) => {
            console.log('🧹 clearUpdateError called')
            state.updateUserError = null
        },
        // Reset profile image status
        resetProfileImageStatus: (state) => {
            console.log('🔄 resetProfileImageStatus called')
            state.profileImageSuccess = false
            state.profileImageError = null
        },
        // Clear profile image error
        clearProfileImageError: (state) => {
            console.log('🧹 clearProfileImageError called')
            state.profileImageError = null
        },
        // Reset get profile status
        resetGetProfileStatus: (state) => {
            console.log('🔄 resetGetProfileStatus called')
            state.getProfileSuccess = false
            state.getProfileError = null
        },
        // Clear get profile error
        clearGetProfileError: (state) => {
            console.log('🧹 clearGetProfileError called')
            state.getProfileError = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Update user profile
            .addCase(updateUserProfile.pending, (state) => {
                console.log('⏳ updateUserProfile.pending')
                state.updateUserLoading = true
                state.updateUserSuccess = false
                state.updateUserError = null
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                console.log(
                    '✅ updateUserProfile.fulfilled with payload:',
                    action.payload,
                )
                state.updateUserLoading = false
                state.updateUserSuccess = true
                state.userData = action.payload
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                console.error(
                    '❌ updateUserProfile.rejected with error:',
                    action.payload,
                )
                state.updateUserLoading = false
                state.updateUserError = action.payload as string
            })
            // Change profile image
            .addCase(changeProfileImage.pending, (state) => {
                console.log('⏳ changeProfileImage.pending')
                state.profileImageLoading = true
                state.profileImageSuccess = false
                state.profileImageError = null
            })
            .addCase(changeProfileImage.fulfilled, (state, action) => {
                console.log(
                    '✅ changeProfileImage.fulfilled with payload:',
                    action.payload,
                )
                state.profileImageLoading = false
                state.profileImageSuccess = true
                state.profileImageData =
                    action.payload?.data?.profileImage || null
            })
            .addCase(changeProfileImage.rejected, (state, action) => {
                console.error(
                    '❌ changeProfileImage.rejected with error:',
                    action.payload,
                )
                state.profileImageLoading = false
                state.profileImageError = action.payload as string
            })
            // Get user profile
            .addCase(getUserProfile.pending, (state) => {
                console.log(
                    '⏳ getUserProfile.pending - setting loading to true',
                )
                console.log('📊 Current state before pending:', {
                    loading: state.getProfileLoading,
                    success: state.getProfileSuccess,
                    error: state.getProfileError,
                    data: state.profileData,
                })
                state.getProfileLoading = true
                state.getProfileSuccess = false
                state.getProfileError = null
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                console.log('✅ getUserProfile.fulfilled - data received')
                console.log('📦 Action payload:', action.payload)
                console.log('📊 State before update:', {
                    loading: state.getProfileLoading,
                    success: state.getProfileSuccess,
                    error: state.getProfileError,
                    data: state.profileData,
                })
                state.getProfileLoading = false
                state.getProfileSuccess = true
                state.profileData = action.payload
                console.log('📊 State after update:', {
                    loading: state.getProfileLoading,
                    success: state.getProfileSuccess,
                    error: state.getProfileError,
                    data: state.profileData,
                })
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                console.error('❌ getUserProfile.rejected - error occurred')
                console.error('💥 Action payload (error):', action.payload)
                console.error('💥 Action error:', action.error)
                console.log('📊 State before error update:', {
                    loading: state.getProfileLoading,
                    success: state.getProfileSuccess,
                    error: state.getProfileError,
                    data: state.profileData,
                })
                state.getProfileLoading = false
                state.getProfileError = action.payload as string
                console.log('📊 State after error update:', {
                    loading: state.getProfileLoading,
                    success: state.getProfileSuccess,
                    error: state.getProfileError,
                    data: state.profileData,
                })
            })
    },
})

console.log('🏪 SettingsSlice created with actions:', settingsSlice.actions)

export const {
    resetUpdateStatus,
    clearUpdateError,
    resetProfileImageStatus,
    clearProfileImageError,
    resetGetProfileStatus,
    clearGetProfileError,
} = settingsSlice.actions

console.log('📤 SettingsSlice exported actions:', {
    resetUpdateStatus,
    clearUpdateError,
    resetProfileImageStatus,
    clearProfileImageError,
    resetGetProfileStatus,
    clearGetProfileError,
})

console.log('📤 SettingsSlice exported reducer')
export default settingsSlice.reducer
