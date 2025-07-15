import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiUpdateUser,
    apiChangeProfileImage,
    apiGetUserProfile,
    apiAddUserAccount,
    apiUpdateDocument,
} from '@/services/CommonService'

// Define interfaces
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

export interface AddAccountPayload {
    accountName: string
    accountNumber: string
    sortCode: string
}

// Updated interface to match Swagger specification
export interface UpdateDocumentPayload {
    title?: string
    content?: string
    files?: string[] // Array of file identifiers as per Swagger spec
    filesToDelete?: string[] // Added missing field for file deletion
}

interface SettingsState {
    updateUserLoading: boolean
    updateUserSuccess: boolean
    updateUserError: string | null
    userData: any
    profileImageLoading: boolean
    profileImageSuccess: boolean
    profileImageError: string | null
    profileImageData: {
        url: string
        public_id: string
    } | null
    getProfileLoading: boolean
    getProfileSuccess: boolean
    getProfileError: string | null
    profileData: any
    addAccountLoading: boolean
    addAccountSuccess: boolean
    addAccountError: string | null
    addAccountData: any
    updateDocumentLoading: boolean
    updateDocumentSuccess: boolean
    updateDocumentError: string | null
    updateDocumentData: any
}

const initialState: SettingsState = {
    updateUserLoading: false,
    updateUserSuccess: false,
    updateUserError: null,
    userData: null,
    profileImageLoading: false,
    profileImageSuccess: false,
    profileImageError: null,
    profileImageData: null,
    getProfileLoading: false,
    getProfileSuccess: false,
    getProfileError: null,
    profileData: null,
    addAccountLoading: false,
    addAccountSuccess: false,
    addAccountError: null,
    addAccountData: null,
    updateDocumentLoading: false,
    updateDocumentSuccess: false,
    updateDocumentError: null,
    updateDocumentData: null,
}

// Async thunks
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

export const changeProfileImage = createAsyncThunk(
    'settings/changeProfileImage',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await apiChangeProfileImage(formData)
            return response.data
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                    'Failed to upload profile image',
            )
        }
    },
)

export const getUserProfile = createAsyncThunk(
    'settings/getUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetUserProfile()
            return response.data
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch profile',
            )
        }
    },
)

export const addUserAccount = createAsyncThunk(
    'settings/addUserAccount',
    async (accountData: AddAccountPayload, { rejectWithValue }) => {
        try {
            const response = await apiAddUserAccount(accountData)
            return response.data
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to add user account',
            )
        }
    },
)

// Fixed updateDocument thunk with proper error handling
export const updateDocument = createAsyncThunk(
    'settings/updateDocument',
    async (
        { id, payload }: { id: string; payload: UpdateDocumentPayload },
        { rejectWithValue },
    ) => {
        try {
            console.log('Updating document with payload:', payload)
            const response = await apiUpdateDocument(id, payload)
            return response.data
        } catch (error: any) {
            console.error('Update document error:', error)
            return rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update document',
            )
        }
    },
)

// Create the slice
const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        resetUpdateStatus: (state) => {
            state.updateUserSuccess = false
            state.updateUserError = null
        },
        clearUpdateError: (state) => {
            state.updateUserError = null
        },
        resetProfileImageStatus: (state) => {
            state.profileImageSuccess = false
            state.profileImageError = null
        },
        clearProfileImageError: (state) => {
            state.profileImageError = null
        },
        resetGetProfileStatus: (state) => {
            state.getProfileSuccess = false
            state.getProfileError = null
        },
        clearGetProfileError: (state) => {
            state.getProfileError = null
        },
        resetAddAccountStatus: (state) => {
            state.addAccountSuccess = false
            state.addAccountError = null
        },
        clearAddAccountError: (state) => {
            state.addAccountError = null
        },
        resetUpdateDocumentStatus: (state) => {
            state.updateDocumentSuccess = false
            state.updateDocumentError = null
        },
        clearUpdateDocumentError: (state) => {
            state.updateDocumentError = null
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
            // Change profile image
            .addCase(changeProfileImage.pending, (state) => {
                state.profileImageLoading = true
                state.profileImageSuccess = false
                state.profileImageError = null
            })
            .addCase(changeProfileImage.fulfilled, (state, action) => {
                state.profileImageLoading = false
                state.profileImageSuccess = true
                state.profileImageData =
                    action.payload?.data?.profileImage || null
            })
            .addCase(changeProfileImage.rejected, (state, action) => {
                state.profileImageLoading = false
                state.profileImageError = action.payload as string
            })
            // Get user profile
            .addCase(getUserProfile.pending, (state) => {
                state.getProfileLoading = true
                state.getProfileSuccess = false
                state.getProfileError = null
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.getProfileLoading = false
                state.getProfileSuccess = true
                state.profileData = action.payload
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.getProfileLoading = false
                state.getProfileError = action.payload as string
            })
            // Add user account
            .addCase(addUserAccount.pending, (state) => {
                state.addAccountLoading = true
                state.addAccountSuccess = false
                state.addAccountError = null
            })
            .addCase(addUserAccount.fulfilled, (state, action) => {
                state.addAccountLoading = false
                state.addAccountSuccess = true
                state.addAccountData = action.payload
            })
            .addCase(addUserAccount.rejected, (state, action) => {
                state.addAccountLoading = false
                state.addAccountError = action.payload as string
            })
            // Update document - Enhanced with better error handling
            .addCase(updateDocument.pending, (state) => {
                state.updateDocumentLoading = true
                state.updateDocumentSuccess = false
                state.updateDocumentError = null
            })
            .addCase(updateDocument.fulfilled, (state, action) => {
                state.updateDocumentLoading = false
                state.updateDocumentSuccess = true
                state.updateDocumentData = action.payload
            })
            .addCase(updateDocument.rejected, (state, action) => {
                state.updateDocumentLoading = false
                state.updateDocumentError = action.payload as string
            })
    },
})

export const {
    resetUpdateStatus,
    clearUpdateError,
    resetProfileImageStatus,
    clearProfileImageError,
    resetGetProfileStatus,
    clearGetProfileError,
    resetAddAccountStatus,
    clearAddAccountError,
    resetUpdateDocumentStatus,
    clearUpdateDocumentError,
} = settingsSlice.actions

export default settingsSlice.reducer
