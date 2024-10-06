"use client";

import { DatePicker, Divider, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import CreateFormModal from "../Forms/CreateFormModal";
import { PlusOutlined } from "@ant-design/icons";
import Form from "antd/es/form/Form";
import api from "@/utils/api";
import { useIsLoading, useUserToken } from "@/utils/Auth/auth-selectors";
import StudentCertificationItem from "./StudentCertificationItem";

const StudentCertifications = ({ editable, studentId }) => {
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [certifications, setCertifications] = useState([]);

  const fetchCertifications = async () => {
    await api
      .get(`Students/${studentId}/Certification`, null, token)
      .then((response) => {
        setCertifications(response.items);
        console.log(response.items);
      });
  };

  const onAddCertification = async (values) => {
    const formattedIssuedMonth = values.issuedMonth.format("YYYY-MM-01"); // Set day to 01
    await api
      .post(
        `Students/${studentId}/Certification`,
        {
          name: values.name,
          organization: values.organization,
          issuedMonth: formattedIssuedMonth,
        },
        token
      )
      .then(() => {
        message.success("Certification added successfully");
        // fetchCertifications();
        setIsCreateModalVisible(false);
      });
  };

  const onDeleteCertification = async (id) => {
    await api
      .delete(`Students/${studentId}/Certification/${id}`, token)
      .then(() => {
        message.success("Certification deleted successfully");
        fetchCertifications();
      });
  };

  useEffect(() => {
    if (isLoading) return;
    fetchCertifications();
  }, [isLoading, studentId]);

  return (
    <>
      {editable && isCreateModalVisible && (
        <CreateFormModal
          open={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          title="Add license & certifications"
          onCreate={onAddCertification}
        >
          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Name
              </span>
            }
            name={"name"}
            rules={[{ required: true, message: "Please input a name!" }]}
          >
            <Input className="font-default font-normal text-dark-dark-blue" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Issuing Organization
              </span>
            }
            name={"organization"}
            rules={[
              { required: true, message: "Please input a organization!" },
            ]}
          >
            <Input className="font-default font-normal text-dark-dark-blue" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Issued Month
              </span>
            }
            name={"issuedMonth"}
            rules={[
              { required: true, message: "Please input a issued month!" },
            ]}
          >
            <DatePicker picker="month" size="large" />
          </Form.Item>
        </CreateFormModal>
      )}

      <div className="bg-white shadow rounded-md pt-4 ps-4 pe-4 pb-1 font-default max-w-4xl mt-2">
        <div className="flex justify-between">
          <h5 className="font-bold text-base mb-2">
            Licenses & Certifications{" "}
          </h5>{" "}
          {editable && (
            <PlusOutlined
              onClick={() => setIsCreateModalVisible(true)}
              className=" hover:cursor-pointer hover:text-light-blue"
            />
          )}
        </div>

        <div>
          {certifications.map((certification) => (
            <StudentCertificationItem
              key={certification.id}
              id={certification.id}
              name={certification.name}
              issuingOrganization={certification.organization}
              issueMonth={certification.issuedMonth}
              onDelete={onDeleteCertification}
              editable={editable}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentCertifications;
