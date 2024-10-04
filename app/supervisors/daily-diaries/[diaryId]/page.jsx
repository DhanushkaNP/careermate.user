"use client";

import StatusIndicator from "@/Components/StatusIndicator";
import { WeekDays } from "@/shared/WeekDays";
import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { dateLocalizer } from "@/utils/dateTimeLocalizer";
import { Button, Col, Divider, Row } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DailyDiary = () => {
  const { diaryId } = useParams();
  const token = useUserToken();
  const router = useRouter();

  const [dailyDiary, setDailyDiary] = useState([]);
  const [dailyRecords, setDailyRecords] = useState([]);

  const fetchDailyDiary = async () => {
    await api.get(`DailyDiary/${diaryId}`, null, token).then((response) => {
      setDailyDiary(response.item);
      console.log(response.item);

      setDailyRecords(response.item.dailyRecords);
    });
  };

  const onCoordinatorApprove = async () => {
    await api
      .put(`DailyDiary/${diaryId}/Supervisor/Approve`, null, token)
      .then(() => {
        setDailyDiary((prev) => ({
          ...prev,
          supervisorApprovalStatus: 2,
        }));
      });
  };

  useEffect(() => {
    fetchDailyDiary();
  }, [diaryId]);

  return (
    <>
      <div className=" w-full bg-white shadow rounded p-4 font-default">
        <Row gutter={56} className="font-default">
          <Col span={12} className="font-default flex flex-col gap-4 text-base">
            <p className="py-1 px-2 bg-light-blue-background w-fit font-semibold">
              Student Name :{" "}
              <span className="text-light-blue">{dailyDiary.studentName}</span>
            </p>
            <p className="py-1 px-2 bg-light-blue-background w-fit font-semibold">
              Company :{" "}
              <span className="text-light-blue">{dailyDiary.companyName}</span>
            </p>
            <p className="py-1 px-2 font-semibold bg-light-blue-background w-fit">
              <span className="font-bold">Week: {dailyDiary.weekNumber}</span>{" "}
            </p>
            <div className="w-fit">
              <p className="py-1 px-2 w-fit font-semibold">Period covered</p>
              <Divider className="my-0" />
              <div className="flex gap-10 mt-2">
                <p className="py-1 px-2 w-fit font-medium">
                  From: {dailyDiary.from}
                </p>
                <p className="py-1 px-2 w-fit font-medium">
                  To: {dailyDiary.to}
                </p>
              </div>
            </div>
            <div className="flex">
              <p className="py-1 px-2 bg-light-blue-background w-fit font-semibold">
                Training Location :{" "}
                <span className="text-light-blue">
                  {dailyDiary.trainingLocation}
                </span>
              </p>
            </div>
          </Col>
          <Col span={12} className="font-default flex flex-col gap-4 text-base">
            <p className="py-1 px-2 bg-light-blue-background w-fit font-semibold">
              Student Number :{" "}
              <span className="text-light-blue">
                {dailyDiary.studentNumber}
              </span>
            </p>
            <div className="flex justify-between">
              <p className="py-1 px-2 font-semibold bg-light-blue-background w-fit">
                Date submitted:{" "}
                <span className="text-light-blue">
                  {dateLocalizer(dailyDiary.dateSubmitted)}
                </span>{" "}
              </p>
            </div>

            <div className="flex gap-20">
              <div className="flex gap-2">
                <p className="py-1 px-2 font-semibold">Supervisor:</p>{" "}
                {dailyDiary.supervisorApprovalStatus == 0 && (
                  <StatusIndicator name={"Waiting"} color={"red"} />
                )}
                {dailyDiary.supervisorApprovalStatus == 1 && (
                  <StatusIndicator name={"Requested"} color={"blue"} />
                )}
                {dailyDiary.supervisorApprovalStatus == 2 && (
                  <StatusIndicator name={"Approved"} color={"green"} />
                )}
              </div>
              <div className="flex gap-2">
                <p className="py-1 px-2 font-semibold">Coordinator:</p>{" "}
                {dailyDiary.coordinatorApprovalStatus == 0 && (
                  <StatusIndicator name={"Waiting"} color={"red"} />
                )}
                {dailyDiary.coordinatorApprovalStatus == 1 && (
                  <StatusIndicator name={"Requested"} color={"green"} />
                )}
                {dailyDiary.coordinatorApprovalStatus == 2 && (
                  <StatusIndicator name={"Approved"} color={"red"} />
                )}
              </div>
            </div>
            <div className="w-fit">
              <p className="py-1 px-2 w-fit font-semibold">
                Period of internship
              </p>
              <Divider className="my-0" />
              <div className="flex gap-10 mt-2">
                <p className="py-1 px-2 w-fit font-medium">
                  From: {dailyDiary.internshipStartAt}
                </p>
                <p className="py-1 px-2 w-fit font-medium">
                  To: {dailyDiary.internshipEndAt}
                </p>
              </div>
            </div>
            {dailyDiary.supervisorApprovalStatus == 1 && (
              <Button
                type="primary"
                className="w-min text-base"
                onClick={onCoordinatorApprove}
              >
                Approve
              </Button>
            )}
            {dailyDiary.supervisorApprovalStatus == 2 && (
              <Button type="primary" className="w-min text-base" disabled>
                Approved
              </Button>
            )}
          </Col>
        </Row>
      </div>
      <div className=" w-full bg-white shadow font-default mt-2">
        <Row className="border-b-2">
          <Col
            span={4}
            className=" text-base font-default font-semibold ps-2 border-x-2 p-2"
          >
            Day
          </Col>
          <Col
            span={4}
            className=" text-base font-default font-semibold ps-2 border-x-2 p-2"
          >
            Date
          </Col>
          <Col
            span={16}
            className=" text-base font-default font-semibold ps-2 border-x-2 p-2"
          >
            BRIEF DESCRIPTION OF THE WORK CARRIED OUT
          </Col>
        </Row>
        <div>
          {dailyRecords.map((dailyRecord) => (
            <Row className="border-b-2 h-fit" key={dailyRecord.id}>
              <Col
                span={4}
                className="flex items-center text-base font-default font-medium ps-2 border-x-2 px-2 py-1"
              >
                {WeekDays[dailyRecord.day]}
              </Col>
              <Col
                span={4}
                className="flex items-center text-base font-default font-medium ps-2 border-x-2 px-2 py-1"
              >
                {dailyRecord.date}
              </Col>
              <Col
                span={16}
                className=" text-base font-default font-medium ps-2 border-x-2 px-2 py-1"
              >
                <p className="w-full min-h-20">{dailyRecord.description}</p>
              </Col>
            </Row>
          ))}
        </div>
      </div>

      <div className=" w-full bg-white shadow font-default mt-2 p-2 mb-10">
        <h5 className="font-semibold mb-2">Weekly summary</h5>
        <p className="py-1 px-2 border border-black min-h-32">
          {dailyDiary.summary}
        </p>
        <div className="flex gap-4">
          <Button className="mt-4" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default DailyDiary;
