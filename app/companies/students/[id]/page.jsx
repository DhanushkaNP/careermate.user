"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";
import { LinkOutlined, UserOutlined } from "@ant-design/icons";
import { SlGraduation } from "react-icons/sl";
import { MdOutlineLocationOn } from "react-icons/md";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import api from "@/utils/api";
import { studentHighProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import StudentCertifications from "@/Components/Students/StudentCertifications";
import StudentExperiences from "@/Components/Students/StudentExperiences";
import { useFacultyId } from "@/utils/company/company-selectors";
import ProfileSkills from "@/Components/Profiles/ProfileSkills";
import ContactsAndSocialMedia from "@/Components/Profiles/ContactsAndSocialMedia";
import CreateFormModal from "@/Components/Forms/CreateFormModal";

const CompanyStudentProfile = () => {
  const router = useRouter();

  const { id } = useParams();
  const facultyId = useFacultyId();
  const token = useUserToken();
  const isLoading = useIsLoading();
  const companyId = useUserId();

  const [student, setStudent] = useState({});
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [supervisors, setSupervisors] = useState([]);
  const [supervisorSearchTerm, setSupervisorSearchTerm] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const fetchStudent = async () => {
    await api
      .get(`Faculties/${facultyId}/Student/${id}`, null, token)
      .then((res) => {
        setStudent(res.item);
        console.log(res.item);
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

  const fetchInternships = async () => {
    try {
      const response = await api.get(
        `Faculties/${facultyId}/Companies/${companyId}/InternshipPosts/Suggestions`,
        null,
        token
      );
      setInternships(response.items);
      console.log("Internships", response.items);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
      setInternships([]);
    }
  };

  const onCreateOffer = async (values) => {
    const {
      "start-at": startAt,
      "end-at": endAt,
      supervisor: supervisorId,
      internship: internshipId,
    } = values;

    const formattedStartAt = startAt.format("YYYY-MM-DD");
    const formattedEndAt = endAt.format("YYYY-MM-DD");

    await api
      .post(
        `/Students/${id}/InternshipOffer`,
        {
          internshipId,
          supervisorId,
          startAt: formattedStartAt,
          endAt: formattedEndAt,
        },
        token
      )
      .then(() => {
        message.success("Offer sent successfully");
        setIsCreateModalVisible(false);
      });
  };

  const downloadCv = async () => {
    router.push(
      `http://localhost:62200/api/Faculties/${facultyId}/Student/${id}/CV`
    );
  };

  useEffect(() => {
    if (isLoading) return;
    fetchInternships();
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    fetchStudent();
  }, [isLoading]);

  return (
    <>
      <CreateFormModal
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        title={"Give a job offer"}
        buttonTitle="Offer"
        onCreate={onCreateOffer}
      >
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

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  Select Internship
                </span>
              }
              name={"internship"}
              rules={[{ required: true, message: "Select Internship" }]}
            >
              <Select
                showSearch
                placeholder="Filter by Internship"
                size="large"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
                onSelect={(value) => setSelectedInternship(value)}
                onClear={() => {
                  setSelectedInternship(null);
                }}
              >
                {internships.map((i) => (
                  <Select.Option key={i.internshipId} label={i.title}>
                    {i.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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
      </CreateFormModal>
      <div>
        {student && (
          <div className="font-default flex flex-col items-center mb-10 pt-16">
            <div className=" max-w-5xl">
              <div className=" w-full bg-white shadow flex p-4 rounded-md gap-5">
                <div className="rounded-full h-fit">
                  <Avatar
                    size={128}
                    src={
                      student.profilePicFirebaseId &&
                      studentHighProfilePicture(student.profilePicFirebaseId)
                    }
                    icon={!student.profilePicFirebaseId && <UserOutlined />}
                  />
                </div>
                <div className=" w-full h-full">
                  <div className="flex justify-between">
                    <h3 className=" text-3xl font-bold ">
                      {student.firstName + " " + student.lastName}
                    </h3>
                  </div>

                  <h5 className=" text-base font-medium mt-1">
                    {student.headline}
                  </h5>
                  <div className="flex mt-2 gap-2 text-sm">
                    <SlGraduation size={16} />
                    <p className="">{student.degreeName}</p>
                    <span className="font-extrabold">&middot;</span>
                    <p>{student.pathwayName}</p>
                  </div>

                  {student.location && (
                    <div className="flex gap-2 mt-2 text-light-gray font-medium text-sm">
                      <MdOutlineLocationOn size={20} />
                      <p>{student.location}</p>
                    </div>
                  )}

                  <div className="mt-2 flex gap-4">
                    {student.isHired === false && (
                      <Button
                        type="primary"
                        className="mt-2"
                        onClick={() => setIsCreateModalVisible(true)}
                      >
                        Give a offer
                      </Button>
                    )}
                    {(student.cvStatus === 1 || student.cvStatus === 2) &&
                      student.isHired == false && (
                        <div className="flex gap-2 text-light-blue items-center text-sm">
                          <LinkOutlined className=" text-dark-gray" />
                          <p
                            href={`http://localhost:62200/api/Faculties/${facultyId}/Student/${id}/CV`}
                            className=" underline hover:cursor-pointer"
                            onClick={downloadCv}
                          >
                            Click to download CV
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <Row gutter={10}>
                  <Col span={14}>
                    {/* About */}
                    {student.about && (
                      <div className="bg-white shadow rounded-md p-4 font-default max-w-4xl">
                        <h5 className="font-bold text-base">About</h5>
                        <p className=" text-justify">{student.about}</p>
                      </div>
                    )}

                    {/* Experience */}
                    <StudentExperiences editable={false} studentId={id} />

                    {/* Certifications */}
                    <StudentCertifications editable={false} studentId={id} />
                  </Col>
                  <Col span={10}>
                    {/* Skills */}
                    <ProfileSkills editable={false} studentId={id} />

                    {/* Contact */}
                    <ContactsAndSocialMedia studentId={id} />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyStudentProfile;
