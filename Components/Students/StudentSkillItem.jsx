import { DeleteOutlined } from "@ant-design/icons";
import React from "react";

const StudentSkillItem = ({ id, name, onDelete, editable }) => {
  const deleteSkill = async () => {
    await onDelete(id);
  };

  return (
    <div className="flex justify-between">
      <li>{name}</li>
      {editable && (
        <DeleteOutlined
          className=" text-light-gray hover:cursor-pointer hover:text-light-blue"
          onClick={deleteSkill}
        />
      )}
    </div>
  );
};

export default StudentSkillItem;
