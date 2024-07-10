"use client";

import api from "@/utils/api";
import { useUserId, useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/company/company-selectors";
import { getErrorMessage } from "@/utils/error-util";
import { Alert, Button, Col, Form, Input, message, Row } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateSupervisor = () => {
  const router = useRouter();

  const facultyId = useFacultyId();
  const companyId = useUserId();
  const token = useUserToken();

  const [error, setError] = useState(null);

  const [form] = Form.useForm();

  const createSupervisor = async () => {
    form.validateFields().then(async (values) => {
      try {
        await api
          .post(
            `Faculties/${facultyId}/Companies/${companyId}/Supervisor`,
            {
              firstName: values["first-name"],
              lastName: values["last-name"],
              designation: values.designation,
              email: values.email,
              password: values.password,
            },
            token
          )
          .then(() => {
            router.push("/companies/supervisors");
            message.success("Supervisor created successfully!");
          });
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage.message);
      }
    });
  };

  return (
    <div className="mt-20 flex justify-center">
      <div className="border-2 w-3/4 h-fit p-12 bg-white rounded-md shadow">
        <h1 className="text-center text-2xl font-bold text-dark-blue">
          Create a Supervisor
        </h1>

        <div className="mt-4">
          <Form
            form={form}
            layout="vertical"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={createSupervisor}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold text-base">
                      First Name
                    </span>
                  }
                  name="first-name"
                  rules={[
                    { required: true, message: "Please input first name!" },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="John"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold text-base">
                      Last Name
                    </span>
                  }
                  name="last-name"
                  rules={[
                    { required: true, message: "Please input first name!" },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="Smith"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold text-base">
                      Designation
                    </span>
                  }
                  name="designation"
                  rules={[
                    { required: true, message: "Please input designation!" },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="Software Architect"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold text-base">
                      Email
                    </span>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Please input your E-mail!" },
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="johnsmith@email.com"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={10} offset={7}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Password
                    </span>
                  }
                  name={"password"}
                  rules={[
                    { required: true, message: "Please input your Password!" },
                    {
                      validator: (_, value) => {
                        if (value && value.length < 8) {
                          return Promise.reject(
                            "Password must include more than 8 characters!"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input.Password
                    className="font-default font-normal text-dark-dark-blue"
                    autoComplete="password"
                    placeholder={"Password"}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="flex justify-center mt-2">
              {error && (
                <Alert
                  type="error"
                  closable
                  className="mb-4 text-red max-w-96"
                  message={error}
                />
              )}
            </div>

            <div className="flex justify-center mt-4">
              <Button
                type="primary"
                className=" font-semibold w-2/5"
                size="large"
                htmlType="submit"
              >
                Create
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateSupervisor;
