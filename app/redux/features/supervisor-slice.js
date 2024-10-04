import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    id: null,
    companyId: null,
    fullName: null,
    facultyId: null,
  },
};

export const supervisor = createSlice({
  name: "supervisor",
  initialState,
  reducers: {
    removeSupervisorData: () => {
      localStorage.removeItem("supervisorData");
      return initialState;
    },

    setSupervisorData: (state, action) => {
      const { id, companyId, fullName, facultyId } = action.payload;
      localStorage.removeItem("supervisorData");

      localStorage.setItem(
        "supervisorData",
        JSON.stringify({
          id,
          companyId,
          fullName,
          facultyId,
        })
      );
      return {
        values: {
          id,
          companyId,
          fullName,
          facultyId,
        },
      };
    },
  },
});

export const { removeSupervisorData, setSupervisorData } = supervisor.actions;
export default supervisor.reducer;
