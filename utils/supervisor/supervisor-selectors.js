"use client";

const { useAppSelector } = require("@/app/redux/store");

export const useSupervisorId = () =>
  useAppSelector((state) => state.supervisorReducer.values.id);

export const useCompanyId = () =>
  useAppSelector((state) => state.supervisorReducer.values.companyId);

export const useSupervisorName = () =>
  useAppSelector((state) => state.supervisorReducer.values.fullName);

export const useSupervisorFacultyId = () =>
  useAppSelector((state) => state.supervisorReducer.values.facultyId);
