"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Col, Row } from "antd";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";

const ApplicantOverview = ({
  name,
  degree,
  pathway,
  gpa,
  internship,
  id,
  proPicUrl,
  internshipPostId,
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
            {" "}
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
        <Col span={2} className="font-default flex items-center">
          {gpa}
        </Col>
        <Col span={5} className="font-default flex items-center">
          <Link
            href={`/companies/internships/our-posts/${internshipPostId}`}
            className=" text-light-blue hover:text-light-blue-700 underline hover:underline"
          >
            {internship}
          </Link>
        </Col>
        <Col span={3} className="font-default flex items-center">
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

export default ApplicantOverview;
