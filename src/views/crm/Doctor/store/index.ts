import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import doctorReducer from './doctorSlice';
import documentsReducer from "./documentSlice";

export const store = configureStore({
  reducer: {
    doctor: doctorReducer,
    documents: documentsReducer,
    // other reducers here...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Typed hooks with proper RootState
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
