"use client";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row } from "antd";
import React from "react";
import StatusIndicator from "../StatusIndicator";
import { useRouter } from "next/navigation";

const StudentOverview = ({
  proPicUrl,
  name,
  degree,
  pathway,
  studentId,
  isHired,
  id,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-md w-full h-14 border">
      <Row gutter={16} className="h-full">
        <Col
          span={1}
          className="font-default flex justify-center items-center w-full"
        >
          <div className="border rounded-full ms-2">
            <Avatar
              src={proPicUrl && proPicUrl}
              icon={!proPicUrl && <UserOutlined />}
              size={"large"}
            />
          </div>
        </Col>
        <Col span={5} className="font-default flex items-center">
          {name}
        </Col>
        <Col span={3} className="font-default flex items-center">
          {degree}
        </Col>
        <Col span={5} className="font-default flex items-center">
          {pathway}
        </Col>
        <Col span={4} className="font-default flex items-center">
          {studentId}
        </Col>
        <Col span={3} className="font-default flex items-center">
          <StatusIndicator
            name={isHired ? "Hired" : "Seeking"}
            color={isHired ? "blue" : "red"}
          />
        </Col>
        <Col span={3} className="font-default flex items-center ">
          <Button
            type="primary"
            className="!text-xs"
            ghost
            onClick={() => router.push(`students/${id}`)}
          >
            View profile
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default StudentOverview;
