import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    id: null,
    companyId: null,
    fullName: null,
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
      const { id, companyId, fullName } = action.payload;
      localStorage.removeItem("supervisorData");
      localStorage.setItem(
        "supervisorData",
        JSON.stringify({
          id,
          companyId,
          fullName,
        })
      );
      return {
        values: {
          id,
          companyId,
          fullName,
        },
      };
    },
  },
});

export const { removeSupervisorData, setSupervisorData } = supervisor.actions;
export default supervisor.reducer;
