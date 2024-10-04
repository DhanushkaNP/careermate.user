"use client";

import React, { useEffect, useState } from "react";
import { getStoredAuthData } from "@/utils/Auth/auth-util";
import { useLogIn, useLogout, useSetLoading } from "@/utils/Auth/auth-actions";
import {
  useRemoveStudentData,
  useSetStudentData,
} from "@/utils/student/student-actions";
import { getStoredStudentData } from "@/utils/student/student-util";
import {
  useRemoveCompanyData,
  useSetCompanyData,
} from "@/utils/company/company-actions";
import { getStoredCompanyData } from "@/utils/company/company-util";
import { Spin } from "antd";
import { getStoredSupervisorData } from "@/utils/supervisor/supervisor-util";
import {
  useRemoveSupervisorData,
  useSetSupervisorData,
} from "@/utils/supervisor/supervisor-actions";

const AuthInitializer = ({ children }) => {
  const setLoading = useSetLoading();
  const logIn = useLogIn();
  const logOut = useLogout();
  const setStudentData = useSetStudentData();
  const setCompanyData = useSetCompanyData();
  const setSupervisorData = useSetSupervisorData();
  const removeCompanyData = useRemoveCompanyData();
  const removeStudentData = useRemoveStudentData();
  const removeSupervisorData = useRemoveSupervisorData();
  const [loadingSpin, setLoadingSpin] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const storedAuthData = getStoredAuthData();
      const storedStudentData = getStoredStudentData();
      const storedCompanyData = getStoredCompanyData();
      const storedSuperVisorData = getStoredSupervisorData();

      if (storedAuthData) {
        const {
          expirationTime,
          token,
          userId,
          isStudent,
          isCompany,
          isSupervisor,
          avatarUrl,
        } = storedAuthData;
        const expirationTimeInString = `${expirationTime}`;
        const formattedExpirationTime = Number(
          expirationTimeInString.replace(/,/g, "")
        );

        if (Date.now() > formattedExpirationTime * 1000) {
          removeCompanyData();
          removeStudentData();
          removeSupervisorData();
          logOut();
        } else {
          logIn(
            token,
            userId,
            expirationTime,
            isStudent,
            isCompany,
            isSupervisor,
            avatarUrl
          );
        }

        if (storedStudentData) {
          const {
            universityId,
            facultyId,
            batchId,
            degreeId,
            pathwayId,
            fullName,
            isIntern,
          } = storedStudentData;
          setStudentData(
            universityId,
            facultyId,
            batchId,
            degreeId,
            pathwayId,
            fullName,
            isIntern
          );
        } else if (storedCompanyData) {
          const { universityId, facultyId, name } = storedCompanyData;
          setCompanyData(universityId, facultyId, name);
        } else if (storedSuperVisorData) {
          const { id, companyId, fullName, facultyId } = storedSuperVisorData;
          setSupervisorData(id, companyId, fullName, facultyId);
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
    removeSupervisorData,
    setStudentData,
    setCompanyData,
    removeSupervisorData,
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
