import { configureStore } from '@reduxjs/toolkit';
import emailBuilderReducer from '@/features/email-builder/emailBuilderSlice';

export const store = configureStore({
  reducer: {
    emailBuilder: emailBuilderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 