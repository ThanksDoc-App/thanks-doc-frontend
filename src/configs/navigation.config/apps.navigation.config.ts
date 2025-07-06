import { APP_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { DOCTOR, BUSINESS, ADMIN, USER } from '@/constants/roles.constant'
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
                    {
                        key: 'appsProject.history',
                        path: `${APP_PREFIX_PATH}/project/history`,
                        title: 'Listing',
                        translateKey: 'nav.appsProject.history',
                        icon: 'project',
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
                        key: 'appsProject.history',
                        path: `${APP_PREFIX_PATH}/sales/history`,
                        title: 'Listing',
                        translateKey: 'nav.appsSales.history',
                        icon: 'sales',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [BUSINESS],
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'apps.crm',
                path: '',
                title: 'CRM',
                translateKey: 'nav.appsCrm.crm',
                icon: 'crm',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN],
                subMenu: [
                    {
                        key: 'appsCrm.dashboard',
                        path: `${APP_PREFIX_PATH}/crm/dashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsCrm.dashboard',
                        icon: 'crm',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN],
                        subMenu: [],
                    },
                    {
                        key: 'appsCrm.business',
                        path: `${APP_PREFIX_PATH}/crm/business`,
                        title: 'Business',
                        translateKey: 'nav.appsCrm.business',
                        icon: 'crm',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN],
                        subMenu: [],
                    },
                    {
                        key: 'appsCrm.doctor',
                        path: `${APP_PREFIX_PATH}/crm/doctor`,
                        title: 'Doctor',
                        translateKey: 'nav.appsCrm.doctor',
                        icon: 'crm',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN],
                        subMenu: [],
                    },
                    {
                        key: 'appsCrm.service',
                        path: `${APP_PREFIX_PATH}/crm/service`,
                        title: 'Services',
                        translateKey: 'nav.appsCrm.service',
                        icon: 'crm',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN],
                        subMenu: [],
                    },
                    {
                        key: 'appsCrm.category',
                        path: `${APP_PREFIX_PATH}/crm/category`,
                        title: 'Category',
                        translateKey: 'nav.appsCrm.category',
                        icon: 'crm',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN],
                        subMenu: [],},
//                    {
                    
//     key: 'appsProject.job-details',
//     path: `${APP_PREFIX_PATH}/project/job-details/:id`, // Changed {id} to :id
//     title: 'Issue',
//     translateKey: 'nav.appsProject.job-details',
//     icon: '',
//     type: NAV_ITEM_TYPE_ITEM,
//     authority: [ADMIN, USER],
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
                authority: [DOCTOR, BUSINESS, ADMIN, USER],
                subMenu: [
                    {
                        key: 'appsAccount.settings',
                        path: `${APP_PREFIX_PATH}/account/settings/profile`,
                        title: 'Settings',
                        translateKey: 'nav.appsAccount.settings',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [DOCTOR, BUSINESS, ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'appsAccount.kycForm',
                        path: `${APP_PREFIX_PATH}/account/kyc-form`,
                        title: 'KYC Form',
                        translateKey: 'nav.appsAccount.kycForm',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [DOCTOR, BUSINESS, ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export const getAppsNavigationConfig = (): NavigationTree[] => {
    const configCopy = structuredClone(baseConfig)

    const userDetailsString = localStorage.getItem('userdetails')
    let signedUpAs: string | null = null

    if (userDetailsString) {
        try {
            const userDetails = JSON.parse(userDetailsString)
            signedUpAs = userDetails.data?.signedUpAs?.toLowerCase() || null
        } catch (error) {
            console.error('Error parsing user details from localStorage:', error)
        }
    }

    const appsSection = configCopy.find(section => section.key === 'apps')

    if (appsSection && Array.isArray(appsSection.subMenu)) {
        let newSubMenu: NavigationTree[] = []

        if (signedUpAs === 'super admin') {
            for (const item of appsSection.subMenu) {
                if (item.key === 'apps.crm') {
                    const children = structuredClone(item.subMenu)
                    if (children.length > 0) {
                        children[0].icon = item.icon
                    }
                    newSubMenu.push(...children)
                } else if (item.key === 'apps.account') {
                    const filteredAccount = structuredClone(item)
                    filteredAccount.subMenu = filteredAccount.subMenu?.filter(subItem => subItem.key !== 'appsAccount.kycForm')
                    newSubMenu.push(filteredAccount)
                }
            }
        } else {
            for (const item of appsSection.subMenu) {
                if ((signedUpAs === 'doctor' && item.key === 'apps.sales') ||
                    (signedUpAs === 'business' && item.key === 'apps.project')) {
                    continue
                }

                if (item.key === 'apps.account') {
                    newSubMenu.push(item)
                } else if (item.key === 'apps.crm') {
                    if (signedUpAs !== 'doctor' && signedUpAs !== 'business') {
                        const children = structuredClone(item.subMenu)
                        if (children.length > 0) {
                            children[0].icon = item.icon
                        }
                        newSubMenu.push(...children)
                    }
                } else if (item.type === NAV_ITEM_TYPE_COLLAPSE && Array.isArray(item.subMenu)) {
                    const children = structuredClone(item.subMenu)
                    if (children.length > 0) {
                        children[0].icon = item.icon
                    }
                    newSubMenu.push(...children)
                } else {
                    newSubMenu.push(item)
                }
            }
        }

        appsSection.subMenu = newSubMenu
    }

    return configCopy
}

export default getAppsNavigationConfig()
