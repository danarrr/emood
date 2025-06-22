import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { moodSlice } from "./moods";
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";


export function makeStore() {
  return configureStore({
    reducer: {
      mood: moodSlice.reducer
    },
    devTools: false,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAPPStore = useStore<AppState>;

export default makeStore();