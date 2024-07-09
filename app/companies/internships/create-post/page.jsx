"use client";

import CreateInternshipPost from "@/Components/Internships/CreateInternshipPost";
import { useUserId } from "@/utils/Auth/auth-selectors";
import {
  useCompanyName,
  useFacultyId,
} from "@/utils/company/company-selectors";
import React from "react";

const CompaniesCreatePost = () => {
  const facultyId = useFacultyId();
  const companyId = useUserId();
  const companyName = useCompanyName();

  return (
    <CreateInternshipPost
      facultyId={facultyId}
      companyId={companyId}
      companyName={companyName}
      onFinishUrl="/companies/internships/our-posts"
    />
  );
};

export default CompaniesCreatePost;
