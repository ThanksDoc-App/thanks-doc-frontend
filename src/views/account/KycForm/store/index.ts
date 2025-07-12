import { combineReducers } from '@reduxjs/toolkit'
import kycFormReducer, { SLICE_NAME, KycFormState } from './kycFormSlice'
import tempDataReducer from './tempDataSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: kycFormReducer,
    tempData: tempDataReducer, // Add the temp data reducer here
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: KycFormState
        }
        tempData: ReturnType<typeof tempDataReducer> // Add tempData to the type
    }
> = useSelector

export * from './kycFormSlice'
export * from './tempDataSlice' // Export temp data actions and selectors
export { useAppDispatch } from '@/store'
export default reducer
