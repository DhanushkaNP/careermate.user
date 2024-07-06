import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    isAuth: false,
    userId: null,
    token: null,
    isStudent: false,
    isCompany: false,
    avatarUrl: null,
    isLoading: true,
  },
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      localStorage.removeItem("authData");
      localStorage.removeItem("studentData");
      localStorage.removeItem("companyData");
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
          isLoading: false,
        },
      };
    },

    setLoading: (state, action) => {
      state.values.isLoading = action.payload.loading;
    },
  },
});

export const { logIn, logOut, setLoading } = auth.actions;
export default auth.reducer;
