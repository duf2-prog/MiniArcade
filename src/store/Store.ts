import { configureStore, type Middleware } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice";
import gameReducer from "./slices/GameSlice";

const loggingMiddleware: Middleware = (_storeAPI) => (next) => (action: any) => {
    return next(action);
};

export const store = configureStore({
    reducer: {
        games: gameReducer,
        user: userReducer
    },
    middleware: (getDefault) =>
        getDefault().concat(loggingMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
