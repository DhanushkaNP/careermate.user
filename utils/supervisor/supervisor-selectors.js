"use client";

const { useAppSelector } = require("@/app/redux/store");

export const useSupervisorId = () =>
  useAppSelector((state) => state.supervisorReducer.values.id);

export const useCompanyId = () =>
  useAppSelector((state) => state.supervisorReducer.values.companyId);

export const useFullName = () =>
  useAppSelector((state) => state.supervisorReducer.values.fullName);
