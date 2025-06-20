// configs/app.config.ts
export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/app/dashboard', // Default fallback path
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/app/account/kyc-form',
    locale: 'en',
    enableMock: true,
}

// Role-based entry paths
export const ROLE_BASED_PATHS = {
    business: '/app/sales/dashboard',
    doctor: '/app/project/dashboard',
    // default: '/app/dashboard'
}

export default appConfig