import ApiService from './ApiService'

export async function apiGetNotificationCount() {
    return ApiService.fetchData<{
        count: number
    }>({
        // url: '/notification/count',
        url: 'api/v1/notification/user-notifications',
        method: 'get',
    })
}

export async function apiGetNotificationList() {
    return ApiService.fetchData<
        {
            id: string
            target: string
            description: string
            date: string
            image: string
            type: number
            location: string
            locationLabel: string
            status: string
            readed: boolean
        }[]
    >({
        url: 'api/v1/notification/user-notifications',
        method: 'get',
    })
}

export async function apiGetSearchResult<T>(data: { query: string }) {
    return ApiService.fetchData<T>({
        url: '/search/query',
        method: 'post',
        data,
    })
}

export async function apiChangePassword(data: {
    currentPassword: string
    newPassword: string
}) {
    return ApiService.fetchData<{
        status: boolean
        message?: any
    }>({
        url: 'api/v1/user/change-password',
        method: 'post',
        data,
    })
}