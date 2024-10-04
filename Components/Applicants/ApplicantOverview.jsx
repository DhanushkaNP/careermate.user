"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  message,
  Row,
  Select,
} from "antd";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import { studentLowProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import api from "@/utils/api";
import { useUserId, useUserToken } from "@/utils/Auth/auth-selectors";
import CreateFormModal from "../Forms/CreateFormModal";

const ApplicantOverview = ({
  id,
  name,
  degree,
  pathway,
  gpa,
  internship,
  internshipPostId,
  studentId,
  profilePicFirebaseId,
  internshipId,
  isAlreadyIntern,
  fetchApplicants,
}) => {
  const token = useUserToken();
  const companyId = useUserId();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [supervisors, setSupervisors] = useState([]);
  const [supervisorSearchTerm, setSupervisorSearchTerm] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  const recruitApplicant = async (values) => {
    const {
      "start-at": startAt,
      "end-at": endAt,
      supervisor: supervsiorId,
    } = values;

    console.log(supervsiorId);

    const formattedStartAt = startAt.format("YYYY-MM-DD");
    const formattedEndAt = endAt.format("YYYY-MM-DD");

    await api
      .post(
        `Internships/${internshipId}/Intern`,
        {
          applicantId: id,
          startAt: formattedStartAt,
          endAt: formattedEndAt,
          supervisorId: supervsiorId,
        },
        token
      )
      .then(() => {
        message.success("Applicant recruited successfully");
        setIsCreateModalVisible(false);
        fetchApplicants();
      });
  };

  const handleSupervisorSearch = async (value) => {
    setSupervisorSearchTerm(value);
    if (value) {
      try {
        const response = await api.get(
          `Companies/${companyId}/Supervisor/Suggestions`,
          {
            search: value,
          },
          token
        );
        setSupervisors(response.items);
      } catch (error) {
        console.error("Failed to fetch supervisors:", error);
        setSupervisors([]);
      }
    } else {
      setSupervisors([]);
    }
  };

  return (
    <>
      <CreateFormModal
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        title={"Recruit Applicant"}
        onCreate={recruitApplicant}
        buttonTitle="Recruit"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  Internship start At
                </span>
              }
              name={"start-at"}
              rules={[
                { required: true, message: "Please input a start date!" },
              ]}
            >
              <DatePicker picker="date" size="large" className="w-full" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  Internship end At
                </span>
              }
              name={"end-at"}
              rules={[{ required: true, message: "Please input a end date!" }]}
            >
              <DatePicker picker="date" size="large" className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  Select supervisor
                </span>
              }
              name={"supervisor"}
              rules={[{ required: true, message: "Select supervisor" }]}
            >
              <Select
                showSearch
                placeholder="Search for a supervisor"
                filterOption={false}
                notFoundContent={null}
                size="large"
                allowClear
                className="w-full"
                onSearch={handleSupervisorSearch}
                value={supervisorSearchTerm}
                onSelect={(value, option) => {
                  setSelectedSupervisor(value),
                    setSupervisorSearchTerm(option.children);
                }}
                onClear={() => {
                  setSupervisors([]);
                  setSelectedSupervisor(null);
                }}
              >
                {supervisors.map((s) => (
                  <Select.Option
                    key={s.id}
                  >{`${s.firstName} ${s.lastName} (${s.email})`}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </CreateFormModal>

      <div className="bg-white shadow-md w-full h-14 border">
        <Row gutter={16} className="h-full">
          <Col
            span={1}
            className="font-default flex justify-center items-center w-full "
          >
            <div className="border rounded-full ms-2">
              {" "}
              <Avatar
                src={
                  profilePicFirebaseId &&
                  studentLowProfilePicture(profilePicFirebaseId)
                }
                icon={!profilePicFirebaseId && <UserOutlined />}
                size={"large"}
              />
            </div>
          </Col>
          <Col span={5} className="font-default flex items-center">
            <Link
              href={`students/${studentId}`}
              className="text-light-blue hover:text-light-blue-700 underline hover:underline"
            >
              {name}
            </Link>
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
            {isAlreadyIntern ? (
              <p className=" text-light-gray italic">Already an intern</p>
            ) : (
              <Button
                type="primary"
                className="!text-xs"
                ghost
                onClick={() => {
                  setIsCreateModalVisible(true);
                }}
              >
                Recruit
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ApplicantOverview;
