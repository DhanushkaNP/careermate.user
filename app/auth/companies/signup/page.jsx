"use client";

import FormContainer from "@/Components/Forms/FormContainer";
import FormTitle from "@/Components/Forms/FormTitle";
import NumericInput from "@/Components/Forms/NumericInput";
import { useLogIn } from "@/utils/Auth/auth-actions";
import { decodeToken } from "@/utils/Auth/auth-util";
import api from "@/utils/api";
import { useSetCompanyData } from "@/utils/company/student-actions";
import { getErrorMessage } from "@/utils/error-util";
import {
  Form,
  Input,
  Select,
  Button,
  Divider,
  Row,
  Col,
  Alert,
  InputNumber,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoArrowForwardCircle } from "react-icons/io5";

const CompanySignUp = () => {
  const [step, setStep] = useState(1);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const [formData, setFormData] = useState();

  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [universitySearchTerm, setUniversitySearchTerm] = useState("");
  const [facultySearchTerm, setFacultySearchTerm] = useState("");
  const [industrySearchTerm, setIndustrySearchTerm] = useState("");

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const [error, setError] = useState(null);
  const router = useRouter();

  const logIn = useLogIn();
  const setCompanyData = useSetCompanyData();

  const onNext = (values) => {
    setFormData({ ...formData, ...values });
    setStep(2);
  };

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

  const handleFacultySearch = async (value) => {
    setFacultySearchTerm(value);
    if (value) {
      try {
        await api
          .get(`Universities/${selectedUniversity}/Faculty/Suggestions`, {
            search: value,
          })
          .then((response) => {
            setFaculties(response.items);
          });
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
        setFaculties([]);
      }
    } else {
      setFaculties([]);
    }
  };

  const onSelectFaculty = async (value, option) => {
    setSelectedFaculty(value);
    setFacultySearchTerm(option.children);

    await api.get(`Faculty/${value}/Industries`).then((response) => {
      setIndustries(response.items);
    });
  };

  const handleFieldClear = (field) => {
    switch (field) {
      case "university":
        form1.setFieldsValue({
          university: null,
          faculty: null,
        });
        form2.setFieldValue({
          industry: null,
        });
        setUniversities([]);
        setFaculties([]);
        setIndustries([]);
        setSelectedUniversity(null);
        setSelectedFaculty(null);
        setSelectedIndustry(null);
        break;
      case "faculty":
        form1.setFieldsValue({
          faculty: null,
        });
        form2.setFieldValue({
          industry: null,
        });
        setFaculties([]);
        setIndustries([]);
        setSelectedFaculty(null);
        setSelectedIndustry(null);
        break;
      case "industry":
        form2.setFieldsValue({ industry: null });
        setIndustries([]);
        setIndustries(null);
        break;
      default:
        break;
    }
  };

  const handleSignUp = () => {
    form2.validateFields().then(async (values) => {
      const completeFormData = { ...formData, ...values };

      try {
        await api
          .post(`Faculties/${selectedFaculty}/Company`, {
            name: completeFormData.name,
            universityId: completeFormData.university,
            email: completeFormData.email,
            password: completeFormData.password,
            phoneNumber: completeFormData.phone,
            location: completeFormData.location,
            address: completeFormData.address,
            industryId: completeFormData.industry,
            bio: completeFormData.bio,
          })
          .then((response) => {
            const decodedToken = decodeToken(response.token);
            logIn(
              response.token,
              response.userId,
              decodedToken.exp,
              false,
              true,
              null,
              response.CompanyLogoUrl
            );

            setCompanyData(response.universityId, response.facultyId);

            message.success("Sign up successful!");
            router.push("/companies/internships");
          });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage.message);
      }
    });
  };

  return (
    <>
      {step === 1 && (
        <FormContainer className={"w-full"}>
          <Form
            form={form1}
            className="bg-white p-4 rounded-md font-default px-6 max-w-md shadow-md min-w-96 form-item-custom"
            layout="vertical"
            onFinish={onNext}
          >
            <FormTitle
              description={"Enter your information to Sign up!"}
              title={"Sign up"}
              subTitle={"Company"}
            />

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold !mb-0">
                  Company name
                </span>
              }
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Please input your company name!",
                },
              ]}
              style={{ marginBottom: "0.9rem" }}
            >
              <Input
                className="font-default font-normal text-dark-dark-blue w-96"
                placeholder="Amazon Inc."
                allowClear
              />
            </Form.Item>

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
                size="middle"
                allowClear
                className="!w-96"
                onSearch={handleUniversitySearch}
                value={universitySearchTerm}
                onSelect={(value, option) => {
                  setSelectedUniversity(value);
                  setUniversitySearchTerm(option.children.name); // Set the selected value's name as the search term
                }}
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
                placeholder="Find faculty"
                filterOption={false}
                notFoundContent={null}
                size="middle"
                allowClear
                className="!w-96"
                onSearch={handleFacultySearch}
                value={facultySearchTerm}
                disabled={!selectedUniversity}
                onSelect={onSelectFaculty}
                onClear={() => {
                  handleFieldClear("faculty");
                  setFacultySearchTerm("");
                }}
              >
                {faculties.map((fac) => (
                  <Select.Option key={fac.id}>{fac.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Email
                </span>
              }
              name={"email"}
              style={{ marginBottom: "0.9rem" }}
              rules={[
                {
                  required: true,
                  message: "Please input your Company email!",
                },
                { type: "email", message: "The input is not valid E-mail!" },
              ]}
            >
              <Input
                className="font-default font-normal text-dark-dark-blue"
                placeholder="tech@amazon.com"
                allowClear
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
                { required: true, message: "Please input valid Password!" },
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
                autoComplete="new-password"
                placeholder={"Password"}
              />
            </Form.Item>

            <div className="flex justify-between">
              <div>
                <Button onClick={() => router.push("signin")}>Sign In</Button>
              </div>

              <Button type="primary" htmlType="submit">
                Next <IoArrowForwardCircle size={20} />
              </Button>
            </div>
            <div>
              <Divider plain className=" !font-default !my-2">
                or
              </Divider>
              <Link
                href={"/auth/students/signup"}
                className="text-center w-full font-semibold text-dark-blue block"
              >
                Sign up as a Student
              </Link>
            </div>
          </Form>
        </FormContainer>
      )}
      {step === 2 && (
        <FormContainer className={"w-full me-4"}>
          <Form
            form={form2}
            className="bg-white p-4 rounded-md font-default px-6 max-w-md shadow-md min-w-96 form-item-custom"
            layout="vertical"
            onFinish={handleSignUp}
          >
            <FormTitle
              description={"Enter your information to Sign up!"}
              title={"Sign up"}
              subTitle={"Student"}
            />
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Phone number
                    </span>
                  }
                  name={"phone"}
                  rules={[
                    {
                      required: true,
                      message: "Please input company phone number!",
                    },
                  ]}
                  style={{ marginBottom: "0.9rem" }}
                >
                  <NumericInput
                    className="!font-default font-normal text-dark-dark-blue w-full"
                    placeholder="011-2228888"
                    maxLength={11}
                    minLength={10}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Location
                    </span>
                  }
                  name={"location"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your location!",
                    },
                  ]}
                  style={{ marginBottom: "0.9rem" }}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="Colombo, Sri Lanka"
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Full Address
                </span>
              }
              name={"address"}
              rules={[
                {
                  required: true,
                  message: "Please input your address!",
                },
              ]}
              style={{ marginBottom: "0.9rem" }}
            >
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Industry
                </span>
              }
              name={"industry"}
              style={{ marginBottom: "0.9rem" }}
              rules={[
                {
                  required: true,
                  message: "Please select a industry",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select the industry"
                notFoundContent={null}
                optionFilterProp="label"
                size="middle"
                allowClear
                value={industrySearchTerm}
                disabled={!selectedFaculty || !selectedUniversity}
                onSelect={(value, option) => {
                  setSelectedIndustry(value);
                  setIndustrySearchTerm(option.children);
                }}
                onClear={() => {
                  handleFieldClear("industry");
                  setIndustrySearchTerm("");
                }}
              >
                {industries.map((i) => (
                  <Select.Option key={i.id} label={i.name}>
                    {i.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Bio
                </span>
              }
              name={"bio"}
              rules={[
                {
                  required: true,
                  message: "Please input your bio!",
                },
              ]}
              style={{ marginBottom: "0.9rem" }}
            >
              <TextArea rows={6} />
            </Form.Item>

            {error && (
              <Alert
                type="error"
                closable
                className="mb-4 text-red"
                message={error}
              />
            )}

            <div className="flex justify-between">
              <Button className="mb-2" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="mb-2 font-semibold"
              >
                Sign Up
              </Button>
            </div>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default CompanySignUp;
