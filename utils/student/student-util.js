export const getStoredStudentData = () => {
  const storedStudentData = localStorage.getItem("studentData");
  return storedStudentData ? JSON.parse(storedStudentData) : null;
};
