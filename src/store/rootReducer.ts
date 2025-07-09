import { combineReducers, Action, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'
import categoryReducer from '../views/crm/Category/store/categorySlice'
import servicesReducer from '../views/crm/Services/store/servicesSlice'
import doctorReducer from '../views/crm/Doctor/store/doctorSlice'
import businessReducer from '../views/crm/Business/store/businessSlice'
import jobHistoryReducer from '../views/project/JobHistory/store/jobHistorySlice'
import jobReducer from '../views/sales/ProductForm/store/JobsSlice'
import paymentReducer from '../views/sales/ProductForm/store/paymentSlice' // Add this import
import settingsReducer from '../views/account/Settings/store/SettingsSlice'
import projectDashboardReducer, { ProjectDashboardState } from '../views/project/ProjectDashboard/store/projectDashboardSlice'
import kycFormReducer, { KycFormState } from '../views/account/KycForm/store/kycFormSlice'
import salesProductListReducer from '../views/sales/ProductList/store/productListSlice'
import RtkQueryService from '@/services/RtkQueryService'
import adminDashboardReducer, { AdminDashboardState } from '@/views/crm/CrmDashboard/store'

// ... your existing interfaces ...

// Add Payment State interface
interface PaymentState {
    loading: boolean;
    error: string | null;
    lastPayment: {
        success: boolean;
        message: string;
        transactionId?: string;
        jobId: string;
        amount?: number;
    } | null;
}

export type RootState = {
    auth: AuthState
    base: BaseState
    locale: LocaleState
    theme: ThemeState
    category: CategoryState
    services: ServicesState
    adminDashboard: AdminDashboardState
    doctor: DoctorState
    business: BusinessState
    jobHistory: JobHistoryState
    job: JobState
    payment: PaymentState  // Add this line
    settings: SettingsState
    projectDashboard: ProjectDashboardState
    accountDetailForm: KycFormState
    salesProductList: SalesProductListState
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [RtkQueryService.reducerPath]: any
}

export interface AsyncReducers {
    [key: string]: Reducer<any, Action>
}

const staticReducers = {
    auth,
    base,
    locale,
    theme,
    category: categoryReducer,
    services: servicesReducer,
    doctor: doctorReducer,
    business: businessReducer,
    jobHistory: jobHistoryReducer,
    job: jobReducer,
    payment: paymentReducer,  // Add this line
    settings: settingsReducer,
    projectDashboard: projectDashboardReducer,
    accountDetailForm: kycFormReducer,
    adminDashboard: adminDashboardReducer,
    salesProductList: salesProductListReducer,
    [RtkQueryService.reducerPath]: RtkQueryService.reducer,
}

const rootReducer =
    (asyncReducers?: AsyncReducers) => (state: RootState, action: Action) => {
        const combinedReducer = combineReducers({
            ...staticReducers,
            ...asyncReducers,
        })
        return combinedReducer(state, action)
    }

export default rootReducer
