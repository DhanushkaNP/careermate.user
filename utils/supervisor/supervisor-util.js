export const getStoredSupervisorData = () => {
  const storedSupervisorData = localStorage.getItem("supervisorData");
  return storedSupervisorData ? JSON.parse(storedSupervisorData) : null;
};
