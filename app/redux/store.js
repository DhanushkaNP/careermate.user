import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import studentReducer from "./features/student-slice";
import { useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    authReducer,
    studentReducer,
  },
});

export const useAppSelector = useSelector;
