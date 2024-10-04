"use client";

import React from "react";
import { Avatar, Button, Col, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SupervisorInternOverview = ({
  id,
  studentId,
  proPicUrl,
  name,
  internFrom,
  internTo,
  internshipName,
  numberOfDocs,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-md w-full h-14 border">
      <Row gutter={16} className="h-full">
        <Col
          span={1}
          className="font-default flex justify-center items-center w-full "
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
        <Col span={5} className="font-default flex items-center">
          {internFrom} / {internTo}
        </Col>
        <Col span={4} className="font-default flex items-center">
          <Link
            className=" text-light-blue underline"
            href={`interns/${studentId}/daily-diary`}
          >
            {numberOfDocs} Docs to review{" "}
          </Link>
        </Col>
        <Col span={5} className="font-default flex items-center">
          {internshipName}
        </Col>
        <Col span={4} className="font-default flex items-center">
          <Button
            type="primary"
            className="!text-xs"
            ghost
            onClick={() => router.push(`interns/${studentId}`)}
          >
            View profile
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SupervisorInternOverview;
