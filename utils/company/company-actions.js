"use client";

import {
  setCompanyData,
  removeCompanyData,
} from "@/app/redux/features/company-slice";
import { useDispatch } from "react-redux";

export const useSetCompanyData = () => {
  const dispatch = useDispatch();
  return (universityId, facultyId, name) => {
    dispatch(setCompanyData({ universityId, facultyId, name }));
  };
};

export const useRemoveCompanyData = () => {
  const dispatch = useDispatch();
  return () => dispatch(removeCompanyData());
};
