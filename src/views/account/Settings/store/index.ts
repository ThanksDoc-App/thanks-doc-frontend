import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './settingsSlice'

export const store = configureStore({
    reducer: {
        settings: settingsReducer,
        // Add other reducers here as needed
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch