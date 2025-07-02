// servicesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { apiGetServices, apiDeleteService } from '@/services/CrmService'

// Define service interface based on API output
export interface Service {
  _id: string
  name: string
  category: string
  price: number | string
  
}

// Define API response shape
interface ApiResponse {
  status: boolean
  statusCode: number
  message: string
    currentPage: number | null
    services: Service[]
    totalPages: number | null
    totalServices: number
  data: any
}

// Define slice state
interface ServicesState {
  services: Service[]
  loading: boolean
  error: string | null
  totalServices: number
  totalPages: number 
  currentPage: number 
  deleteLoading: boolean
  deleteError: string | null
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
  totalServices: 0,
  totalPages: 0,
  currentPage: 1,
  deleteLoading: false,
  deleteError: null,
}

// Async thunk to fetch services
export const fetchServices = createAsyncThunk<
  // fulfilled value
  {
    services: Service[]
    totalServices: number
    totalPages: number | null
    currentPage: number | null
  },
  // no argument
  void,
  {
    rejectValue: string
  }
>('services/fetchServices', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGetServices<ApiResponse>()
    const apiData =
      'data' in response && typeof response.data === 'object'
        ? response.data
        : response

        console.log("response", response);
        

    if (
      !apiData ||
      !apiData.data ||
      !Array.isArray(apiData.data.services)
    ) {
      throw new Error('Invalid response structure')
    }

    return {
      services: apiData.data.services,
      totalServices: apiData.data.totalServices,
      totalPages: apiData.data.totalPages,
      currentPage: apiData.data.currentPage,
    }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

// Async thunk to delete service
export const deleteService = createAsyncThunk<
  // fulfilled value
  string, // service id that was deleted
  // argument
  string,
  {
    rejectValue: string
  }
>('services/deleteService', async (serviceId: string, { rejectWithValue }) => {
  try {
    await apiDeleteService<any>(serviceId)
    return serviceId
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message)
  }
})

export const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
      state.deleteError = null
    },
    clearServices(state) {
      state.services = []
      state.totalServices = 0
      state.totalPages = 0
      state.currentPage = 1
    },
  },
  extraReducers: builder => {
    builder
      // Fetch services cases
      .addCase(fetchServices.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchServices.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: Service[]
            totalServices: number
            totalPages: number | null
            currentPage: number | null
          }>,
        ) => {
          state.loading = false
          state.services = action.payload.services
          state.totalServices = action.payload.totalServices
          state.totalPages = action.payload.totalPages ?? 0
          state.currentPage = action.payload.currentPage ?? 1
        },
      )
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? action.error.message ?? null
      })
      // Delete service cases
      .addCase(deleteService.pending, state => {
        state.deleteLoading = true
        state.deleteError = null
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.deleteLoading = false
        // Remove the deleted service from the array
        state.services = state.services.filter(
          service => service._id !== action.payload
        )
        // Update total count if available
        if (state.totalServices !== undefined) {
          state.totalServices = state.totalServices - 1
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.deleteLoading = false
        state.deleteError = action.payload ?? action.error.message ?? null
      })
  },
})

export const { clearError, clearServices } = servicesSlice.actions

// Selectors
export const selectServices = (state: RootState) =>
  state.services.services
export const selectServicesLoading = (state: RootState) =>
  state.services.loading
export const selectServicesError = (state: RootState) =>
  state.services.error
export const selectTotalServices = (state: RootState) =>
  state.services.totalServices
export const selectTotalPages = (state: RootState) =>
  state.services.totalPages
export const selectCurrentPage = (state: RootState) =>
  state.services.currentPage
export const selectDeleteLoading = (state: RootState) =>
  state.services.deleteLoading
export const selectDeleteError = (state: RootState) =>
  state.services.deleteError

export default servicesSlice.reducer