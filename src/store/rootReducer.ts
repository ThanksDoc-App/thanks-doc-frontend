import { combineReducers, Action, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'
import categoryReducer from '../views/crm/Category/store/categorySlice'
import servicesReducer from '../views/crm/Services/store/servicesSlice' // ✅ Add this import
import RtkQueryService from '@/services/RtkQueryService'

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
  deleteLoading?: boolean
  deleteError?: any
}

// ✅ Add ServicesState interface
interface ServicesState {
  services: Array<{
    id: string | number;
    service: string;
    category: string;
    price: string;
  }>;
  loading: boolean;
  error: string | null;
}

export type RootState = {
    auth: AuthState
    base: BaseState
    locale: LocaleState
    theme: ThemeState
    category: CategoryState
    services: ServicesState  // ✅ Add this line
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
    services: servicesReducer,  // ✅ Add this line
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