"use client";

import InternshipDetailPostSummary from "@/Components/Internships/InternshipDetailPostSummary";
import api from "@/utils/api";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/student/student-selectors";
import React, { useEffect, useState } from "react";

const StudentInternshipPosts = () => {
  const token = useUserToken();
  const facultyId = useFacultyId();

  const studentId = useUserId();
  const isLoading = useIsLoading();

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await api.get(
        `Faculties/${facultyId}/InternshipPost/Students/${studentId}/List`,
        null,
        token
      );
      setPosts(response.items);
      console.log(response.items);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    fetchPosts();
  }, [isLoading]);

  return (
    <div>
      <h2 className=" text-4xl font-bold text-dark-blue">
        <span className=" text-light-blue">Your</span> internship Posts
      </h2>

      <div className="mt-6">
        {posts.map((ip) => (
          <InternshipDetailPostSummary
            key={ip.id}
            id={ip.id}
            companyName={ip.companyName}
            companylogo={ip.companyLogoUrl}
            location={ip.location}
            type={ip.type}
            title={ip.title}
            description={ip.description}
            isApproved={ip.isApproved}
            postUrl={"my-posts/"}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentInternshipPosts;
