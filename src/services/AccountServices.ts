import ApiService from './ApiService'

export async function apiGetAccountSettingData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/setting',
        method: 'get',
    })
}

export async function apiGetAccountSettingIntegrationData<T>() {
    return ApiService.fetchData<T>({
        // url: '/account/setting/integration',
        url: '/api/v1/documents',
        method: 'get',
    })
}

export async function apiGetAccountSettingBillingData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/setting/billing',
        method: 'get',
    })
}

export async function apiGetAccountInvoiceData<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/account/invoice',
        method: 'get',
        params,
    })
}

export async function apiGetAccountLogData<
    T,
    U extends Record<string, unknown>,
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/account/log',
        method: 'post',
        data,
    })
}

export async function apiGetAccountFormData<T>(data: Partial<T>) {
    return ApiService.fetchData<T>({
        url: '/api/v1/user',
        method: 'patch',
        data,
    })
}

// ------------------------------------------
// Document POST Endpoint
// ------------------------------------------

export interface DocumentPayload {
    title: string
    content?: string // JSON stringified object or array
    files?: string[] // Optional array of file IDs/paths
}

export async function apiPostDocument<T = any>(data: DocumentPayload) {
    return ApiService.fetchData<T>({
        url: '/api/v1/documents',
        method: 'post',
        data: data as unknown as Record<string, unknown>,
    })
}


export interface UpdateDocumentPayload {
    title?: string
    content?: string // JSON stringified object
    filesToDelete?: string[] // Array of public_ids
    updatedFile?: File | null // Optional new file to replace old one
}

export async function apiUpdateDocument<T = any>(
    id: string,
    payload: UpdateDocumentPayload,
) {
    const formData = new FormData()

    if (payload.title) formData.append('title', payload.title)
    if (payload.content) formData.append('content', payload.content)
    if (payload.updatedFile) formData.append('Updated Medical License', payload.updatedFile)

    if (payload.filesToDelete?.length) {
        payload.filesToDelete.forEach(fileId => {
            formData.append('filesToDelete', fileId)
        })
    }

    return ApiService.fetchData<T>({
        url: `/api/v1/documents/${id}`,
        method: 'put',
        data: formData as any,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}
