export type SignInCredential = {
    userName?: string
    password: string
    email?: string
}

export type SignInResponse = {
    token: string
    user: {
        userName: string
        authority: string[]
        avatar: string
        email: string
    }
    message?: any
    status: boolean
    data?: any
}
export type OTPResponse = {    
    message?: any
    status: boolean
}

export type SignUpResponse = SignInResponse

    export type SignUpCredential = {
        name: string
        email: string
        password: string
        signedUpAs: string
    }
    
    export type VerifyOtpPayload = {
    otp: number;
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
    resetToken: any
}
