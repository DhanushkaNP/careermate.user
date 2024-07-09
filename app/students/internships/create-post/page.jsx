"use client";

import React from "react";
import { useFacultyId } from "@/utils/student/student-selectors";
import CreateInternshipPost from "@/Components/Internships/CreateInternshipPost";

const StudentCreatePost = () => {
  const facultyId = useFacultyId();

  return <CreateInternshipPost facultyId={facultyId} />;
};

export default StudentCreatePost;
