import { DeleteOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import React from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

const StudentCertificationItem = ({
  id,
  name,
  issueMonth,
  issuingOrganization,
  onDelete,
  editable,
}) => {
  const formattedIssueMonth = formatDate(issueMonth);

  const deleteCertification = async () => {
    await onDelete(id);
  };

  return (
    <div>
      <h6 className="font-medium">{name}</h6>
      <p>{issuingOrganization}</p>
      <div className="flex justify-between">
        <p className="text-light-gray">Issued {formattedIssueMonth}</p>{" "}
        {editable && (
          <DeleteOutlined
            className=" hover:cursor-pointer hover:text-light-blue"
            onClick={deleteCertification}
          />
        )}
      </div>

      <Divider className="mt-2" />
    </div>
  );
};

export default StudentCertificationItem;
