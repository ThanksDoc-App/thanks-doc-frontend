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
import settingsReducer from '../views/account/Settings/store/SettingsSlice'
import projectDashboardReducer, { ProjectDashboardState } from '../views/project/ProjectDashboard/store/projectDashboardSlice'
import kycFormReducer, { KycFormState } from '../views/account/KycForm/store/kycFormSlice'
import tempDataReducer from '../views/account/KycForm/store/tempDataSlice' // Added this import
import salesProductListReducer from '../views/sales/ProductList/store/productListSlice'
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

// ✅ Payment History interface
interface PaymentHistory {
  _id: string;
  doctorId?: string;
  businessOwnerId?: string;
  jobId?: string;
  amount: number;
  currency?: string;
  status: string;
  paymentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ User Account interface
interface UserAccount {
  _id: string;
  userId: string;
  accountType?: string;
  accountStatus?: string;
  balance?: number;
  currency?: string;
    accountNumber?: string;
    sortCode?: string;
    accountName?: string;
    bankName?: string;
  paymentMethods?: Array<{
    type: string;
    details: any;
    isDefault: boolean;
  }>;
  transactionHistory?: Array<{
    transactionId: string;
    amount: number;
    type: string;
    status: string;
    date: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ ENHANCED Doctor state interface with payment history and user account functionality
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
  // ✅ Payment history state
  paymentHistory: PaymentHistory[];
  paymentHistoryLoading: boolean;
  paymentHistoryError: string | null;
  // ✅ User account state
  userAccount: UserAccount | null;
  userAccountLoading: boolean;
  userAccountError: string | null;
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

// ✅ ENHANCED Job History state interface with rating functionality
interface JobHistoryState {
  data: Array<{
    _id: string;
    title: string;
    company?: string;
    location?: string;
    description?: string;
    salary?: string;
    type?: string;
    status?: string;
    rating?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    job?: any;
    doctor?: any;
  }>;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  ratingLoading: boolean;
  ratingError: string | null;
}

// ✅ Job state interface
interface Location {
  country: string;
  city: string;
  state: string;
  address1: string;
  address2?: string;
  zipCode: string;
}

interface Job {
  _id: string;
  name: string;
  service: string;
  category: string;
  description: string;
  location: Location;
  amount: number;
  currency: string;
  time: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface JobState {
  data: Job[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  createError: string | null;
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

// ✅ ENHANCED Settings state interface with add account functionality
interface SettingsState {
  updateUserLoading: boolean
  updateUserSuccess: boolean
  updateUserError: string | null
  userData: any
  // Profile image upload states
  profileImageLoading: boolean
  profileImageSuccess: boolean
  profileImageError: string | null
  profileImageData: {
    url: string
    public_id: string
  } | null
  // Get profile states
  getProfileLoading: boolean
  getProfileSuccess: boolean
  getProfileError: string | null
  profileData: any
  // ✅ Add account states
  addAccountLoading: boolean
  addAccountSuccess: boolean
  addAccountError: string | null
  addAccountData: any
}

// ✅ Sales Product List state interface
interface Product {
  id: string
  name: string
  productCode: string
  img: string
  category: string
  price: number
  stock: number
  status: number
}

interface FilterQueries {
  name: string
  category: string[]
  status: number[]
  productStatus: number
}

interface TableQueries {
  total: number
  pageIndex: number
  pageSize: number
  query: string
  sort: {
    order: string
    key: string
  }
}

interface SalesProductListState {
  loading: boolean
  deleteConfirmation: boolean
  selectedProduct: string
  tableData: TableQueries
  filterData: FilterQueries
  productList: Product[]
  updatingStatus: boolean
}

// ✅ Added TempDataState interface
interface TempDataState {
    personalInformation: any | null // Replace 'any' with your PersonalInformation type
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
    settings: SettingsState
    projectDashboard: ProjectDashboardState
    accountDetailForm: KycFormState
    tempData: TempDataState // ✅ Added this line
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
    settings: settingsReducer,
    projectDashboard: projectDashboardReducer,
    accountDetailForm: kycFormReducer,
    tempData: tempDataReducer, // ✅ Added this line
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
