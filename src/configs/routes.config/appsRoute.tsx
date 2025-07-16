import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'appsProject.dashboard',
        path: `${APP_PREFIX_PATH}/project/dashboard`,
        component: lazy(() => import('@/views/project/ProjectDashboard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsProject.scrumBoard',
        path: `${APP_PREFIX_PATH}/project/scrum-board`,
        component: lazy(() => import('@/views/project/ScrumBoard')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'appsProject.job-details',
        path: `${APP_PREFIX_PATH}/project/job-details/:id`,
        component: lazy(() => import('@/views/project/Issue')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsProject.history',
        path: `${APP_PREFIX_PATH}/project/history`,
        component: lazy(() => import('@/views/project/JobHistory')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.dashboard',
        path: `${APP_PREFIX_PATH}/crm/dashboard`,
        component: lazy(() => import('@/views/crm/CrmDashboard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.business',
        path: `${APP_PREFIX_PATH}/crm/business`,
        component: lazy(
            () => import('@/views/crm/Business/components/Business'),
        ),
        authority: [ADMIN],
    },
    {
        key: 'appsCrm.business.details',
        path: `${APP_PREFIX_PATH}/crm/business/:id`,
        component: lazy(
            () => import('@/views/crm/Business/components/BusinessDetails'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.create-category',
        path: `${APP_PREFIX_PATH}/crm/create-category`,
        component: lazy(
            () =>
                import('@/views/crm/CrmDashboard/components/CrmCreateCategory'),
        ),
        authority: [ADMIN],
    },
    {
        key: 'appsCrm.create-service',
        path: `${APP_PREFIX_PATH}/crm/create-service`,
        component: lazy(
            () =>
                import('@/views/crm/CrmDashboard/components/CrmCreateService'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.customers',
        path: `${APP_PREFIX_PATH}/crm/customers`,
        component: lazy(() => import('@/views/crm/Customers')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Customers',
        },
    },
    {
        key: 'appsCrm.customerDetails',
        path: `${APP_PREFIX_PATH}/crm/customer-details`,
        component: lazy(() => import('@/views/crm/CustomerDetail')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Customer Details',
            headerContainer: true,
        },
    },
    {
        key: 'appsCrm.doctor',
        path: `${APP_PREFIX_PATH}/crm/doctor`,
        component: lazy(() => import('@/views/crm/Doctor/Doctor')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.doctor.details',
        path: `${APP_PREFIX_PATH}/crm/doctor/:id`,
        component: lazy(() => import('@/views/crm/Doctor/DoctorDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.service',
        path: `${APP_PREFIX_PATH}/crm/service`,
        component: lazy(
            () => import('@/views/crm/Services/components/Service'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.category',
        path: `${APP_PREFIX_PATH}/crm/category`,
        component: lazy(() => import('@/views/crm/Category/Category')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.mail',
        path: `${APP_PREFIX_PATH}/crm/mail`,
        component: lazy(() => import('@/views/crm/Mail')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'appsCrm.mail',
        path: `${APP_PREFIX_PATH}/crm/mail/:category`,
        component: lazy(() => import('@/views/crm/Mail')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'appsSales.dashboard',
        path: `${APP_PREFIX_PATH}/sales/dashboard`,
        component: lazy(() => import('@/views/sales/SalesDashboard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsSales.history',
        path: `${APP_PREFIX_PATH}/sales/history`,
        component: lazy(
            () => import('@/views/sales/SalesHistory/SalesHistory'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsSales.productList',
        path: `${APP_PREFIX_PATH}/sales/product-list`,
        component: lazy(() => import('@/views/sales/ProductList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsSales.productEdit',
        path: `${APP_PREFIX_PATH}/sales/product-edit/:productId`,
        component: lazy(() => import('@/views/sales/ProductEdit')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Edit Product',
        },
    },
    {
        key: 'appsSales.productNew',
        path: `${APP_PREFIX_PATH}/sales/product-new`,
        component: lazy(() => import('@/views/sales/ProductNew')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Post a job',
        },
    },
    {
        key: 'appsSales.orderList',
        path: `${APP_PREFIX_PATH}/sales/order-list`,
        component: lazy(() => import('@/views/sales/OrderList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsSales.orderDetails',
        path: `${APP_PREFIX_PATH}/sales/order-details/:orderId`,
        component: lazy(() => import('@/views/sales/OrderDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsknowledgeBase.helpCenter',
        path: `${APP_PREFIX_PATH}/knowledge-base/help-center`,
        component: lazy(() => import('@/views/knowledge-base/HelpCenter')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'appsknowledgeBase.article',
        path: `${APP_PREFIX_PATH}/knowledge-base/article`,
        component: lazy(() => import('@/views/knowledge-base/Article')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsknowledgeBase.manageArticles',
        path: `${APP_PREFIX_PATH}/knowledge-base/manage-articles`,
        component: lazy(() => import('@/views/knowledge-base/ManageArticles')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Manage Articles',
            extraHeader: lazy(
                () =>
                    import(
                        '@/views/knowledge-base/ManageArticles/components/PanelHeader'
                    ),
            ),
            headerContainer: true,
        },
    },
    {
        key: 'appsknowledgeBase.editArticle',
        path: `${APP_PREFIX_PATH}/knowledge-base/edit-article`,
        component: lazy(() => import('@/views/knowledge-base/EditArticle')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.settings',
        path: `${APP_PREFIX_PATH}/account/settings/:tab`,
        component: lazy(() => import('@/views/account/Settings')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Settings',
            headerContainer: true,
        },
    },
    {
        key: 'appsAccount.invoice',
        path: `${APP_PREFIX_PATH}/account/invoice/:id`,
        component: lazy(() => import('@/views/account/Invoice')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.activityLog',
        path: `${APP_PREFIX_PATH}/account/activity-log`,
        component: lazy(() => import('@/views/account/ActivityLog')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.kycForm',
        path: `${APP_PREFIX_PATH}/account/kyc-form`,
        component: lazy(() => import('@/views/account/KycForm')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.accountReview',
        path: `${APP_PREFIX_PATH}/account/account-review`,
        component: lazy(
            () => import('@/views/account/KycForm/components/AccountReview'),
        ),
        authority: [ADMIN, USER],
        meta: {
            header: 'Account Review',
            headerContainer: true,
        },
    },
]

export default appsRoute
