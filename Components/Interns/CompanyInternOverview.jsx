"use client";

import React from "react";
import { Col, Row, Button } from "antd";
import { dateLocalizer } from "@/utils/dateTimeLocalizer";
import { UserOutlined } from "@ant-design/icons";
import Avatar from "antd/es/avatar/avatar";
import { useRouter } from "next/navigation";

const CompanyInternOverview = ({
  id,
  internStudentId,
  internName,
  supervisorName,
  internStartAt,
  internEndAt,
  internshipName,
  proPicUrl,
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
          {internName}
        </Col>
        <Col span={4} className="font-default flex items-center">
          {supervisorName}
        </Col>
        <Col span={3} className="font-default flex items-center">
          {dateLocalizer(internStartAt)}
        </Col>
        <Col span={3} className="font-default flex items-center">
          {dateLocalizer(internEndAt)}
        </Col>
        <Col span={5} className="font-default flex items-center">
          <p>{internshipName}</p>
        </Col>
        <Col span={3} className="font-default flex items-center">
          <Button
            type="primary"
            className="!text-xs"
            ghost
            onClick={() =>
              router.push(`/companies/students/${internStudentId}`)
            }
          >
            View profile
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyInternOverview;
