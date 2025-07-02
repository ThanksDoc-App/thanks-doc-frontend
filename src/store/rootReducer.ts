import { combineReducers, Action, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'
import categoryReducer from '../views/crm/Category/store/categorySlice'
import servicesReducer from '../views/crm/Services/store/servicesSlice'
import doctorReducer from '../views/crm/Doctor/store/doctorSlice'  // ✅ Import your doctorReducer
import businessReducer from '../views/crm/Business/store/businessSlice'  // ✅ Import your businessReducer
import RtkQueryService from '@/services/RtkQueryService'
import adminDashboardReducer, { AdminDashboardState } from '@/views/crm/CrmDashboard/store'

interface Category {
  _id: string
  name: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

interface CategoryState {
  data: Category[]
  loading: boolean
  error: string | null
  deleteLoading: boolean
  deleteError: any
}

// ✅ Doctor state interface
interface DoctorState {
  data: Array<{
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    specialization?: string;
    experience?: number;
    status?: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    gmcNumber?: string;
    rating?: number;
    profileImage?: string | null;
    location?: string | null;
    role?: string;
    isEmailVerified?: boolean;
    isIdentityVerified?: boolean;
    signedUpAs?: string;
  }>;
  loading: boolean;
  error: string | null;
}

// ✅ Business state interface
interface BusinessState {
  data: Array<{
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    businessType?: string;
    registrationNumber?: string;
    status?: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    profileImage?: string | null;
    location?: string | null;
    role?: string;
    isEmailVerified?: boolean;
    isIdentityVerified?: boolean;
    signedUpAs?: string;
    jobsPosted?: number;
  }>;
  loading: boolean;
  error: string | null;
}

interface ServicesState {
  services: Array<{
    _id: string;
    name: string;
    category: string;
    price: string;
  }>;
  loading: boolean;
  error: string | null;
  totalServices: number;
  totalPages: number;
  currentPage: number;
  deleteLoading: boolean;
  deleteError: string | null;
}

export type RootState = {
    auth: AuthState
    base: BaseState
    locale: LocaleState
    theme: ThemeState
    category: CategoryState
    services: ServicesState
    adminDashboard: AdminDashboardState
    doctor: DoctorState  // ✅ Doctor state
    business: BusinessState  // ✅ Business state
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
    doctor: doctorReducer,  // ✅ Add the doctorReducer
    business: businessReducer,  // ✅ Add the businessReducer
    adminDashboard: adminDashboardReducer,
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