import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    universityId: null,
    facultyId: null,
    name: null,
  },
};

export const auth = createSlice({
  name: "company",
  initialState,
  reducers: {
    removeCompanyData: () => {
      localStorage.removeItem("studentData");
      localStorage.removeItem("companyData");
      return initialState;
    },

    setCompanyData: (state, action) => {
      const { universityId, facultyId, name } = action.payload;
      localStorage.removeItem("studentData");
      localStorage.removeItem("companyData");
      localStorage.setItem(
        "companyData",
        JSON.stringify({
          universityId,
          facultyId,
          name,
        })
      );
      return {
        values: {
          universityId,
          facultyId,
          name,
        },
      };
    },
  },
});

export const { removeCompanyData, setCompanyData } = auth.actions;
export default auth.reducer;
