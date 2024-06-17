"use client";

import React, { useEffect } from "react";
import { getStoredAuthData } from "@/utils/Auth/auth-util";
import { useLogIn, useLogout } from "@/utils/Auth/auth-actions";

const AuthInitializer = ({ children }) => {
  const logIn = useLogIn();
  const logOut = useLogout();

  useEffect(() => {
    const storedAuthData = getStoredAuthData();

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
    }
  });

  return <>{children}</>;
};

export default AuthInitializer;
