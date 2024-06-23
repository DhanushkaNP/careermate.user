import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    isAuth: false,
    userId: null,
    token: null,
    isStudent: false,
    isCompany: false,
    avatarUrl: null,
  },
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      localStorage.removeItem("authData");
      return initialState;
    },

    logIn: (state, action) => {
      const { token, userId, expirationTime, isStudent, isCompany, avatarUrl } =
        action.payload;
      localStorage.removeItem("authData");
      localStorage.setItem(
        "authData",
        JSON.stringify({
          token,
          userId,
          expirationTime,
          isStudent,
          isCompany,
          avatarUrl,
        })
      );
      return {
        values: {
          isAuth: true,
          userId,
          token,
          isStudent,
          isCompany,
          avatarUrl,
        },
      };
    },
  },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
