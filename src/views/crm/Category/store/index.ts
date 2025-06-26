import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './categorySlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
