"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import React from "react";
import AuthInitializer from "@/Components/AuthInitializer";

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
};

export default ReduxProvider;
