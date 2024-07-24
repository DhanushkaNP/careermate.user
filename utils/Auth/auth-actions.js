"use client";
// auth-actions.js
import { useDispatch } from "react-redux";
import {
  logIn,
  logOut,
  setAvatarUrl,
  setLoading,
} from "@/app/redux/features/auth-slice";

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

export const useSetLoading = () => {
  const dispatch = useDispatch();
  return (loading) => dispatch(setLoading({ loading }));
};

export const useSetAvatarUrl = () => {
  const dispatch = useDispatch();
  return (avatarUrl) => dispatch(setAvatarUrl({ avatarUrl }));
};
