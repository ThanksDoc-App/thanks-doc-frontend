import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { BUSINESS, DOCTOR } from '@/constants/roles.constant'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/views/auth/SignIn')),
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'signUp',
        path: `/sign-up`,
        component: lazy(() => import('@/views/auth/SignUp')),
        authority: [],
    },
    {
        key: 'signUpAs',
        path: `/sign-up-as`,
        component: lazy(() => import('@/views/auth/SignUp/SignUpAs')),
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSimple',
        path: `/sign-up-business`,
        component: lazy(
            () => import('@/views/auth-demo/SignUp/SignUpBusiness'),
        ),
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSimple',
        path: `/verify-email`,
        component: lazy(() => import('@/views/auth/SignUp/OTPEntry')),
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },

    {
        key: 'authentication.signUpSimple',
        path: `/sign-up-doctor`,
        component: lazy(() => import('@/views/auth-demo/SignUp/SignUpSimple')),
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'forgotPassword',
        path: `/forgot-password`,
        component: lazy(() => import('@/views/auth/ForgotPassword')),
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'resetPassword',
        path: `/reset-password`,
        component: lazy(() => import('@/views/auth/ResetPassword')),
        authority: [],
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default authRoute
