"use client";

import React, { useState } from "react";
import Card from "antd/es/card/Card";
import { Col, Form, Row, Input, Select, Upload, Button, message } from "antd";
import { workPlaceTypes } from "@/shared/workPlaceTypes";
import FlyerUploader from "@/Components/Forms/FlyerUploader";
import RichTextEditor from "@/Components/Forms/RichTextEditor";
import api from "@/utils/api";
import { useUserId, useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/student/student-selectors";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/error-util";

const CreateInternshipPost = () => {
  const router = useRouter();

  const token = useUserToken();
  const facultyId = useFacultyId();
  const userId = useUserId();

  const [companies, setCompanies] = useState([]);
  const [companySearchTerm, setCompanySearchTerm] = useState("");

  const [form] = Form.useForm();
  const [editorValue, setEditorValue] = useState("");

  const [error, setError] = useState(null);

  const handleFlyerUpload = (url) => {
    form.setFieldsValue({ flyer: url });
  };

  const handleCompanySearch = async (value) => {
    setCompanySearchTerm(value);
    if (value) {
      try {
        await api
          .get(
            `Faculties/${facultyId}/Company/Suggestions`,
            {
              search: value,
            },
            token
          )
          .then((response) => {
            console.log(response);
            setCompanies(response.items);
          });
      } catch (error) {
        setCompanies([]);
      }
    } else {
      setCompanies([]);
    }
  };

  const onCreatePost = async (values) => {
    try {
      await api
        .post(
          `Faculties/${facultyId}/InternshipPost`,
          {
            userId,
            title: values.title,
            companyId: values.company,
            type: parseInt(values.type),
            location: values.location,
            flyerUrl: values.flyer,
            numberOfInternships: values["number-of-internships"],
            description: values.description,
          },
          token
        )
        .then(() => {
          message.success("Internship post created!");
          form.resetFields();
          router.push("/students/internships");
        });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage.message);
    }
  };

  return (
    <div className="font-default text-dark-blue">
      <div className="flex justify-center mt-4">
        <Card className="w-7/12 shadow">
          <Form
            form={form}
            layout="vertical"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            onFinish={onCreatePost}
          >
            <h2 className=" font-default text-xl text-center font-bold mb-4">
              Post a internship
            </h2>

            <Row gutter={16}>
              <Col span={12}>
                {" "}
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Job Title
                    </span>
                  }
                  name={"title"}
                  rules={[
                    {
                      required: true,
                      message: "Please input a job title!",
                    },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="Intern - Software engineer"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Company
                    </span>
                  }
                  name={"company"}
                  style={{ marginBottom: "0.9rem" }}
                  rules={[
                    {
                      required: true,
                      message: "Please select a company",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Google"
                    filterOption={false}
                    notFoundContent={null}
                    allowClear
                    onSearch={handleCompanySearch}
                    value={companySearchTerm}
                    size="large"
                    onSelect={(value, option) =>
                      setCompanySearchTerm(option.children.name)
                    }
                    onClear={() => setCompanySearchTerm("")}
                  >
                    {companies.map((c) => (
                      <Select.Option key={c.id}>{c.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Work Place type
                    </span>
                  }
                  name={"type"}
                  style={{ marginBottom: "0.9rem" }}
                  rules={[
                    {
                      required: true,
                      message: "Please select a work place type",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Hybrid"
                    notFoundContent={null}
                    allowClear
                    size="large"
                  >
                    {Object.entries(workPlaceTypes).map(([key, value]) => (
                      <Select.Option key={key} value={key}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Job Location
                    </span>
                  }
                  name={"location"}
                  rules={[
                    {
                      required: true,
                      message: "Please input a job location!",
                    },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="Colombo, Sri Lanka"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Job flyer
                    </span>
                  }
                  name={"flyer"}
                  style={{ marginBottom: "0.9rem" }}
                >
                  <FlyerUploader onFlyerUpload={handleFlyerUpload} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Available opportunities
                    </span>
                  }
                  name={"number-of-internships"}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue w-1/3"
                    placeholder="1"
                    allowClear
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Description
                </span>
              }
              name={"description"}
              className=" h-96"
            >
              <RichTextEditor value={editorValue} onChange={setEditorValue} />
            </Form.Item>
            <div className=" flex justify-center mb-4">
              <Button type="primary" className=" w-60" htmlType="submit">
                Post
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateInternshipPost;
