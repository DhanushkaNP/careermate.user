import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    universityId: null,
    facultyId: null,
    batchId: null,
    degreeId: null,
    pathwayId: null,
    fullName: null,
  },
};

export const auth = createSlice({
  name: "student",
  initialState,
  reducers: {
    removeStudentData: () => {
      localStorage.removeItem("studentData");
      return initialState;
    },

    setStudentData: (state, action) => {
      const {
        universityId,
        facultyId,
        batchId,
        degreeId,
        pathwayId,
        fullName,
      } = action.payload;
      localStorage.removeItem("studentData");
      localStorage.setItem(
        "studentData",
        JSON.stringify({
          universityId,
          facultyId,
          batchId,
          degreeId,
          pathwayId,
          fullName,
        })
      );
      return {
        values: {
          universityId,
          facultyId,
          batchId,
          degreeId,
          pathwayId,
          fullName,
        },
      };
    },
  },
});

export const { removeStudentData, setStudentData } = auth.actions;
export default auth.reducer;
