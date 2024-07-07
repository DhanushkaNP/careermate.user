"use client";

import {
  useIsAuth,
  useIsCompany,
  useIsStudent,
} from "@/utils/Auth/auth-selectors";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const RootPage = () => {
  const isAuthenticated = useIsAuth();
  const router = useRouter();
  const isStudent = useIsStudent();
  const isCompany = useIsCompany();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/students/signup");
      return;
    }

    if (isStudent) router.push("students/internships");
    if (isCompany) router.push("companies/internships");
  });

  return <div>Test</div>;
};

export default RootPage;
