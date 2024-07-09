"use client";

import InternshipPost from "@/Components/Internships/InternshipPost";
import { useFacultyId } from "@/utils/company/company-selectors";
import React from "react";

const CompanyInternshipPost = () => {
  const facultyId = useFacultyId();
  return <InternshipPost showDelete={true} facultyId={facultyId} />;
};

export default CompanyInternshipPost;
