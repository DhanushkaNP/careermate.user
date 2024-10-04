"use client";

import StatusIndicator from "@/Components/StatusIndicator";
import { WeekDays } from "@/shared/WeekDays";
import api from "@/utils/api";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import { getErrorMessage } from "@/utils/error-util";
import { Alert, Button, Col, Divider, Form, Input, message, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DailyDiary = () => {
  const { id } = useParams();
  const studentId = useUserId();
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [form] = Form.useForm();
  const router = useRouter();
  const [error, setError] = useState();

  const [dailyDiary, setDailyDiary] = useState([]);
  const [dailyRecords, setDailyRecords] = useState([]);

  const fetchDailyDiary = async () => {
    await api.get(`DailyDiary/${id}`, null, token).then((response) => {
      setDailyDiary(response.item);
      setDailyRecords(response.item.dailyRecords);
      console.log(response.item);
    });
  };

  const onSave = async (values) => {
    const records = [];
    for (const key in values) {
      if (key !== "trainingLocation" && key !== "summary") {
        records.push({ day: parseInt(key), description: values[key] });
      }
    }

    const data = {
      trainingLocation: values.trainingLocation,
      summary: values.summary,
      records,
    };

    console.log("data", data);

    await api
      .put(`Students/${studentId}/DailyDiary/${id}`, data, token)
      .then(() => {
        message.success("Daily diary saved successfully");
        fetchDailyDiary();
      });
  };

  const requestSupervisorApproval = async () => {
    setError(null);
    try {
      await api
        .put(
          `Students/${studentId}/DailyDiary/${id}/RequestSupervisorApproval`,
          null,
          token
        )
        .then(() => {
          fetchDailyDiary();
        });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log("error", errorMessage);
      setError(errorMessage.message);
      return;
    }
  };

  const requestCoordinatorApproval = async () => {
    setError(null);
    try {
      await api
        .put(
          `Students/${studentId}/DailyDiary/${id}/RequestCoordinatorApproval`,
          null,
          token
        )
        .then(() => {
          fetchDailyDiary();
        });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log("error", errorMessage);
      setError(errorMessage.message);
      return;
    }
  };

  useEffect(() => {
    if (isLoading) return;
    fetchDailyDiary();
  }, [isLoading, studentId, id]);

  useEffect(() => {
    form.resetFields();

    form.setFieldsValue({
      trainingLocation: dailyDiary.trainingLocation,
    });

    form.setFieldsValue({ summary: dailyDiary.summary });

    if (dailyRecords.some((dr) => dr.day === 1)) {
      form.setFieldsValue({
        1: dailyRecords.find((dr) => dr.day === 1).description,
      });
    }

    if (dailyRecords.some((dr) => dr.day === 2)) {
      form.setFieldsValue({
        2: dailyRecords.find((dr) => dr.day === 2).description,
      });
    }

    if (dailyRecords.some((dr) => dr.day === 3)) {
      form.setFieldsValue({
        3: dailyRecords.find((dr) => dr.day === 3).description,
      });
    }

    if (dailyRecords.some((dr) => dr.day === 4)) {
      form.setFieldsValue({
        4: dailyRecords.find((dr) => dr.day === 4).description,
      });
    }

    if (dailyRecords.some((dr) => dr.day === 5)) {
      form.setFieldsValue({
        5: dailyRecords.find((dr) => dr.day === 5).description,
      });
    }
  }, [dailyDiary, dailyRecords]);

  return (
    <>
      {error && (
        <Alert
          type="error"
          message={error}
          closable
          className="mb-4 text-red text-base font-default"
        />
      )}

      <Form form={form} onFinish={onSave}>
        <div className=" w-full bg-white shadow rounded p-4 font-default">
          <Row gutter={56} className="font-default">
            <Col
              span={12}
              className="font-default flex flex-col gap-4 text-base"
            >
              <p className="py-1 px-2 bg-light-blue-background w-fit font-semibold">
                Student Name :{" "}
                <span className="text-light-blue">
                  {dailyDiary.studentName}
                </span>
              </p>
              <p className="py-1 px-2 bg-light-blue-background w-fit font-semibold">
                Company :{" "}
                <span className="text-light-blue">
                  {dailyDiary.companyName}
                </span>
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
                <p className="py-1 px-2 w-40 font-semibold">
                  Training location:
                </p>
                <Form.Item
                  name={"trainingLocation"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your training location!",
                    },
                  ]}
                >
                  <Input className=" w-80" />
                </Form.Item>
              </div>
            </Col>
            <Col
              span={12}
              className="font-default flex flex-col gap-4 text-base"
            >
              <p className="py-1 px-2 bg-light-blue-background w-fit font-semibold">
                Student Number :{" "}
                <span className="text-light-blue">
                  {dailyDiary.studentNumber}
                </span>
              </p>

              <p className="py-1 px-2 font-semibold bg-light-blue-background w-fit">
                Deadline:{" "}
                <span className="text-red">{dailyDiary.deadline}</span>{" "}
              </p>
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
                    <StatusIndicator name={"Approved"} color={"green"} />
                  )}
                  {dailyDiary.coordinatorApprovalStatus == 2 && (
                    <StatusIndicator name={"Rejected"} color={"red"} />
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
              {dailyDiary.supervisorApprovalStatus == 0 &&
                dailyDiary.supervisorApprovalStatus == 0 && (
                  <Button
                    type="primary"
                    className="w-min text-base"
                    onClick={requestSupervisorApproval}
                  >
                    Request supervisor approval
                  </Button>
                )}
              {dailyDiary.coordinatorApprovalStatus == 0 &&
                dailyDiary.supervisorApprovalStatus == 2 && (
                  <Button
                    type="primary"
                    className="w-min text-base"
                    onClick={requestCoordinatorApproval}
                  >
                    Request coordinator approval
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
                  <Form.Item name={dailyRecord.day}>
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </div>
        </div>

        <div className=" w-full bg-white shadow font-default mt-2 p-2 mb-10">
          <h5 className="font-semibold mb-2">Weekly summary</h5>
          <Form.Item name={"summary"}>
            <TextArea rows={8} />
          </Form.Item>
          <div className="flex gap-4">
            <Button type="primary" className="mt-4" htmlType="submit">
              Save all
            </Button>{" "}
            <Button
              className="mt-4"
              onClick={() => router.push("/students/daily-diary")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default DailyDiary;
