import ApiService from './ApiService'

export async function apiGetAccountSettingData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/setting',
        method: 'get',
    })
}

export async function apiGetAccountSettingIntegrationData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/setting/integration',
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
