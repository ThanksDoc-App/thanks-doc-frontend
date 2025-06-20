import { APP_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { DOCTOR, BUSINESS } from '@/constants/roles.constant'
// import { DOCTOR, BUSINESS, ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const baseConfig: NavigationTree[] = [
    {
        key: 'apps',
        path: '',
        title: 'APPS',
        translateKey: 'nav.apps',
        icon: 'apps',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [DOCTOR, BUSINESS],
        subMenu: [
            {
                key: 'apps.project',
                path: '',
                title: 'Doctor Dashboard',
                translateKey: 'nav.appsProject.project',
                icon: 'project',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [DOCTOR],
                subMenu: [
                    {
                        key: 'appsProject.dashboard',
                        path: `${APP_PREFIX_PATH}/project/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsProject.dashboard',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [DOCTOR],
                        subMenu: [],
                    },
                    // {
                    //     key: 'appsProject.projectList',
                    //     path: `${APP_PREFIX_PATH}/project/project-list`,
                    //     title: 'Project List',
                    //     translateKey: 'nav.appsProject.projectList',
                    //     icon: '',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [DOCTOR],
                    //     subMenu: [],
                    // },
                    // {
                    //     key: 'appsProject.scrumBoard',
                    //     path: `${APP_PREFIX_PATH}/project/scrum-board`,
                    //     title: 'Scrum Board',
                    //     translateKey: 'nav.appsProject.scrumBoard',
                    //     icon: '',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [DOCTOR],
                    //     subMenu: [],
                    // },
                    {
                        key: 'appsProject.issue',
                        path: `${APP_PREFIX_PATH}/project/issue`,
                        title: 'Issue',
                        translateKey: 'nav.appsProject.issue',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [DOCTOR],
                        subMenu: [],
                    },
                ],
            },

            {
                key: 'apps.sales',
                path: '',
                title: 'Sales',
                translateKey: 'nav.appsSales.sales',
                icon: 'sales',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [BUSINESS],
                subMenu: [
                    {
                        key: 'appsSales.dashboard',
                        path: `${APP_PREFIX_PATH}/sales/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsSales.dashboard',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [BUSINESS],
                        subMenu: [],
                    },
                    {
                        key: 'appsSales.productList',
                        path: `${APP_PREFIX_PATH}/sales/product-list`,
                        title: 'Product List',
                        translateKey: 'nav.appsSales.productList',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [BUSINESS],
                        subMenu: [],
                    },
                    {
                        key: 'appsSales.productEdit',
                        path: `${APP_PREFIX_PATH}/sales/product-edit/12`,
                        title: 'Product Edit',
                        translateKey: 'nav.appsSales.productEdit',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [BUSINESS],
                        subMenu: [],
                    },
                    // {
                    //     key: 'appsSales.productNew',
                    //     path: `${APP_PREFIX_PATH}/sales/product-new`,
                    //     title: 'New Product',
                    //     translateKey: 'nav.appsSales.productNew',
                    //     icon: '',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [BUSINESS],
                    //     subMenu: [],
                    // },
                    // {
                    //     key: 'appsSales.orderList',
                    //     path: `${APP_PREFIX_PATH}/sales/order-list`,
                    //     title: 'Order List',
                    //     translateKey: 'nav.appsSales.orderList',
                    //     icon: '',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [BUSINESS],
                    //     subMenu: [],
                    // },
                    // {
                    //     key: 'appsSales.orderDetails',
                    //     path: `${APP_PREFIX_PATH}/sales/order-details/95954`,
                    //     title: 'Order Details',
                    //     translateKey: 'nav.appsSales.orderDetails',
                    //     icon: '',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [BUSINESS],
                    //     subMenu: [],
                    // },
                ],
            },

            {
                key: 'apps.account',
                path: '',
                title: 'Account',
                translateKey: 'nav.appsAccount.account',
                icon: 'account',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [DOCTOR, BUSINESS],
                subMenu: [
                    {
                        key: 'appsAccount.settings',
                        path: `${APP_PREFIX_PATH}/account/settings/profile`,
                        title: 'Settings',
                        translateKey: 'nav.appsAccount.settings',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [DOCTOR, BUSINESS],
                        subMenu: [],
                    },
                    // {
                    //     key: 'appsAccount.invoice',
                    //     path: `${APP_PREFIX_PATH}/account/invoice/36223`,
                    //     title: 'Invoice',
                    //     translateKey: 'nav.appsAccount.invoice',
                    //     icon: '',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [DOCTOR, BUSINESS],
                    //     subMenu: [],
                    // },
                    // {
                    //     key: 'appsAccount.activityLog',
                    //     path: `${APP_PREFIX_PATH}/account/activity-log`,
                    //     title: 'Activity Log',
                    //     translateKey: 'nav.appsAccount.activityLog',
                    //     icon: '',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [DOCTOR, BUSINESS],
                    //     subMenu: [],
                    // },
                    {
                        key: 'appsAccount.kycForm',
                        path: `${APP_PREFIX_PATH}/account/kyc-form`,
                        title: 'KYC Form',
                        translateKey: 'nav.appsAccount.kycForm',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [DOCTOR, BUSINESS],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export const getAppsNavigationConfig = (pathname: string): NavigationTree[] => {
    const configCopy = structuredClone(baseConfig)

    const appsSection = configCopy.find(section => section.key === 'apps')

    if (appsSection) {
        appsSection.subMenu = appsSection.subMenu.filter(item => {
            if (pathname.includes('/project') && item.key === 'apps.sales') {
                return false // Hide Sales when in /project path
            }
            if (pathname.includes('/sales') && item.key === 'apps.project') {
                return false // Hide Doctor Dashboard when in /sales path
            }
            return true
        })
    }

    return configCopy
}

// export const getAppsNavigationConfig = (pathname: string): NavigationTree[] => {
//     const configCopy = structuredClone(baseConfig)

//     let signedUpAs = null
//     try {
//         const userData = JSON.parse(localStorage.getItem('userdetails') || '{}')
//         signedUpAs = userData?.signedUpAs?.toLowerCase()
//     } catch (error) {
//         console.error('Invalid userdetails format in localStorage')
//     }

//     const appsSection = configCopy.find(section => section.key === 'apps')

//     if (appsSection) {
//         appsSection.subMenu = appsSection.subMenu.filter(item => {
//             if (pathname.includes('/project') && item.key === 'apps.sales') {
//                 return false
//             }
//             if (pathname.includes('/sales') && item.key === 'apps.project') {
//                 return false
//             }

//             // Filter KYC Form inside the account submenu based on signedUpAs
//             if (item.key === 'apps.account') {
//                 item.subMenu = item.subMenu.filter(subItem => {
//                     // Hide KYC Form if signedUpAs is 'business'
//                     if (subItem.key === 'appsAccount.kycForm') {
//                         return signedUpAs !== 'business'
//                     }
//                     return true
//                 })
//             }

//             return true
//         })
//     }

//     return configCopy
// }


// Optional default export for fallback cases
export default getAppsNavigationConfig(window.location.pathname)