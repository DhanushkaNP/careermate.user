"use client";

import FormContainer from "@/Components/Forms/FormContainer";
import FormTitle from "@/Components/Forms/FormTitle";
import api from "@/utils/api";
import { useLogIn } from "@/utils/Auth/auth-actions";
import { decodeToken } from "@/utils/Auth/auth-util";
import { useSetCompanyData } from "@/utils/company/student-actions";
import { getErrorMessage } from "@/utils/error-util";
import { Alert, Button, Divider, Form, Input, message, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CompanySignIn = () => {
  const [form] = useForm();
  const [error, SetError] = useState(null);
  const router = useRouter();

  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [universitySearchTerm, setUniversitySearchTerm] = useState("");
  const [facultySearchTerm, setFacultySearchTerm] = useState("");

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const logIn = useLogIn();
  const setCompanyData = useSetCompanyData();

  const handleUniversitySearch = async (value) => {
    setUniversitySearchTerm(value);
    if (value) {
      try {
        const response = await api.get("University/Suggestions", {
          search: value,
        });
        setUniversities(response.items);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
        setUniversities([]);
      }
    } else {
      setUniversities([]);
    }
  };

  const onSelectUniversity = async (value, option) => {
    setSelectedUniversity(value);
    setUniversitySearchTerm(option.children);

    await api
      .get(`Universities/${value}/Faculty/Suggestions`)
      .then((response) => {
        setFaculties(response.items);
      });
  };

  const handleFieldClear = (field) => {
    switch (field) {
      case "university":
        form.setFieldsValue({
          university: null,
          faculty: null,
        });
        setUniversities([]);
        setFaculties([]);
        setSelectedUniversity(null);
        setSelectedFaculty(null);
        break;
      case "faculty":
        form.setFieldsValue({
          faculty: null,
        });
        setFaculties([]);
        setSelectedFaculty(null);
        break;
      default:
        break;
    }
  };

  const signInCompany = async () => {
    form.validateFields().then(async (values) => {
      try {
        await api
          .post(`Faculties/${selectedFaculty}/Company/Login`, {
            email: values.email,
            password: values.password,
            universityId: values.university,
          })
          .then((response) => {
            const decodedToken = decodeToken(response.token);

            setCompanyData(response.universityId, response.facultyId);
            logIn(
              response.token,
              response.userId,
              decodedToken.exp,
              false,
              true,
              response.companyLogoUrl
            );

            message.success("Sign up successful!");
            router.push("/companies/internships");
          });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        SetError(errorMessage.message);
      }
    });
  };

  return (
    <FormContainer className={"w-full"}>
      <Form
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        form={form}
        className="bg-white p-4 rounded-md font-default px-6 max-w-md shadow-md min-w-96"
        layout="vertical"
        onFinish={signInCompany}
      >
        <FormTitle
          description={"Enter your information to Sign in!"}
          title={"Sign In"}
          subTitle={"Company"}
          className="mb-4"
        />
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-semibold">
              University
            </span>
          }
          name={"university"}
          style={{ marginBottom: "0.9rem" }}
          rules={[
            {
              required: true,
              message: "Please select a university",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Find Universities"
            filterOption={false}
            notFoundContent={null}
            size="large"
            allowClear
            className="w-full"
            onSearch={handleUniversitySearch}
            value={universitySearchTerm}
            onSelect={onSelectUniversity}
            onClear={() => {
              handleFieldClear("university");
              setUniversitySearchTerm("");
            }}
          >
            {universities.map((uni) => (
              <Select.Option key={uni.id}>{uni.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-semibold">
              Faculty
            </span>
          }
          name={"faculty"}
          style={{ marginBottom: "0.9rem" }}
          rules={[
            {
              required: true,
              message: "Please select a faculty",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Find the faculty"
            notFoundContent={null}
            size="large"
            optionFilterProp="label"
            allowClear
            className="w-full"
            value={facultySearchTerm}
            disabled={!selectedUniversity}
            onSelect={(value, option) => {
              setSelectedFaculty(value);
              setFacultySearchTerm(option.children);
            }}
            onClear={() => {
              handleFieldClear("faculty");
              setFacultySearchTerm("");
            }}
          >
            {faculties.map((fac) => (
              <Select.Option key={fac.id} label={fac.name}>
                {fac.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-semibold w-96">
              Company Email
            </span>
          }
          name={"email"}
          rules={[
            { required: true, message: "Please input your E-mail!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input
            className="font-default font-normal text-dark-dark-blue w-full"
            placeholder="company@email.com"
            allowClear
            size="large"
          />
        </Form.Item>
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

        {error && (
          <Alert
            type="error"
            closable
            className="mb-4 text-red"
            message={error}
          />
        )}

        <Button
          htmlType="submit"
          type="primary"
          block
          className=" font-semibold tracking-wide"
        >
          Sign In
        </Button>

        <p className=" mt-4">
          Forgot password? <Link href={"/test"}>Click here</Link>
        </p>

        <Divider plain className=" !font-default !my-2">
          or
        </Divider>

        <div className="flex justify-between mt-4">
          <Link
            href={"signup"}
            className="text-left w-full text-dark-blue block"
          >
            Sign Up
          </Link>
          <Link
            href={"/auth/students/signin"}
            className="text-right w-full font-semibold text-dark-blue block"
          >
            Sign in as a student
          </Link>
        </div>
      </Form>
    </FormContainer>
  );
};

export default CompanySignIn;
