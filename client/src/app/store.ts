import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { UsersSlice } from "./features/UsersSlice";
import { CoursesSlice } from "./features/CoursesSlice";

export const store = configureStore({
  reducer: {
    users: UsersSlice.reducer,
    courses: CoursesSlice.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
