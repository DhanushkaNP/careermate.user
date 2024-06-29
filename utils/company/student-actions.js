"use client";

import {
  setCompanyData,
  removeCompanyData,
} from "@/app/redux/features/company-slice";
import { useDispatch } from "react-redux";

export const useSetCompanyData = () => {
  const dispatch = useDispatch();
  return (universityId, facultyId) => {
    dispatch(setCompanyData({ universityId, facultyId }));
  };
};

export const useRemoveCompanyData = () => {
  const dispatch = useDispatch();
  return () => dispatch(removeCompanyData());
};
