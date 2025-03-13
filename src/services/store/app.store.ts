"use client";

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { appApi } from "../api/app.api";
import { entityListReducer } from "../slice/entity-list/entity-list-slice";
import { authReducer } from "../slice/auth/auth-slice";
import { themeReducer } from "../slice/theme-slice/theme-slice";
import { localeReducer } from "../slice/locale/locale-slice";
export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    localeReducer,
    entityListReducer,
    authReducer,
    themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

setupListeners(store.dispatch);
