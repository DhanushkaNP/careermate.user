"use client";

import React from "react";
import { Button, Col, Row } from "antd";
import { dateLocalizer } from "@/utils/dateTimeLocalizer";
import { useRouter } from "next/navigation";

const SupervisorInternDailyDiarySummary = ({
  id,
  internName,
  week,
  dateSubmitted,
  internshipName,
}) => {
  const router = useRouter();

  return (
    <div className={`bg-white shadow-md w-full h-14 border`}>
      <Row gutter={16} className="h-full">
        <Col span={1} className="font-default flex justify-center"></Col>
        <Col span={5} className="font-default flex items-center">
          {internName}
        </Col>
        <Col span={3} className="font-default flex items-center">
          Week {week}
        </Col>
        <Col span={4} className="font-default flex items-center">
          {dateLocalizer(dateSubmitted)}
        </Col>
        <Col span={7} className="font-default flex items-center">
          {internshipName}
        </Col>
        <Col span={4} className="font-default flex items-center">
          <Button
            type="primary"
            className="!text-xs"
            ghost
            onClick={() => router.push(`/supervisors/daily-diaries/${id}`)}
          >
            View Document
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SupervisorInternDailyDiarySummary;
