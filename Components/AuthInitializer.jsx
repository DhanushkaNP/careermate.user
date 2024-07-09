"use client";

import React, { useEffect, useState } from "react";
import { getStoredAuthData } from "@/utils/Auth/auth-util";
import { useLogIn, useLogout, useSetLoading } from "@/utils/Auth/auth-actions";
import { useSetStudentData } from "@/utils/student/student-actions";
import { getStoredStudentData } from "@/utils/student/student-util";
import {
  useRemoveCompanyData,
  useSetCompanyData,
} from "@/utils/company/company-actions";
import { getStoredCompanyData } from "@/utils/company/company-util";
import { Spin } from "antd";

const AuthInitializer = ({ children }) => {
  const setLoading = useSetLoading();
  const logIn = useLogIn();
  const logOut = useLogout();
  const setStudentData = useSetStudentData();
  const setCompanyData = useSetCompanyData();
  const removeCompanyData = useRemoveCompanyData();
  const removeStudentData = useSetStudentData();
  const [loadingSpin, setLoadingSpin] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedAuthData = getStoredAuthData();
      const storedStudentData = getStoredStudentData();
      const storedCompanyData = getStoredCompanyData();

      if (storedAuthData) {
        const {
          expirationTime,
          token,
          userId,
          isStudent,
          isCompany,
          avatarUrl,
        } = storedAuthData;
        const expirationTimeInString = `${expirationTime}`;
        const formattedExpirationTime = Number(
          expirationTimeInString.replace(/,/g, "")
        );

        if (Date.now() > formattedExpirationTime * 1000) {
          removeCompanyData();
          removeStudentData();
          logOut();
        } else {
          logIn(token, userId, expirationTime, isStudent, isCompany, avatarUrl);
        }

        if (storedStudentData) {
          const {
            universityId,
            facultyId,
            batchId,
            degreeId,
            pathwayId,
            fullName,
          } = storedStudentData;
          setStudentData(
            universityId,
            facultyId,
            batchId,
            degreeId,
            pathwayId,
            fullName
          );
        }

        if (storedCompanyData) {
          const { universityId, facultyId, name } = storedCompanyData;
          setCompanyData(universityId, facultyId, name);
        }
      }

      setLoading(false);
      setLoadingSpin(false);
    };

    initializeAuth();
  }, [
    logIn,
    logOut,
    removeCompanyData,
    removeStudentData,
    setStudentData,
    setCompanyData,
    setLoading,
  ]);

  return (
    <>
      {loadingSpin && (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      )}
      {children}
    </>
  );
};

export default AuthInitializer;
