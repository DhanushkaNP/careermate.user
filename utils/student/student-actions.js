"use client";

import {
  setStudentData,
  removeStudentData,
  setStudentName,
  setIntern,
} from "@/app/redux/features/student-slice";
import { useDispatch } from "react-redux";

export const useSetStudentData = () => {
  const dispatch = useDispatch();
  return (
    universityId,
    facultyId,
    batchId,
    degreeId,
    pathwayId,
    fullName,
    isIntern
  ) => {
    dispatch(
      setStudentData({
        universityId,
        facultyId,
        batchId,
        degreeId,
        pathwayId,
        fullName,
        isIntern,
      })
    );
  };
};

export const useRemoveStudentData = () => {
  const dispatch = useDispatch();
  return () => dispatch(removeStudentData());
};

export const useSetStudentName = () => {
  const dispatch = useDispatch();
  return (fullName) => dispatch(setStudentName({ fullName }));
};

export const useSetIntern = () => {
  const dispatch = useDispatch();
  return (isIntern) => dispatch(setIntern({ isIntern }));
};
