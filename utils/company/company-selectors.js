"use client";

const { useAppSelector } = require("@/app/redux/store");

export const useUniversityId = () =>
  useAppSelector((state) => state.companyReducer.values.universityId);

export const useFacultyId = () =>
  useAppSelector((state) => state.companyReducer.values.facultyId);

export const useCompanyName = () =>
  useAppSelector((state) => state.companyReducer.values.name);
