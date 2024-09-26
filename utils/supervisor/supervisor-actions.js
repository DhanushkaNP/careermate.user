"use client";

import {
  removeSupervisorData,
  setSupervisorData,
} from "@/app/redux/features/supervisor-slice";
import { useDispatch } from "react-redux";

export const useSetSupervisorData = () => {
  const dispatch = useDispatch();
  return (id, companyId, fullName) => {
    dispatch(
      setSupervisorData({
        id,
        companyId,
        fullName,
      })
    );
  };
};

export const useRemoveSupervisorData = () => {
  const dispatch = useDispatch();
  return () => dispatch(removeSupervisorData());
};
