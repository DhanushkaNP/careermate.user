import React from "react";
import { Col, Row } from "antd";

const CompanyInternOverviewHeading = () => {
  return (
    <div className="bg-white shadow-md w-full h-8 font-semibold">
      <Row gutter={16} className="h-full">
        <Col span={1} className="font-default flex justify-center"></Col>
        <Col span={5} className="font-default flex items-center">
          Name
        </Col>
        <Col span={4} className="font-default flex items-center">
          Supervisor
        </Col>
        <Col span={3} className="font-default flex items-center">
          Start Date
        </Col>
        <Col span={3} className="font-default flex items-center">
          End Date
        </Col>
        <Col span={5} className="font-default flex items-center">
          Internship
        </Col>
        <Col span={3} className="font-default flex items-center"></Col>
      </Row>
    </div>
  );
};

export default CompanyInternOverviewHeading;
