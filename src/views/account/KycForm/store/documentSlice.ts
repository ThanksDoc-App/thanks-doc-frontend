import { apiPostDocument } from '@/services/AccountServices'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface DocumentPayload {
    title: string
    content?: string
    files?: string[]
}

export interface DocumentPayloadWithFiles {
    title: string
    content?: string
    files?: File[]
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

const initialState: DocumentState = {
    documents: [],
    loading: false,
    error: null,
    currentDocument: null,
    uploadProgress: 0,
}

// FIXED: Create individual document uploads
const apiPostSingleDocument = async (data: DocumentPayloadWithFiles) => {
    const formData = new FormData()
    
    formData.append('title', data.title)
    
    if (data.content) {
        formData.append('content', data.content)
    }
    
    // Handle single file upload
    if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
            formData.append('files', file)
        })
    }

    console.log('Uploading single document:', data.title)
    return apiPostDocument(formData as any)
}

// FIXED: Create multiple documents individually
export const createMultipleDocuments = createAsyncThunk(
    'document/createMultiple',
    async (
        { documents }: { documents: DocumentPayloadWithFiles[] },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const results = []
            
            // Upload each document separately
            for (const doc of documents) {
                try {
                    const response = await apiPostSingleDocument(doc)
                    results.push(response.data || response)
                    
                    // Update progress
                    const progress = (results.length / documents.length) * 100
                    dispatch(setUploadProgress(progress))
                } catch (error: any) {
                    console.error(`Failed to upload document: ${doc.title}`, error)
                    // Continue with other documents instead of failing completely
                    results.push({
                        error: true,
                        title: doc.title,
                        message: error?.response?.data?.message || 'Upload failed'
                    })
                }
            }
            
            return results
        } catch (error: any) {
            console.error('Error in createMultipleDocuments:', error)
            return rejectWithValue(
                error?.message || 'Failed to create documents'
            )
        }
    }
)

// Keep existing single document upload
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
            if (!title || typeof title !== 'string') {
                throw new Error('Title is required and must be a string')
            }

            const payload: DocumentPayloadWithFiles = {
                title,
                content: JSON.stringify(additionalFields),
                files: files || []
            }

            const response = await apiPostSingleDocument(payload)
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

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
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
            // Single document upload
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
            })
            // Multiple documents upload
            .addCase(createMultipleDocuments.pending, (state) => {
                state.loading = true
                state.error = null
                state.uploadProgress = 0
            })
            .addCase(createMultipleDocuments.fulfilled, (state, action) => {
                state.loading = false
                // Add successful uploads to state
                const successfulUploads = action.payload.filter(result => !result.error)
                successfulUploads.forEach(doc => {
                    state.documents.unshift(doc)
                })
                state.uploadProgress = 100
            })
            .addCase(createMultipleDocuments.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.uploadProgress = 0
            })
    },
})

export const {
    setCurrentDocument,
    clearError,
    setUploadProgress,
    addDocument,
    updateDocument,
    removeDocument,
    resetDocumentState,
} = documentSlice.actions

export const selectDocuments = (state: { document: DocumentState }) => state.document.documents
export const selectCurrentDocument = (state: { document: DocumentState }) => state.document.currentDocument
export const selectDocumentLoading = (state: { document: DocumentState }) => state.document.loading
export const selectDocumentError = (state: { document: DocumentState }) => state.document.error
export const selectUploadProgress = (state: { document: DocumentState }) => state.document.uploadProgress

export default documentSlice.reducer
