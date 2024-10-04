import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    isAuth: false,
    userId: null,
    token: null,
    isStudent: false,
    isCompany: false,
    isSupervisor: false,
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
      localStorage.removeItem("supervisorData");
      return initialState;
    },

    logIn: (state, action) => {
      const {
        token,
        userId,
        expirationTime,
        isStudent,
        isCompany,
        isSupervisor,
        avatarUrl,
      } = action.payload;
      localStorage.removeItem("authData");
      localStorage.setItem(
        "authData",
        JSON.stringify({
          token,
          userId,
          expirationTime,
          isStudent,
          isCompany,
          isSupervisor,
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
          isSupervisor,
          avatarUrl,
          isLoading: false,
        },
      };
    },

    setLoading: (state, action) => {
      state.values.isLoading = action.payload.loading;
    },

    setAvatarUrl: (state, action) => {
      state.values.avatarUrl = action.payload.avatarUrl;
    },
  },
});

export const { logIn, logOut, setLoading, setAvatarUrl } = auth.actions;
export default auth.reducer;
