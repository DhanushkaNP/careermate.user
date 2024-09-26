import { Col, Row } from "antd";
import React from "react";

const DailyDiaryStudentSummaryHeading = () => {
  return (
    <div className="bg-white shadow-md w-full h-8 font-semibold">
      <Row gutter={16} className="h-full">
        <Col span={1} className="font-default flex justify-center"></Col>
        <Col span={3} className="font-default flex items-center">
          Week
        </Col>
        <Col span={5} className="font-default flex items-center">
          Period
        </Col>
        <Col span={5} className="font-default flex items-center">
          Due date
        </Col>
        <Col span={5} className="font-default flex items-center">
          Supervisor review
        </Col>
        <Col span={5} className="font-default flex items-center">
          Coordinator review
        </Col>
      </Row>
    </div>
  );
};

export default DailyDiaryStudentSummaryHeading;
