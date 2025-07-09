import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PersonalInformation } from './kycFormSlice'

interface TempDataState {
    personalInformation: PersonalInformation | null
}

const initialState: TempDataState = {
    personalInformation: null,
}

const tempDataSlice = createSlice({
    name: 'tempData',
    initialState,
    reducers: {
        setTempPersonalInfo: (state, action: PayloadAction<PersonalInformation>) => {
            state.personalInformation = action.payload
        },
        clearTempPersonalInfo: (state) => {
            state.personalInformation = null
        },
        clearAllTempData: (state) => {
            state.personalInformation = null
        },
    },
})

export const { 
    setTempPersonalInfo, 
    clearTempPersonalInfo, 
    clearAllTempData 
} = tempDataSlice.actions

// Selectors
export const selectTempPersonalInfo = (state: { tempData: TempDataState }) => 
    state.tempData?.personalInformation || null

export default tempDataSlice.reducer
