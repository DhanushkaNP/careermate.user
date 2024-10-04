"use client";

import FormContainer from "@/Components/Forms/FormContainer";
import FormTitle from "@/Components/Forms/FormTitle";
import { useLogIn } from "@/utils/Auth/auth-actions";
import { useIsAuth } from "@/utils/Auth/auth-selectors";
import { decodeToken } from "@/utils/Auth/auth-util";
import api from "@/utils/api";
import { getErrorMessage } from "@/utils/error-util";
import { studentLowProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import { useSetStudentData } from "@/utils/student/student-actions";
import {
  Col,
  Form,
  Input,
  Row,
  Button,
  Divider,
  Select,
  message,
  Tooltip,
  Alert,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoArrowForwardCircle } from "react-icons/io5";

const StudentSignup = () => {
  const [step, setStep] = useState(1);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [formData, setFormData] = useState({});

  const login = useLogIn();
  const setStudentData = useSetStudentData();
  const isAuthenticated = useIsAuth();

  const router = useRouter();

  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [batches, setBatches] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [pathways, setPathways] = useState([]);

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);

  const [universitySearchTerm, setUniversitySearchTerm] = useState("");
  const [facultySearchTerm, setFacultySearchTerm] = useState("");
  const [batchSearchTerm, setBatchSearchTerm] = useState("");
  const [degreeSearchTerm, setDegreeSearchTerm] = useState("");
  const [pathwaySearchTerm, setPathwaySearchTerm] = useState("");

  const [studentCreateError, setStudentCreateError] = useState(null);

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
        const response = await api.get(
          `Universities/${selectedUniversity}/Faculty/Suggestions`,
          {
            search: value,
          }
        );
        setFaculties(response.items);
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
        setFaculties([]);
      }
    } else {
      setFaculties([]);
    }
  };

  const handleBatchSearch = async (value) => {
    setBatchSearchTerm(value);
    if (value) {
      try {
        const response = await api.get(
          `Faculty/${selectedFaculty}/StudentBatches/Suggestions`,
          {
            search: value,
          }
        );
        setBatches(response.items);
      } catch (error) {
        console.error("Failed to fetch student batches:", error);
        setBatches([]);
      }
    } else {
      setBatches([]);
    }
  };

  const handleDegreeSearch = async (value) => {
    setDegreeSearchTerm(value);
    if (value) {
      try {
        const response = await api.get(
          `Faculty/${selectedFaculty}/Degrees/Suggestions`,
          {
            search: value,
          }
        );
        setDegrees(response.items);
      } catch (error) {
        console.error("Failed to fetch degrees:", error);
        setDegrees([]);
      }
    } else {
      setDegrees([]);
    }
  };

  const handlePathwaySearch = async (value) => {
    setPathwaySearchTerm(value);
    if (value) {
      try {
        const response = await api.get(
          `Degree/${selectedDegree}/Pathways/Suggestions`,
          {
            search: value,
          }
        );
        setPathways(response.items);
      } catch (error) {
        console.error("Failed to fetch pathways:", error);
        setPathways([]);
      }
    } else {
      setPathways([]);
    }
  };

  const handleFieldClear = (field) => {
    switch (field) {
      case "university":
        form2.setFieldsValue({
          faculty: null,
          "student-batch": null,
          degree: null,
          pathway: null,
        });
        setFaculties([]);
        setBatches([]);
        setDegrees([]);
        setPathways([]);
        setSelectedUniversity(null);
        setSelectedFaculty(null);
        setSelectedBatch(null);
        setSelectedDegree(null);
        setSelectedPathway(null);
        break;
      case "faculty":
        form2.setFieldsValue({
          "student-batch": null,
          degree: null,
          pathway: null,
        });
        setBatches([]);
        setDegrees([]);
        setPathways([]);
        setSelectedFaculty(null);
        setSelectedBatch(null);
        setSelectedDegree(null);
        setSelectedPathway(null);
        break;
      case "batch":
        form2.setFieldsValue({ pathway: null, degree: null });
        setDegrees([]);
        setPathways([]);
        setSelectedBatch(null);
        setSelectedDegree(null);
        setSelectedPathway(null);
        break;
      case "degree":
        form2.setFieldsValue({ pathway: null });
        setPathways([]);
        setSelectedDegree(null);
        setSelectedPathway(null);
        break;
      case "pathway":
        setSelectedPathway(null);
        setPathways([]);
        break;
      default:
        break;
    }
  };

  const handleSignUp = async () => {
    form2.validateFields().then(async (values) => {
      const completeFormData = { ...formData, ...values };
      try {
        await api
          .post("Students", {
            firstName: completeFormData["first-name"],
            lastName: completeFormData["last-name"],
            studentId: completeFormData["student-id"],
            phoneNumber: completeFormData["phone-number"],
            personalEmail: completeFormData["personal-email"],
            universityEmail: completeFormData["university-email"],
            facultyId: completeFormData.faculty,
            password: completeFormData.password,
            degreeId: completeFormData.degree,
            pathwayId: completeFormData.pathway,
          })
          .then((response) => {
            const decodedToken = decodeToken(response.token);

            setStudentData(
              response.universityId,
              response.facultyId,
              response.batchId,
              response.degreeId,
              response.pathwayId,
              `${response.firstName} ${response.lastName}`,
              response.isIntern
            );

            login(
              response.token,
              response.userId,
              decodedToken.exp,
              true,
              false,
              false,
              null,
              response.profilePicFirebaseId
                ? studentLowProfilePicture(response.profilePicFirebaseId)
                : null
            );
            message.success("Sign up successful!");
            router.push("/students/internships");
          });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setStudentCreateError(errorMessage.message);
        return;
      }
    });
  };

  return (
    <>
      {step === 1 && (
        <FormContainer className={"w-full"}>
          <Form
            form={form1}
            className="bg-white p-4 rounded-md font-default px-6 max-w-md shadow-md min-w-96"
            layout="vertical"
            onFinish={onNext}
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
                      First name
                    </span>
                  }
                  name={"first-name"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="John"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Last name
                    </span>
                  }
                  name={"last-name"}
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="Smith"
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={10}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Student Id
                    </span>
                  }
                  name={"student-id"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your student Id!",
                    },
                  ]}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="CT/2018/051"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  label={
                    <span className="font-default text-dark-dark-blue font-semibold">
                      Phone number
                    </span>
                  }
                  name={"phone-number"}
                >
                  <Input
                    className="font-default font-normal text-dark-dark-blue"
                    placeholder="075-2223333"
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Personal Email
                </span>
              }
              name={"personal-email"}
              rules={[
                { required: true, message: "Please input your E-mail!" },
                { type: "email", message: "The input is not valid E-mail!" },
              ]}
            >
              <Input
                className="font-default font-normal text-dark-dark-blue"
                placeholder="johnsmith@email.com"
                allowClear
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  University Email
                </span>
              }
              name={"university-email"}
              rules={[
                {
                  required: true,
                  message: "Please input your University email!",
                },
                { type: "email", message: "The input is not valid E-mail!" },
              ]}
            >
              <Input
                className="font-default font-normal text-dark-dark-blue"
                placeholder="johnsmith@ekel.kln.ac.lk"
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
                href={"/auth/companies/signup"}
                className="text-center w-full font-semibold text-dark-blue block"
              >
                Sign up as a company
              </Link>
            </div>
          </Form>
        </FormContainer>
      )}

      {step === 2 && (
        <FormContainer className={"w-full"}>
          <Form
            form={form2}
            className="bg-white p-4 rounded-md font-default px-6 shadow-md min-w-96"
            layout="vertical"
            onFinish={handleSignUp}
          >
            <FormTitle
              description={"Enter your information to Sign up!"}
              title={"Sign up"}
              subTitle={"Student"}
            />

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  University
                </span>
              }
              name={"university"}
              rules={[
                {
                  required: true,
                  message: "Please select your University",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Search universities"
                onSearch={handleUniversitySearch}
                value={universitySearchTerm} // Maintain the search term
                filterOption={false}
                notFoundContent={null}
                size="large"
                className="!w-96"
                allowClear
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
                  <Select.Option className="w-72" key={uni.id}>
                    {uni.name}
                  </Select.Option>
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
              rules={[
                {
                  required: true,
                  message: "Please select your faculty",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Search Faculties"
                onSearch={handleFacultySearch}
                filterOption={false}
                notFoundContent={null}
                value={facultySearchTerm}
                size="large"
                allowClear
                className="!w-96"
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
                  <Select.Option key={fac.id}>{fac.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Student Batch
                </span>
              }
              name={"student-batch"}
              rules={[
                {
                  required: true,
                  message: "Please select your student batch",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Search student batch"
                onSearch={handleBatchSearch}
                filterOption={false}
                notFoundContent={null}
                value={batchSearchTerm}
                size="large"
                allowClear
                className="!w-96"
                maxLength={5}
                disabled={!selectedFaculty || !selectedUniversity}
                onSelect={(value, option) => {
                  setSelectedBatch(value);
                  setBatchSearchTerm(option.children);
                }}
                onClear={() => {
                  handleFieldClear("batch");
                  setBatchSearchTerm("");
                }}
              >
                {batches.map((b) => (
                  <Select.Option key={b.id} maxLength={5}>
                    {b.batchCode}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Degree Program
                </span>
              }
              name={"degree"}
              rules={[
                {
                  required: true,
                  message: "Please select your degree program",
                },
              ]}
            >
              <Select
                showSearch
                className="truncate block !w-96"
                placeholder="Search degree"
                onSearch={handleDegreeSearch}
                filterOption={false}
                value={degreeSearchTerm}
                notFoundContent={null}
                size="large"
                allowClear
                disabled={!selectedFaculty || !selectedUniversity}
                onSelect={(value, option) => {
                  setSelectedDegree(value);
                  setDegreeSearchTerm(option.children);
                }}
                onClear={() => {
                  handleFieldClear("degree");
                  setDegreeSearchTerm("");
                }}
              >
                {degrees.map((degree) => (
                  <Select.Option key={degree.id}>
                    <Tooltip title={degree.name}>
                      <span className="truncate block w-full">
                        {degree.name}
                      </span>
                    </Tooltip>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-semibold">
                  Specialized Pathway
                </span>
              }
              name={"pathway"}
              rules={[
                {
                  required: true,
                  message: "Please select your pathway",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select pathway"
                onSearch={handlePathwaySearch}
                filterOption={false}
                notFoundContent={null}
                size="large"
                className="!w-96"
                allowClear
                value={pathwaySearchTerm}
                disabled={
                  !selectedFaculty || !selectedUniversity || !selectedDegree
                }
                onSelect={(value, option) => {
                  setSelectedPathway(value);
                  setPathwaySearchTerm(option.children);
                }}
                onClear={() => {
                  handleFieldClear("pathway");
                  setPathwaySearchTerm("");
                }}
              >
                {pathways.map((b) => (
                  <Select.Option key={b.id}>{b.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            {studentCreateError && (
              <Alert
                type="error"
                closable
                className="mb-4 text-red max-w-96"
                message={studentCreateError}
              />
            )}

            <div className="flex justify-between">
              <Button className="mb-2" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                block
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

export default StudentSignup;
