import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import appConfig, { ROLE_BASED_PATHS } from '@/configs/app.config'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

type Status = true | false

function getAuthenticatedEntryPath(apiResponse: any): string {
    let role = apiResponse?.data?.data?.role || apiResponse?.data?.role
    if (role === 'super admin') role = 'admin'
    return ROLE_BASED_PATHS[role as keyof typeof ROLE_BASED_PATHS] || appConfig.unAuthenticatedEntryPath
}

function useAuth() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const query = useQuery()
    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (token && signedIn) {
            const EVENTS = ['mousemove', 'keydown', 'scroll', 'click']
            const resetTimer = () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current)
                localStorage.setItem('lastActive', Date.now().toString())
                timeoutRef.current = setTimeout(() => {
                    console.log('User inactive for 30 minutes. Logging out...')
                    handleSignOut()
                }, 30 * 60 * 1000)
            }
            EVENTS.forEach((event) => window.addEventListener(event, resetTimer))
            resetTimer()

            return () => {
                EVENTS.forEach((event) =>
                    window.removeEventListener(event, resetTimer)
                )
                if (timeoutRef.current) clearTimeout(timeoutRef.current)
            }
        }
    }, [token, signedIn])

    useEffect(() => {
        if (token && signedIn) {
            localStorage.setItem('lastActive', Date.now().toString())
        }
    }, [])

    const signIn = async (values: SignInCredential) => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                localStorage.setItem('userdetails', JSON.stringify(resp.data))
                localStorage.setItem('lastActive', Date.now().toString())

                const token = resp.data.data?.token || resp.data.data?.accessToken || resp.data.token
                dispatch(signInSuccess(token))

                const userData = resp.data.data?.user || resp.data.user
                if (userData) {
                    dispatch(setUser(userData || {
                        avatar: '',
                        userName: 'Anonymous',
                        authority: ['DOCTOR'],
                        email: '',
                    }))
                }

                if (token) {
                    await new Promise((resolve) => setTimeout(resolve, 100))
                    const authenticatedEntryPath = getAuthenticatedEntryPath(resp.data)
                    navigate(authenticatedEntryPath)
                    return { status: true, message: 'Sign in successful', data: resp.data }
                } else {
                    return { status: false, message: resp?.data?.message, data: {} }
                }
            } else {
                return { status: false, message: 'Invalid response from server', data: {} }
            }
        } catch (errors: any) {
            return {
                status: false,
                message: errors?.response?.data?.message || errors.toString(),
                data: {},
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(signInSuccess(token))
                if (resp.data.user) {
                    dispatch(setUser(resp.data.user))
                }

                localStorage.setItem('lastActive', Date.now().toString())
                await new Promise((resolve) => setTimeout(resolve, 100))
                const authenticatedEntryPath = getAuthenticatedEntryPath(resp)
                navigate(authenticatedEntryPath)

                return { status: true, message: 'Sign up successful' }
            } else {
                return { status: false, message: 'Invalid response from server' }
            }
        } catch (errors: any) {
            return {
                status: false,
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(setUser({ avatar: '', userName: '', email: '', authority: [] }))
        localStorage.removeItem('userdetails')
        localStorage.removeItem('lastActive')
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
