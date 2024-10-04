"use client";

import {
  removeSupervisorData,
  setSupervisorData,
} from "@/app/redux/features/supervisor-slice";
import { useDispatch } from "react-redux";

export const useSetSupervisorData = () => {
  const dispatch = useDispatch();
  return (id, companyId, fullName, facultyId) => {
    dispatch(
      setSupervisorData({
        id,
        companyId,
        fullName,
        facultyId,
      })
    );
  };
};

export const useRemoveSupervisorData = () => {
  const dispatch = useDispatch();
  return () => dispatch(removeSupervisorData());
};
