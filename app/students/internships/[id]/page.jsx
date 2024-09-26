"use client";

import React from "react";
import InternshipPost from "@/Components/Internships/InternshipPost";
import { useFacultyId } from "@/utils/student/student-selectors";

const InternshipPostView = () => {
  const facultyId = useFacultyId();

  return <InternshipPost showApply={true} facultyId={facultyId} />;
};

export default InternshipPostView;
