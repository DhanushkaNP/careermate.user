"use client";

import InternshipDetailPostSummary from "@/Components/Internships/InternshipDetailPostSummary";
import api from "@/utils/api";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/company/company-selectors";
import React, { useEffect, useState } from "react";

const CompanyInternshipPosts = () => {
  const token = useUserToken();
  const facultyId = useFacultyId();

  const companyId = useUserId();
  const isLoading = useIsLoading();

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await api.get(
        `Faculties/${facultyId}/InternshipPost/Companies/${companyId}/List`,
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
        <span className=" text-light-blue">Our</span> internship Posts
      </h2>

      <div className="mt-6 mb-20">
        {posts.length === 0 && (
          <p className=" text-light-gray italic">No internship posts</p>
        )}
        {posts.map((ip) => (
          <InternshipDetailPostSummary
            key={ip.id}
            id={ip.id}
            companyName={ip.companyName}
            companyLogoFirebaseId={ip.firebaseLogoId}
            location={ip.location}
            type={ip.type}
            title={ip.title}
            description={ip.description}
            isApproved={ip.isApproved}
            postUrl={"our-posts/"}
            numberOfApplicants={ip.numberOfApplicants}
            numberOfJobs={ip.numberOfJobs}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyInternshipPosts;
