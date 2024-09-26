import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  values: {
    universityId: null,
    facultyId: null,
    batchId: null,
    degreeId: null,
    pathwayId: null,
    fullName: null,
    isIntern: false,
  },
};

export const student = createSlice({
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
        isIntern,
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
          isIntern,
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
          isIntern,
        },
      };
    },

    setStudentName: (state, action) => {
      state.values.fullName = action.payload.fullName;
    },

    setIntern: (state, action) => {
      state.values.isIntern = action.payload.isIntern;
    },
  },
});

export const { removeStudentData, setStudentData, setStudentName, setIntern } =
  student.actions;
export default student.reducer;
