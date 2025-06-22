// configs/app.config.ts

export type AppConfig = {
    apiPrefix: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/app/account/kyc-form',
    locale: 'en',
    enableMock: true,
}

// Role-based entry paths (used dynamically in logic)
export const ROLE_BASED_PATHS: Record<string, string> = {
    business: '/app/sales/dashboard',
    doctor: '/app/project/dashboard',
    // Do not add a default fallback here
}

export default appConfig
