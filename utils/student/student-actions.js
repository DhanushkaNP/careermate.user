"use client";

import {
  setStudentData,
  removeStudentData,
} from "@/app/redux/features/student-slice";
import { useDispatch } from "react-redux";

export const useSetStudentData = () => {
  const dispatch = useDispatch();
  return (universityId, facultyId, batchId, degreeId, pathwayId) => {
    dispatch(
      setStudentData({ universityId, facultyId, batchId, degreeId, pathwayId })
    );
  };
};

export const useRemoveStudentData = () => {
  const dispatch = useDispatch();
  return () => dispatch(removeStudentData());
};
