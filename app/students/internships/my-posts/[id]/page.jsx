"use client";

import InternshipPost from "@/Components/Internships/InternshipPost";
import React from "react";
import { useFacultyId } from "@/utils/student/student-selectors";

const StudentInternshipPostView = () => {
  const facultyId = useFacultyId();

  return <InternshipPost showDelete={true} facultyId={facultyId} />;
};

export default StudentInternshipPostView;
