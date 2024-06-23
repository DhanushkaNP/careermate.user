"use client";

import React, { useEffect } from "react";
import { getStoredAuthData } from "@/utils/Auth/auth-util";
import { useLogIn, useLogout } from "@/utils/Auth/auth-actions";
import { useSetStudentData } from "@/utils/student/student-actions";
import { getStoredStudentData } from "@/utils/student/student-util";

const AuthInitializer = ({ children }) => {
  const logIn = useLogIn();
  const logOut = useLogout();
  const setStudentData = useSetStudentData();

  useEffect(() => {
    const storedAuthData = getStoredAuthData();
    const storedStudentData = getStoredStudentData();

    if (storedAuthData) {
      const { expirationTime, token, userId, isCoordinator, isAssitant } =
        storedAuthData;

      const expirationTimeInString = `${expirationTime}`;

      const formattedExpirationTime = Number(
        expirationTimeInString.replace(/,/g, "")
      );

      if (Date.now() > formattedExpirationTime * 1000) {
        logOut();
      } else {
        logIn(token, userId, expirationTime, isCoordinator, isAssitant);
      }

      if (storedStudentData) {
        const { universityId, facultyId, batchId, degreeId, pathwayId } =
          storedStudentData;
        setStudentData(universityId, facultyId, batchId, degreeId, pathwayId);
      }
    }
  });

  return <>{children}</>;
};

export default AuthInitializer;
