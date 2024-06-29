export const getStoredCompanyData = () => {
  const storedCompanyData = localStorage.getItem("companyData");
  return storedCompanyData ? JSON.parse(storedCompanyData) : null;
};
