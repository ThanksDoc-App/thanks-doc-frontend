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


// Change profile image endpoint
export async function apiChangeProfileImage(data: FormData) {
    return ApiService.fetchData<{
        status: boolean
        message?: string
        data?: {
            profileImage: {
                url: string
                public_id: string
            }
        }
    }>({
        url: '/api/v1/user/profile-image',
        method: 'post',
        data: data as any,
    })
}


// Add this to your existing API endpoints
export async function apiAddAdmin(data: {
    email: string
    name: string
    password: string
}) {
    return ApiService.fetchData<{
        status: boolean
        message?: string
    }>({
        url: '/api/v1/admin/add-admin',
        method: 'post',
        data,
    })
}


// services/CommonService.ts
export async function apiGetAdmins() {
    return ApiService.fetchData<{
        data: {
            users: {
                _id: string
                name: string
                email: string
            }[]
        }
    }>({
        url: '/api/v1/admin?userType=admin',
        method: 'get',
    })
}


// Update user profile endpoint
export async function apiUpdateUser(data: {
    name: string
    businessName: string
    phone: string
    gmcNumber: string
    rating: number
    gender: string
    location: {
        country: string
        city: string
        state: string
        address1: string
        address2: string
        zipCode: string
    }
    maritalStatus: string
    countryCode: string
    dateOfBirth: string
    bio: string
    website: string
    category: string
    isCorrespondenceAddressSame: boolean
    correspondenceAddress: {
        country: string
        city: string
        state: string
        address1: string
        address2: string
        zipCode: string
    }
    identityImages: {
        cover: {
            url: string
            public_id: string
        }
        back: {
            url: string
            public_id: string
        }
    }
}) {
    return ApiService.fetchData<{
        status: boolean
        message?: string
        data?: any
    }>({
        url: '/api/v1/user',
        method: 'patch',
        data,
    })
}

// Get user profile endpoint
export async function apiGetUserProfile() {
    return ApiService.fetchData<{
        status: boolean
        message?: string
        data?: {
            _id: string
            name: string
            email: string
            phone: string
            businessName?: string
            gmcNumber?: string
            rating?: number
            gender?: string
            location?: {
                country: string
                city: string
                state: string
                address1: string
                address2: string
                zipCode: string
            }
            maritalStatus?: string
            countryCode?: string
            dateOfBirth?: string
            bio?: string
            website?: string
            category?: string
            profileImage?: {
                url: string
                public_id: string
            }
            isCorrespondenceAddressSame?: boolean
            correspondenceAddress?: {
                country: string
                city: string
                state: string
                address1: string
                address2: string
                zipCode: string
            }
            identityImages?: {
                cover: {
                    url: string
                    public_id: string
                }
                back: {
                    url: string
                    public_id: string
                }
            }
            createdAt?: string
            updatedAt?: string
        }
    }>({
        url: '/api/v1/user/profile',
        method: 'get',
    })
}
// Add user account endpoint
export async function apiAddUserAccount(data: {
    accountName: string
    accountNumber: string
    sortCode: string
}) {
    return ApiService.fetchData<{
        status: boolean
        message?: string
        data?: any
    }>({
        url: '/api/v1/account/add-account',
        method: 'post',
        data,
    })
}

// ✅ Fixed API function to properly handle multipart/form-data according to Swagger spec


export type UpdateDocumentPayload = {
    title?: string
    content?: string
    files?: File  // Single File object for actual upload
    filesToDelete?: string[]
}

export async function apiUpdateDocument<T = any>(
    id: string,
    payload: UpdateDocumentPayload,
) {
    const formData = new FormData()
    
    if (payload.title !== undefined) {
        formData.append('title', payload.title)
    }
    
    if (payload.content !== undefined) {
        formData.append('content', payload.content)
    }
    
    // Handle actual file upload
    if (payload.files) {
        formData.append('files', payload.files)
    }
    
    // Handle files to delete
    if (payload.filesToDelete && payload.filesToDelete.length > 0) {
        payload.filesToDelete.forEach(fileId => {
            formData.append('filesToDelete', fileId)
        })
    }
    
    // Debug logging
    console.log('FormData contents:')
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
    }
    
    return ApiService.fetchData<T>({
        url: `/api/v1/documents/${id}`,
        method: 'PUT',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

// ... rest of your existing API functions
export async function apiDeleteDocument(documentId: string, filesToDelete: string[]) {
    return ApiService.fetchData<{
        status: boolean
        message?: string
    }>({
        url: `/api/v1/documents/${documentId}/files`,
        method: 'delete',
        data: {
            filesToDelete: filesToDelete
        }
    })
}
