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

export async function apiGetCrmCustomers<T, U extends Record<string, unknown>>(
    data: U,
) {
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

export async function apPutCrmCustomer<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/crm/customers',
        method: 'put',
        data,
    })
}

export async function apiGetCrmCustomerDetails<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/crm/customer-details',
        method: 'get',
        params,
    })
}

export async function apiDeleteCrmCustomer<
    T,
    U extends Record<string, unknown>,
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/crm/customer/delete',
        method: 'delete',
        data,
    })
}

export async function apiGetCrmMails<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchData<T>({
        url: '/crm/mails',
        method: 'get',
        params,
    })
}

export async function apiGetCrmMail<T, U extends Record<string, unknown>>(
    params: U,
) {
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
        url: '/api/v1/category', // this will be prefixed by VITE_API_URL
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
        url: '/api/v1/service', // this will be prefixed by VITE_API_URL
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
        url: `/api/v1/service/${id}`, // dynamic id in the URL
        method: 'delete',
    });
}
export async function apiDeleteCateory<T>(id: string | number) {
    return BaseService.request<T>({
        url: `/api/v1/category/${id}`, // dynamic id in the URL
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

export async function apiCreateJob<T, U extends Record<string, unknown>>(data: U) {
    return BaseService.request<T>({
        url: '/api/v1/job/create',
        method: 'post',
        data,
    });
}
