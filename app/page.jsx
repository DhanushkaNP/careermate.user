"use client";

import { useIsAuth } from "@/utils/Auth/auth-selectors";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const RootPage = () => {
  const isAuthenticated = useIsAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("signIn/student");
      return;
    }
  });

  return <div>Test</div>;
};

export default RootPage;
