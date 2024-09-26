import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import studentReducer from "./features/student-slice";
import companyReducer from "./features/company-slice";
import supervisorReducer from "./features/supervisor-slice";
import { useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    authReducer,
    studentReducer,
    companyReducer,
    supervisorReducer,
  },
});

export const useAppSelector = useSelector;
