import ApiService from './ApiService'

export async function apiGetProjectDashboardData() {
    return ApiService.fetchData({
        url: '/api/v1/job/browse',
        method: 'get',
    })
}

export async function apiGetProjectList<U>(data: U) {
    return ApiService.fetchData({
        url: '/project/list',
        method: 'post',
        data,
    })
}

export async function apiPutProjectList<U>(data: U) {
    return ApiService.fetchData({
        url: '/project/list/add',
        method: 'put',
        data,
    })
}

export async function apiGetScrumBoards() {
    return ApiService.fetchData({
        url: '/project/scrum-board/boards',
        method: 'post',
    })
}

export async function apiGetScrumBoardtMembers() {
    return ApiService.fetchData({
        url: '/project/scrum-board/members',
        method: 'post',
    })
}

export async function apiGetScrumBoardtTicketDetail(id: string) {
    return ApiService.fetchData({
        url: `/api/v1/job/${id}`,
        method: 'get',
    })
}
export async function apiAcceptJob(id: string) {
    return ApiService.fetchData({
        url: `/api/v1/job/${id}/accept-job`,
        method: 'post',
    });
}



// ✅ New GET endpoint
export async function apiGetAcceptedJobs() {
    return ApiService.fetchData({
        url: '/api/v1/job/accepted-jobs',
        method: 'get',
    })
}

export async function apiGetJobBrowse() {
    return ApiService.fetchData({
        url: '/api/v1/job/mine',
        method: 'get',
    })
}
