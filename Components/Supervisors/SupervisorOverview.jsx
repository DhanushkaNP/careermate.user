import { Col, Row } from "antd";
import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const SupervisorOverview = ({
  id,
  firstName,
  lastName,
  designation,
  email,
  onDeleteClick,
  onEditClick,
}) => {
  return (
    <div className="bg-white shadow-md w-full h-12 border text-lg">
      <Row gutter={16} className="h-full px-4">
        <Col span={5} className="font-default flex items-center text-base">
          {`${firstName} ${lastName}`}
        </Col>
        <Col span={4} className="font-default flex items-center text-base">
          {designation}
        </Col>
        <Col span={5} className="font-default flex items-center text-base">
          {email}
        </Col>
        <Col span={10} className="font-default flex items-center text-base">
          <div className="flex justify-end w-full gap-5">
            <DeleteOutlined
              className="text-lg hover:cursor-pointer"
              onClick={() => onDeleteClick(id, `${firstName} ${lastName}`)}
            />{" "}
            <EditOutlined
              className="text-lg hover:cursor-pointer"
              onClick={() => {
                onEditClick(id);
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SupervisorOverview;
