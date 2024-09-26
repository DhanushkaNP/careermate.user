"use client";

const { useAppSelector } = require("@/app/redux/store");

export const useUniversityId = () =>
  useAppSelector((state) => state.studentReducer.values.universityId);

export const useFacultyId = () =>
  useAppSelector((state) => state.studentReducer.values.facultyId);

export const useBatchId = () =>
  useAppSelector((state) => state.studentReducer.values.batchId);

export const useDegreeId = () =>
  useAppSelector((state) => state.studentReducer.values.degreeId);

export const usePathwayId = () =>
  useAppSelector((state) => state.studentReducer.values.pathwayId);

export const useStudentFullName = () =>
  useAppSelector((state) => state.studentReducer.values.fullName);

export const useIsIntern = () =>
  useAppSelector((state) => state.studentReducer.values.isIntern);
