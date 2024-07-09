import { useRouter } from "next/navigation";
import { Avatar, Button, Col, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";

const InternOverview = ({
  proPicUrl,
  name,
  supervisor,
  startDate,
  duration,
  internship,
  id,
  studentId,
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
          {supervisor}
        </Col>
        <Col span={3} className="font-default flex items-center">
          {startDate}
        </Col>
        <Col span={2} className="font-default flex items-center">
          {duration}
        </Col>
        <Col span={5} className="font-default flex items-center">
          <p>{internship}</p>
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

export default InternOverview;
