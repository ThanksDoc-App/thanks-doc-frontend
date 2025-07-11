import { apiPostDocument } from '@/services/AccountServices'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface DocumentPayload {
    title: string
    content?: string // JSON stringified object or array
    files?: string[] // Optional array of file IDs/paths
}

// Interface for file uploads
export interface DocumentPayloadWithFiles {
    title: string
    content?: string
    files?: File[] // File objects for multipart upload
}

export interface Document {
    id: string
    title: string
    content?: string
    files?: string[]
    createdAt: string
    updatedAt: string
    status: 'draft' | 'published' | 'archived'
}

interface DocumentState {
    documents: Document[]
    loading: boolean
    error: string | null
    currentDocument: Document | null
    uploadProgress: number
}

// Initial state
const initialState: DocumentState = {
    documents: [],
    loading: false,
    error: null,
    currentDocument: null,
    uploadProgress: 0,
}

// FIXED: Enhanced API function that strictly follows Swagger spec
const apiPostDocumentWithFiles = async (data: DocumentPayloadWithFiles) => {
    const formData = new FormData()
    
    // Only add fields that match Swagger specification
    formData.append('title', data.title)
    
    // Ensure content is properly stringified
    if (data.content) {
        formData.append('content', data.content)
    }
    
    // Add files with correct field name
    if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
            formData.append('files', file) // Use 'files' as specified in Swagger
        })
    }

    // Debug: Log what we're sending
    console.log('Sending FormData with fields:', Array.from(formData.keys()))
    console.log('Title:', data.title)
    console.log('Content length:', data.content?.length || 0)
    console.log('Files count:', data.files?.length || 0)
    
    return apiPostDocument(formData as any)
}

// Async thunks
export const createDocument = createAsyncThunk(
    'document/create',
    async (payload: DocumentPayload, { rejectWithValue }) => {
        try {
            const response = await apiPostDocument(payload)
            return response.data
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || 'Failed to create document'
            )
        }
    }
)

export const createDocumentWithoutFile = createAsyncThunk(
    'document/createWithoutFile',
    async (
        { title, additionalFields }: { title: string; additionalFields: Record<string, any> },
        { rejectWithValue }
    ) => {
        try {
            const payload: DocumentPayload = {
                title,
                content: JSON.stringify(additionalFields),
                // files array is omitted since no file upload is required
            }
            const response = await apiPostDocument(payload)
            return response.data
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || 'Failed to create document'
            )
        }
    }
)

// FIXED: Async thunk for file uploads with proper error handling
export const createDocumentWithFiles = createAsyncThunk(
    'document/createWithFiles',
    async (
        { title, additionalFields, files }: { 
            title: string
            additionalFields: Record<string, any>
            files: File[]
        },
        { rejectWithValue }
    ) => {
        try {
            // Validate inputs
            if (!title || typeof title !== 'string') {
                throw new Error('Title is required and must be a string')
            }

            const payload: DocumentPayloadWithFiles = {
                title,
                content: JSON.stringify(additionalFields),
                files: files || []
            }

            console.log('Creating document with payload:', {
                title: payload.title,
                contentLength: payload.content?.length,
                filesCount: payload.files?.length
            })

            const response = await apiPostDocumentWithFiles(payload)
            return response.data || response
        } catch (error: any) {
            console.error('Error in createDocumentWithFiles:', error)
            return rejectWithValue(
                error?.response?.data?.message || 
                error?.message || 
                'Failed to create document with files'
            )
        }
    }
)

// Document slice
const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        // Synchronous actions
        setCurrentDocument: (state, action: PayloadAction<Document | null>) => {
            state.currentDocument = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
        setUploadProgress: (state, action: PayloadAction<number>) => {
            state.uploadProgress = action.payload
        },
        addDocument: (state, action: PayloadAction<Document>) => {
            state.documents.unshift(action.payload)
        },
        updateDocument: (state, action: PayloadAction<{ id: string; updates: Partial<Document> }>) => {
            const { id, updates } = action.payload
            const index = state.documents.findIndex(doc => doc.id === id)
            if (index !== -1) {
                state.documents[index] = { ...state.documents[index], ...updates }
            }
        },
        removeDocument: (state, action: PayloadAction<string>) => {
            state.documents = state.documents.filter(doc => doc.id !== action.payload)
        },
        resetDocumentState: (state) => {
            return initialState
        },
    },
    extraReducers: (builder) => {
        builder
            // Create document cases
            .addCase(createDocument.pending, (state) => {
                state.loading = true
                state.error = null
                state.uploadProgress = 0
            })
            .addCase(createDocument.fulfilled, (state, action) => {
                state.loading = false
                state.documents.unshift(action.payload)
                state.currentDocument = action.payload
                state.uploadProgress = 100
            })
            .addCase(createDocument.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.uploadProgress = 0
            })
            // Create document without file cases
            .addCase(createDocumentWithoutFile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createDocumentWithoutFile.fulfilled, (state, action) => {
                state.loading = false
                state.documents.unshift(action.payload)
                state.currentDocument = action.payload
            })
            .addCase(createDocumentWithoutFile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create document with files cases
            .addCase(createDocumentWithFiles.pending, (state) => {
                state.loading = true
                state.error = null
                state.uploadProgress = 0
            })
            .addCase(createDocumentWithFiles.fulfilled, (state, action) => {
                state.loading = false
                state.documents.unshift(action.payload)
                state.currentDocument = action.payload
                state.uploadProgress = 100
            })
            .addCase(createDocumentWithFiles.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.uploadProgress = 0
                console.error('Document creation failed:', action.payload)
            })
    },
})

// Export actions
export const {
    setCurrentDocument,
    clearError,
    setUploadProgress,
    addDocument,
    updateDocument,
    removeDocument,
    resetDocumentState,
} = documentSlice.actions

// Selectors
export const selectDocuments = (state: { document: DocumentState }) => state.document.documents
export const selectCurrentDocument = (state: { document: DocumentState }) => state.document.currentDocument
export const selectDocumentLoading = (state: { document: DocumentState }) => state.document.loading
export const selectDocumentError = (state: { document: DocumentState }) => state.document.error
export const selectUploadProgress = (state: { document: DocumentState }) => state.document.uploadProgress

// Export reducer
export default documentSlice.reducer
