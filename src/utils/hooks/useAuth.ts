import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig, { ROLE_BASED_PATHS } from '@/configs/app.config'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

type Status = true | false

function getAuthenticatedEntryPath(apiResponse: any): string {
    const role = apiResponse?.data?.data?.role || apiResponse?.data?.role;
    
    return ROLE_BASED_PATHS[role as keyof typeof ROLE_BASED_PATHS] 
}

function useAuth() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    console.log('Current auth state:', { token, signedIn, authenticated: token && signedIn })

    const signIn = async (
    values: SignInCredential,
): Promise<
    | {
          status: Status
          message: string
          data: any
      }
    | undefined
> => {
    try {
        console.log('Starting sign in process...')
        const resp = await apiSignIn(values)
        console.log('API Response:', resp)

        if (resp.data) {
            // ✅ Save entire response to localStorage
            localStorage.setItem('userdetails', JSON.stringify(resp.data))

            const token = resp.data.data?.token || resp.data.data?.accessToken || resp.data.token
            console.log('Token received:', token)

            dispatch(signInSuccess(token))
            console.log('signInSuccess dispatched')

            const userData = resp.data.data?.user || resp.data.user
            if (userData) {
                dispatch(
                    setUser(
                        userData || {
                            avatar: '',
                            userName: 'Anonymous',
                            authority: ['DOCTOR'],
                            email: '',
                        },
                    ),
                )
                console.log('User set:', userData)
            }

            if (token) {
                await new Promise(resolve => setTimeout(resolve, 100))

                const authenticatedEntryPath = getAuthenticatedEntryPath(resp.data)
                console.log('About to navigate to:', authenticatedEntryPath)
                navigate(authenticatedEntryPath)

                return {
                    status: true,
                    message: 'Sign in successful',
                    data: resp.data
                }
            } else {
                console.error('No token found in response')
                return {
                    status: false,
                    message: 'Authentication failed - no token received',
                    data: {}
                }
            }
        } else {
            console.log('No data in response')
            return {
                status: false,
                message: 'Invalid response from server',
                data: {}
            }
        }
    } catch (errors: any) {
        console.error('Sign in error:', errors)
        return {
            status: false,
            message: errors?.response?.data?.message || errors.toString(),
            data: {}
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
                    dispatch(
                        setUser(
                            resp.data.user || {
                                avatar: '',
                                userName: 'Anonymous',
                                authority: ['Doctor'],
                                email: '',
                            },
                        ),
                    )
                }
                
                await new Promise(resolve => setTimeout(resolve, 100))
                
                const authenticatedEntryPath = getAuthenticatedEntryPath(resp)
                navigate(authenticatedEntryPath)
                
                return {
                    status: true,
                    message: 'Sign up successful',
                }
            } else {
                return {
                    status: false,
                    message: 'Invalid response from server',
                }
            }
        } catch (errors: any) {
            console.error('Sign up error:', errors)
            return {
                status: false,
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            }),
        )
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