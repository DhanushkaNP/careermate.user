import { Col, Row } from "antd";
import React from "react";
import StatusIndicator from "../StatusIndicator";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const DailyDiaryStudentSummary = ({
  id,
  weekNumber,
  from,
  to,
  dueDate,
  coordinatorApprovalStatus,
  supervisorApprovalStatus,
  isLocked,
}) => {
  const router = useRouter();

  const formattedFromDate = new dayjs(from).format("YYYY/MM/DD");
  const formattedToDate = new dayjs(to).format("YYYY/MM/DD");
  const formattedDueDate = new dayjs(dueDate).format("YYYY/MM/DD");

  return (
    <div
      className={`bg-white shadow-md w-full h-14 border ${
        isLocked
          ? "!bg-zinc-100 hover:cursor-not-allowed"
          : "hover:cursor-pointer hover:bg-default-background"
      }`}
      onClick={() => {
        if (isLocked) return;
        router.push(`daily-diary/${id}`);
      }}
    >
      <Row gutter={16} className="h-full">
        <Col span={1} className="font-default flex justify-center"></Col>
        <Col span={3} className="font-default flex items-center">
          Week {weekNumber}
        </Col>
        <Col span={5} className="font-default flex items-center">
          {formattedFromDate}
          <span className=" font-semibold px-1 ">⎯</span>
          {formattedToDate}
        </Col>
        <Col span={5} className="font-default flex items-center">
          {formattedDueDate}
        </Col>
        <Col span={5} className="font-default flex items-center">
          {supervisorApprovalStatus == 0 && (
            <StatusIndicator name={"Waiting"} color={"red"} />
          )}

          {supervisorApprovalStatus == 1 && (
            <StatusIndicator name={"Requested"} color={"blue"} />
          )}

          {supervisorApprovalStatus == 2 && (
            <StatusIndicator name={"Approved"} color={"green"} />
          )}
        </Col>
        <Col span={5} className="font-default flex items-center">
          {coordinatorApprovalStatus ? (
            <StatusIndicator name={"Approved"} color={"green"} />
          ) : (
            <StatusIndicator name={"Waiting"} color={"red"} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DailyDiaryStudentSummary;
