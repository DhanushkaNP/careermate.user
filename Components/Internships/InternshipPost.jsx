"use client";

import PostStats from "@/Components/Internships/PostStats";
import { workPlaceTypes } from "@/shared/workPlaceTypes";
import api from "@/utils/api";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import { Alert, Avatar, Button, message } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { companyLowProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import { useIsIntern } from "@/utils/student/student-selectors";
import { getErrorMessage } from "@/utils/error-util";
import { ErrorCodes } from "@/shared/errorCodes";
import { useSetIntern } from "@/utils/student/student-actions";

const InternshipPost = ({ showDelete, showApply, facultyId }) => {
  const router = useRouter();

  const [postDetails, setPostsDetails] = useState(null);
  const [applied, setApplied] = useState(false);
  const [isPostApproved, setIsPostApproved] = useState(false);

  const userId = useUserId();
  const token = useUserToken();
  const isLoading = useIsLoading();
  const isIntern = useIsIntern();
  const { id } = useParams();

  const setIntern = useSetIntern();

  const [error, setError] = useState(null);

  const fetchData = async () => {
    await api
      .get(`Faculties/${facultyId}/InternshipPost/${id}`, null, token)
      .then((response) => {
        setPostsDetails(response.item);
        setIsPostApproved(response.item.isApproved);
        console.log(response.item);
        if (response.item.studentApplicants.includes(userId)) setApplied(true);
      });
  };

  const createApplicant = async () => {
    try {
      await api
        .post(`InternshipPosts/${id}/Applicant`, { studentId: userId }, token)
        .then(() => {
          message.success("Successfully Applied!");
          setApplied(true);
        });
    } catch (error) {
      if (error.response.data.errorCode == ErrorCodes.AlreadyAnIntern) {
        setIntern(true);
      }

      const errorMessage = getErrorMessage(error);
      setError(errorMessage.message);
      return;
    }
  };

  const deletePost = async () => {
    try {
      await api.delete(`Faculties/${facultyId}/InternshipPost/${id}`, token);
      message.success("Post deleted");
      router.back();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    if (!facultyId) return;
    fetchData();
  }, [isLoading, id]);

  return (
    <>
      {error && (
        <Alert
          type="error"
          message={error}
          closable
          className="mb-4 text-red text-base font-default"
        />
      )}

      {postDetails && (
        <div className="mx-64 bg-white pt-12 shadow-sm border mb-24 pb-20 font-default">
          <div className="mx-10 ">
            <div className=" flex justify-between">
              <div className="border rounded-full">
                <Avatar
                  size={80}
                  src={
                    postDetails.firebaseLogoId &&
                    companyLowProfilePicture(postDetails.firebaseLogoId)
                  }
                  icon={!postDetails.firebaseLogoId && <UserOutlined />}
                  className=" z-0"
                />
              </div>
              <div>
                <PostStats name={"Jobs"} stat={4} />
                <PostStats name={"Applicants"} stat={2} className="mt-2" />
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <div>
                <h3 className=" text-3xl font-bold">
                  {postDetails.companyName}
                </h3>
                <h2 className="text-2xl">{postDetails.title}</h2>
              </div>
            </div>

            <div className=" flex justify-between mt-2">
              <h6 className="text-lg">Location: {postDetails.location}</h6>
              <h6 className="text-lg">
                Type: {workPlaceTypes[postDetails.type]}
              </h6>
            </div>

            {postDetails.flyer && (
              <div className="flex justify-center w-full">
                <img className="mt-2" src={postDetails.flyer} />
              </div>
            )}

            <div className=" mb-8">
              <p className="mt-4 text-justify internship-description">
                {parse(postDetails.description)}
              </p>
            </div>

            <div className=" flex justify-end gap-2 mt-8 pt-6">
              {showApply && !isIntern && isPostApproved && !applied && (
                <Button
                  type="primary"
                  className="px-10 font-semibold"
                  onClick={createApplicant}
                >
                  Apply
                </Button>
              )}

              {showApply && !isIntern && isPostApproved && applied && (
                <Button disabled type="primary" className="px-10 font-semibold">
                  Applied
                </Button>
              )}

              {showDelete && (
                <Button
                  danger
                  className="px-10 font-semibold"
                  onClick={deletePost}
                >
                  Delete
                </Button>
              )}

              {isIntern && (
                <Button disabled type="primary" className="px-10 font-semibold">
                  Can&apost apply
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InternshipPost;
