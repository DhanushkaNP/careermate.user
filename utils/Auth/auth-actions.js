"use client";
// auth-actions.js
import { useDispatch } from "react-redux";
import { logIn, logOut } from "@/app/redux/features/auth-slice";

export const useLogIn = () => {
  const dispatch = useDispatch();
  return (token, userId, expirationTime, isCoordinator, isAssitant) => {
    dispatch(
      logIn({ token, userId, expirationTime, isCoordinator, isAssitant })
    );
  };
};

export const useLogout = () => {
  const dispatch = useDispatch();
  return () => dispatch(logOut());
};
