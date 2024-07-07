import { workPlaceTypes } from "@/shared/workPlaceTypes";
import processText from "@/utils/richTextParser";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PostStats from "./PostStats";
import PostStatus from "./PostStatus";

const InternshipDetailPostSummary = ({
  id,
  companylogo,
  companyName,
  location,
  type,
  title,
  description,
  isApproved,
  postUrl,
  numberOfApplicants = 0,
  numberOfJobs = 1,
}) => {
  const router = useRouter();
  const [postStatusColor, setPostStatusColor] = useState("blue");
  const [postStatusName, setPostStatusName] = useState("Waiting");

  useEffect(() => {
    if (isApproved == undefined) return;
    switch (isApproved) {
      case false:
        setPostStatusName("Waiting");
        setPostStatusColor("blue");
        break;
      case true:
        setPostStatusName("Approved");
        setPostStatusColor("green");
        break;
    }
  }, [isApproved]);

  return (
    <div
      className="mt-2 hover:bg-default-background hover:cursor-pointer"
      onClick={() => router.push(`${postUrl}${id}`)}
    >
      <div className=" w-full bg-white hover:bg-default-background shadow-sm border rounded-xl p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              size={56}
              icon={!companylogo && <UserOutlined />}
              src={companylogo}
              className="!border-2"
            />
            <h5 className=" font-semibold text-lg">{companyName}</h5>
          </div>

          <div className=" text-sm">
            <div className="flex gap-2 text-xs">
              {isApproved != null && (
                <div className="text-base flex gap-2 mb-1">
                  <span>Status: </span>
                  <PostStatus name={postStatusName} color={postStatusColor} />
                </div>
              )}

              <PostStats stat={numberOfApplicants} name={"Applicants"} />

              {numberOfJobs && <PostStats stat={numberOfJobs} name={"Jobs"} />}
            </div>

            <p>Location: {location}</p>
            <p>Type: {workPlaceTypes[type]}</p>
          </div>
        </div>

        <div>
          <h5>{title}</h5>
          <p className=" text-xs mt-2">{processText(description)}</p>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPostSummary;
