import { workPlaceTypes } from "@/shared/workPlaceTypes";
import processText from "@/utils/richTextParser";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const InternshipDetailPostSummary = ({
  id,
  companylogo,
  companyName,
  numberOfApplicants,
  numberOfJobs,
  location,
  type,
  title,
  description,
}) => {
  const router = useRouter();

  return (
    <div
      className="mt-2 hover:bg-default-background hover:cursor-pointer"
      onClick={() => router.push(`internships/${id}`)}
    >
      <div className=" w-full bg-white hover:bg-default-background shadow-sm border rounded-md p-4">
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
              <div className=" text-light-blue bg-opacity-light-blue px-2 py-0.5 rounded-lg font-semibold">
                {numberOfApplicants} Applicants
              </div>
              <div className=" text-light-blue bg-opacity-light-blue px-2 py-0.5 rounded-lg font-semibold">
                {numberOfJobs} Jobs
              </div>
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
