import { apiGetDocumentsByUser } from '@/services/CrmService'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Updated types based on your actual API response
export interface DocumentContent {
    expiryDate?: string
    documentRef?: string
    fullName?: string
    email?: string
    documentTitle?: string
}

export interface DocumentItem {
    label?: string
    title?: string
    content: DocumentContent
}

export interface DocumentMetadata {
    submittedAt: string
    selectedDocumentType: string
    userAgent: string
    timestamp: number
}

export interface DocumentFile {
    url: string
    public_id: string
}

export interface User {
    _id: string
    name: string
    email: string
}

export interface Document {
    _id: string
    title: string
    user: User
    status: 'pending' | 'approved' | 'rejected' | 'under_review'
    content: {
        documents: DocumentItem[]
        metadata: DocumentMetadata
    }
    files: DocumentFile[]
    createdAt: string
    updatedAt: string
    __v: number
}

export interface DocumentsState {
    documents: Document[]
    loading: boolean
    error: string | null
    pagination: {
        currentPage: number | null
        totalPages: number | null
        totalItems: number
        limit: number
    }
    filters: {
        search: string
        status: string
    }
}

export interface GetDocumentsByUserParams {
    userId: string
    page?: number
    limit?: number
    search?: string
    status?: string
}

export interface GetDocumentsByUserResponse {
    status: boolean
    statusCode: number
    message: string
    data: {
        documents: Document[]
        totalDocuments: number
        totalPages: number | null
        currentPage: number | null
    }
}

// Initial state
const initialState: DocumentsState = {
    documents: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: null,
        totalPages: null,
        totalItems: 0,
        limit: 10,
    },
    filters: {
        search: '',
        status: '',
    },
}

// Async thunks
export const getDocumentsByUser = createAsyncThunk<
    GetDocumentsByUserResponse['data'],
    GetDocumentsByUserParams,
    { rejectValue: string }
>(
    'documents/getDocumentsByUser',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiGetDocumentsByUser<GetDocumentsByUserResponse, GetDocumentsByUserParams>(params)
            return response.data.data // Extract the data property from the response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch documents'
            )
        }
    }
)

// Slice
const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setFilters: (state, action: PayloadAction<Partial<DocumentsState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearFilters: (state) => {
            state.filters = {
                search: '',
                status: '',
            }
        },
        updateDocumentStatus: (state, action: PayloadAction<{ id: string; status: Document['status'] }>) => {
            const { id, status } = action.payload
            const document = state.documents.find(doc => doc._id === id)
            if (document) {
                document.status = status
                document.updatedAt = new Date().toISOString()
            }
        },
        removeDocument: (state, action: PayloadAction<string>) => {
            state.documents = state.documents.filter(doc => doc._id !== action.payload)
            state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1)
        },
    },
    extraReducers: (builder) => {
        builder
            // Get documents by user
            .addCase(getDocumentsByUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getDocumentsByUser.fulfilled, (state, action) => {
                state.loading = false
                state.documents = action.payload.documents || []
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalItems: action.payload.totalDocuments,
                    limit: state.pagination.limit,
                }
                state.error = null
            })
            .addCase(getDocumentsByUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Failed to fetch documents'
                state.documents = [] // ✅ Ensure documents is always an array
            })
    },
})

// Actions
export const {
    clearError,
    setFilters,
    clearFilters,
    updateDocumentStatus,
    removeDocument,
} = documentsSlice.actions

// ✅ Fixed Selectors with proper null/undefined checks
export const selectDocuments = (state: { documents: DocumentsState }) => 
    state.documents?.documents || []

export const selectDocumentsLoading = (state: { documents: DocumentsState }) => 
    state.documents?.loading || false

export const selectDocumentsError = (state: { documents: DocumentsState }) => 
    state.documents?.error || null

export const selectDocumentsPagination = (state: { documents: DocumentsState }) => 
    state.documents?.pagination || initialState.pagination

export const selectDocumentsFilters = (state: { documents: DocumentsState }) => 
    state.documents?.filters || initialState.filters

// ✅ Enhanced selectors with proper null checks
export const selectAllDocumentItems = (state: { documents: DocumentsState }) => {
    const documents = state.documents?.documents || []
    return documents.flatMap(doc => 
        (doc.content?.documents || []).map(item => ({
            ...item,
            parentDocumentId: doc._id,
            parentTitle: doc.title,
            parentStatus: doc.status,
            user: doc.user,
            createdAt: doc.createdAt,
            files: doc.files || [],
        }))
    )
}

// ✅ Fixed filtered selectors with null checks
export const selectFilteredDocuments = (state: { documents: DocumentsState }) => {
    const documents = state.documents?.documents || []
    const filters = state.documents?.filters || initialState.filters
    
    return documents.filter(doc => {
        const matchesSearch = !filters.search || 
            doc.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
            doc.user?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            doc.user?.email?.toLowerCase().includes(filters.search.toLowerCase())
        const matchesStatus = !filters.status || doc.status === filters.status
        return matchesSearch && matchesStatus
    })
}

export const selectDocumentsByStatus = (status: Document['status']) => 
    (state: { documents: DocumentsState }) => {
        const documents = state.documents?.documents || []
        return documents.filter(doc => doc.status === status)
    }

export const selectDocumentById = (id: string) => 
    (state: { documents: DocumentsState }) => {
        const documents = state.documents?.documents || []
        return documents.find(doc => doc._id === id)
    }

// ✅ Fixed document items selectors with null checks
export const selectDocumentItemsByType = (type: string) => 
    (state: { documents: DocumentsState }) => {
        const documents = state.documents?.documents || []
        return documents.flatMap(doc => 
            (doc.content?.documents || [])
                .filter(item => (item.label || item.title)?.toLowerCase().includes(type.toLowerCase()))
                .map(item => ({
                    ...item,
                    parentDocumentId: doc._id,
                    parentStatus: doc.status,
                    user: doc.user,
                }))
        )
    }

export const selectExpiredDocuments = (state: { documents: DocumentsState }) => {
    const documents = state.documents?.documents || []
    const now = new Date()
    return documents.flatMap(doc => 
        (doc.content?.documents || [])
            .filter(item => {
                if (item.content?.expiryDate) {
                    return new Date(item.content.expiryDate) < now
                }
                return false
            })
            .map(item => ({
                ...item,
                parentDocumentId: doc._id,
                parentStatus: doc.status,
                user: doc.user,
            }))
    )
}

export const selectPendingDocuments = (state: { documents: DocumentsState }) => {
    const documents = state.documents?.documents || []
    return documents.filter(doc => doc.status === 'pending')
}

export const selectApprovedDocuments = (state: { documents: DocumentsState }) => {
    const documents = state.documents?.documents || []
    return documents.filter(doc => doc.status === 'approved')
}

export const selectRejectedDocuments = (state: { documents: DocumentsState }) => {
    const documents = state.documents?.documents || []
    return documents.filter(doc => doc.status === 'rejected')
}

export default documentsSlice.reducer
