import { employmentTypes } from "@/shared/employmentTypes";
import { DeleteOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import React from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const StudentExperienceItem = ({
  id,
  title,
  companyName,
  employmentType,
  from,
  to,
  ondelete,
  editable,
}) => {
  const formattedFrom = formatDate(from);
  const formattedTo = formatDate(to);

  const deleteExperience = async () => {
    await ondelete(id);
  };

  return (
    <div>
      <h6 className="font-medium">{title}</h6>
      <div className="flex justify-between">
        <div className="flex gap-2 text-light-gray">
          <p>{companyName}</p>
          <span className="font-extrabold">&middot;</span>
          <p>{employmentTypes[employmentType]}</p>
          <span className="font-extrabold">&middot;</span>

          {/* Here month should be formatted depending on from and to */}
          <p>
            {formattedFrom} - {formattedTo}
          </p>
        </div>
        {editable && (
          <DeleteOutlined
            onClick={deleteExperience}
            className=" hover:cursor-pointer hover:text-light-blue"
          />
        )}
      </div>

      <Divider className="mt-2" />
    </div>
  );
};

export default StudentExperienceItem;
