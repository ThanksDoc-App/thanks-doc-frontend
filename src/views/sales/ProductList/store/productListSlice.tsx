import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSalesProducts,
    apiDeleteSalesProducts,
    apiUpdateJobStatus, // Add this import
} from '@/services/SalesService'
import type { TableQueries } from '@/@types/common'

type Product = {
    id: string
    name: string
    productCode: string
    img: string
    category: string
    price: number
    stock: number
    status: number
}

type Products = Product[]

type GetSalesProductsResponse = {
    data: Products
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type SalesProductListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProduct: string
    tableData: TableQueries
    filterData: FilterQueries
    productList: Product[]
    updatingStatus: boolean // Add loading state for status updates
}

type GetSalesProductsRequest = TableQueries & { filterData?: FilterQueries }

// Add type for job status update
type UpdateJobStatusRequest = {
    id: string | number
    status: string // e.g., 'completed', 'pending', 'in-progress'
}

export const SLICE_NAME = 'salesProductList'

export const getProducts = createAsyncThunk(
    SLICE_NAME + '/getProducts',
    async (data: GetSalesProductsRequest) => {
        const response = await apiGetSalesProducts<
            GetSalesProductsResponse,
            GetSalesProductsRequest
        >(data)
        return response.data
    },
)

// Add async thunk for updating job status
export const updateJobStatus = createAsyncThunk(
    SLICE_NAME + '/updateJobStatus',
    async (data: UpdateJobStatusRequest) => {
        const response = await apiUpdateJobStatus<
            { success: boolean; message: string },
            { status: string }
        >(data.id, { status: data.status })
        return { ...response.data, jobId: data.id, newStatus: data.status }
    },
)

export const deleteProduct = async (data: { id: string | string[] }) => {
    const response = await apiDeleteSalesProducts<
        boolean,
        { id: string | string[] }
    >(data)
    return response.data
}

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

const initialState: SalesProductListState = {
    loading: false,
    deleteConfirmation: false,
    selectedProduct: '',
    productList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices'],
        status: [0, 1, 2],
        productStatus: 0,
    },
    updatingStatus: false, // Initialize status update loading state
}

const productListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProductList: (state, action) => {
            state.productList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload
        },
        // Add reducer to update job status locally
        updateJobStatusLocally: (state, action) => {
            const { jobId, status } = action.payload
            const jobIndex = state.productList.findIndex(
                (job) => job.id === jobId,
            )
            if (jobIndex !== -1) {
                state.productList[jobIndex].status =
                    status === 'completed' ? 1 : 0
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getProducts.pending, (state) => {
                state.loading = true
            })
            // Add cases for job status update
            .addCase(updateJobStatus.pending, (state) => {
                state.updatingStatus = true
            })
            .addCase(updateJobStatus.fulfilled, (state, action) => {
                state.updatingStatus = false
                // Update the job status in the local state
                const { jobId, newStatus } = action.payload
                const jobIndex = state.productList.findIndex(
                    (job) => job.id === jobId,
                )
                if (jobIndex !== -1) {
                    state.productList[jobIndex].status =
                        newStatus === 'completed' ? 1 : 0
                }
            })
            .addCase(updateJobStatus.rejected, (state) => {
                state.updatingStatus = false
            })
    },
})

export const {
    updateProductList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedProduct,
    updateJobStatusLocally,
} = productListSlice.actions

export default productListSlice.reducer
