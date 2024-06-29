import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    universityId: null,
    facultyId: null,
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
      const { universityId, facultyId } = action.payload;
      localStorage.removeItem("studentData");
      localStorage.removeItem("companyData");
      localStorage.setItem(
        "companyData",
        JSON.stringify({
          universityId,
          facultyId,
        })
      );
      return {
        values: {
          universityId,
          facultyId,
        },
      };
    },
  },
});

export const { removeCompanyData, setCompanyData } = auth.actions;
export default auth.reducer;
