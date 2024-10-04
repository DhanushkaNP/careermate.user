"use client";

import { useAppSelector } from "@/app/redux/store";

export const useUserId = () =>
  useAppSelector((state) => state.authReducer.values.userId);
export const useUserToken = () =>
  useAppSelector((state) => state.authReducer.values.token);
export const useIsAuth = () =>
  useAppSelector((state) => state.authReducer.values.isAuth);
export const useIsStudent = () =>
  useAppSelector((state) => state.authReducer.values.isStudent);
export const useIsCompany = () =>
  useAppSelector((state) => state.authReducer.values.isCompany);
export const useIsSupervisor = () =>
  useAppSelector((state) => state.authReducer.values.isSupervisor);
export const useAvatarUrl = () =>
  useAppSelector((state) => state.authReducer.values.avatarUrl);
export const useIsLoading = () =>
  useAppSelector((state) => state.authReducer.values.isLoading);
