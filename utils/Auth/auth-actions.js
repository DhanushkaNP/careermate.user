"use client";
// auth-actions.js
import { useDispatch } from "react-redux";
import { logIn, logOut } from "@/app/redux/features/auth-slice";

export const useLogIn = () => {
  const dispatch = useDispatch();
  return (token, userId, expirationTime, isStudent, isCompany, avatarUrl) => {
    dispatch(
      logIn({ token, userId, expirationTime, isStudent, isCompany, avatarUrl })
    );
  };
};

export const useLogout = () => {
  const dispatch = useDispatch();
  return () => dispatch(logOut());
};
