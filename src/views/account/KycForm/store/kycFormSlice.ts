import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetAccountFormData } from '@/services/AccountServices'

export type PersonalInformation = {
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
}

export type Identification = {
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

export type Address = {
    location: {
        country: string
        city: string
        state: string
        address1: string
        address2: string
        zipCode: string
    }
    isCorrespondenceAddressSame: boolean
    correspondenceAddress: {
        country: string
        city: string
        state: string
        address1: string
        address2: string
        zipCode: string
    }
}

type FormData = {
    personalInformation: PersonalInformation
    identification: Identification
    addressInformation: Address
}

export type StepStatus = Record<number, { status: string }>

type GetAccountFormDataResponse = FormData

export type KycFormState = {
    formData: FormData
    stepStatus: StepStatus
    currentStep: number
    loading: boolean
    error: string | null
}

export const SLICE_NAME = 'accountDetailForm'

export const getForm = createAsyncThunk(
    SLICE_NAME + '/getForm', 
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetAccountFormData<GetAccountFormDataResponse>({})
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const updateForm = createAsyncThunk(
    SLICE_NAME + '/updateForm',
    async (formData: Partial<FormData>, { rejectWithValue }) => {
        try {
            const response = await apiGetAccountFormData<GetAccountFormDataResponse>(formData)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const initialState: KycFormState = {
    formData: {
        personalInformation: {
            name: '',
            businessName: '',
            phone: '',
            gmcNumber: '',
            rating: 0,
            gender: '',
            location: {
                country: '',
                city: '',
                state: '',
                address1: '',
                address2: '',
                zipCode: '',
            },
            maritalStatus: '',
            countryCode: '',
            dateOfBirth: '',
            bio: '',
            website: '',
            category: '',
            isCorrespondenceAddressSame: true,
            correspondenceAddress: {
                country: '',
                city: '',
                state: '',
                address1: '',
                address2: '',
                zipCode: '',
            },
        },
        identification: {
            identityImages: {
                cover: {
                    url: '',
                    public_id: '',
                },
                back: {
                    url: '',
                    public_id: '',
                },
            },
        },
        addressInformation: {
            location: {
                country: '',
                city: '',
                state: '',
                address1: '',
                address2: '',
                zipCode: '',
            },
            isCorrespondenceAddressSame: true,
            correspondenceAddress: {
                country: '',
                city: '',
                state: '',
                address1: '',
                address2: '',
                zipCode: '',
            },
        },
    },
    stepStatus: {
        0: { status: 'pending' },
        1: { status: 'pending' },
        2: { status: 'pending' },
        3: { status: 'pending' },
    },
    currentStep: 0,
    loading: false,
    error: null,
}

const kycFormSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload }
        },
        setStepStatus: (state, action) => {
            state.stepStatus = { ...state.stepStatus, ...action.payload }
        },
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Form
            .addCase(getForm.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getForm.fulfilled, (state, action) => {
                state.loading = false
                state.formData = action.payload
                state.error = null
            })
            .addCase(getForm.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Form
            .addCase(updateForm.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateForm.fulfilled, (state, action) => {
                state.loading = false
                state.formData = { ...state.formData, ...action.payload }
                state.error = null
            })
            .addCase(updateForm.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { setFormData, setStepStatus, setCurrentStep, clearError } =
    kycFormSlice.actions

export default kycFormSlice.reducer
