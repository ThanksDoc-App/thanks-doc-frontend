import ApiService from './ApiService'

export async function apiGetCrmDashboardData<T>() {
    return ApiService.fetchData<T>({
        url: '/api/v1/admin',
        method: 'get',
    })
}

export async function apiGetCrmCalendar<T>() {
    return ApiService.fetchData<T>({
        url: '/crm/calendar',
        method: 'get',
    })
}

export async function apiGetCrmCustomers<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchData<T>({
        url: '/crm/customers',
        method: 'post',
        data,
    })
}

export async function apiGetCrmCustomersStatistic<T>() {
    return ApiService.fetchData<T>({
        url: '/crm/customers-statistic',
        method: 'get',
    })
}

export async function apPutCrmCustomer<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchData<T>({
        url: '/crm/customers',
        method: 'put',
        data,
    })
}

export async function apiGetCrmCustomerDetails<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchData<T>({
        url: '/crm/customer-details',
        method: 'get',
        params,
    })
}

export async function apiDeleteCrmCustomer<T, U extends Record<string, unknown>>(data: U) {
    return ApiService.fetchData<T>({
        url: '/crm/customer/delete',
        method: 'delete',
        data,
    })
}

export async function apiGetCrmMails<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchData<T>({
        url: '/crm/mails',
        method: 'get',
        params,
    })
}

export async function apiGetCrmMail<T, U extends Record<string, unknown>>(params: U) {
    return ApiService.fetchData<T>({
        url: '/crm/mail',
        method: 'get',
        params,
    })
}

import BaseService from './BaseService'

export async function apiGetAdminDashboard<T>() {
    return BaseService.request<T>({
        url: '/api/v1/dashboard/stats/admin',
        method: 'get',
    });
}

export async function apiCreateCategory<T, U extends Record<string, unknown>>(data: U) {
    return BaseService.request<T>({
        url: '/api/v1/category',
        method: 'post',
        data,
    })
}

export async function apiGetCategories<T>() {
    return BaseService.request<T>({
        url: '/api/v1/category',
        method: 'get',
    });
}

export async function apiCreateService<T, U extends Record<string, unknown>>(data: U) {
    return BaseService.request<T>({
        url: '/api/v1/service',
        method: 'post',
        data,
    })
}

export async function apiGetServices<T>() {
    return BaseService.request<T>({
        url: '/api/v1/service',
        method: 'get',
    });
}

export async function apiDeleteService<T>(id: string | number) {
    return BaseService.request<T>({
        url: `/api/v1/service/${id}`,
        method: 'delete',
    });
}

export async function apiDeleteCateory<T>(id: string | number) {
    return BaseService.request<T>({
        url: `/api/v1/category/${id}`,
        method: 'delete',
    });
}

export async function apiGetDoctors<T>() {
    return BaseService.request<T>({
        url: '/api/v1/admin?userType=doctor',
        method: 'get',
    });
}

export async function apiGetBusiness<T>() {
    return BaseService.request<T>({
        url: '/api/v1/admin?userType=business',
        method: 'get',
    });
}

export async function apiGetPaymentHistory<
    T,
    U extends {
        page?: number
        limit?: number
        doctorId?: string
        businessOwnerId?: string
        jobId?: string
        timeframe?: string
    }
>(params: U) {
    return BaseService.request<T>({
        url: '/api/v1/payment/admin/history',
        method: 'get',
        params,
    });
}

export async function apiCreateJob<T, U extends Record<string, unknown>>(data: U) {
    return BaseService.request<T>({
        url: '/api/v1/job/create',
        method: 'post',
        data,
    });
}

export async function apiGetUserAccount<T>(userId: string) {
    return BaseService.request<T>({
        url: `/api/v1/account/get-user-account/${userId}`,
        method: 'get',
    });
}

export async function apiPayForJob<T>(id: string) {
    return BaseService.request<T>({
        url: `/api/v1/job/${id}/pay-for-job`,
        method: 'post',
    });
}

export async function apiGetDocumentsByUser<
    T,
    U extends {
        userId: string
        page?: number
        limit?: number
        search?: string
        status?: string
    }
>(params: U) {
    return BaseService.request<T>({
        url: '/api/v1/documents/by-user',
        method: 'get',
        params,
    });
}

/**
 * Approve or reject a document.
 *
 * @param id      The document’s ID (path param)
 * @param status  "approved" | "rejected" (request body)
 */
export async function apiApproveRejectDocument<T>(
    id: string,
    status: 'approved' | 'rejected',
) {
    return BaseService.request<T>({
        url: `/api/v1/documents/${id}/approve-reject`,
        method: 'post',
        data: { status },
    });
}
