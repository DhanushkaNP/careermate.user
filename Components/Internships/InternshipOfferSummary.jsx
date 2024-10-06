"use client";

import { workPlaceTypes } from "@/shared/workPlaceTypes";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { companyLowProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import { useIsIntern } from "@/utils/student/student-selectors";
import { useSetIntern } from "@/utils/student/student-actions";

const InternshipOfferSummary = ({
  id,
  internshipPostId,
  companyLogoFirebaseId,
  companyName,
  location,
  type,
  title,
  onReject,
  onAccept,
}) => {
  const router = useRouter();
  const isIntern = useIsIntern();
  const setIsIntern = useSetIntern();

  const onAcceptOffer = async () => {
    try {
      await onAccept(id).then(() => {
        setIsIntern(true);
      });
    } catch (error) {
      console.error("Failed to accept internship offer:", error);
    }
  };

  return (
    <div className="mt-2 ">
      <div className=" w-full bg-white  shadow-sm border rounded-xl p-4">
        <div className="flex justify-between ">
          <div
            className="flex items-center gap-2 hover:bg-default-background hover:cursor-pointer w-full me-2"
            onClick={() =>
              router.push(`/students/internships/${internshipPostId}`)
            }
          >
            <div className="border rounded-full ">
              <Avatar
                size={64}
                icon={!companyLogoFirebaseId && <UserOutlined />}
                src={
                  companyLogoFirebaseId
                    ? companyLowProfilePicture(companyLogoFirebaseId)
                    : null
                }
                className="!border-2"
              />
            </div>

            <div>
              <h5 className=" font-semibold text-lg">{companyName}</h5>

              <h5>{title}</h5>
            </div>
          </div>

          <div className=" text-sm">
            <div className="flex gap-2 text-xs">
              {!isIntern ? (
                <Button
                  size="small"
                  type="primary"
                  ghost
                  onClick={onAcceptOffer}
                >
                  Approve
                </Button>
              ) : (
                <p className=" text-light-gray italic">Already an intern</p>
              )}
              <Button size="small" danger onClick={() => onReject(id)}>
                Reject
              </Button>
            </div>

            <div className="mt-2">
              <p>Location: {location}</p>
              <p>Type: {workPlaceTypes[type]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipOfferSummary;
