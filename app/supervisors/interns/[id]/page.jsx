"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, Col, Form, Input, Row } from "antd";
import { LinkOutlined, UserOutlined } from "@ant-design/icons";
import { SlGraduation } from "react-icons/sl";
import { MdOutlineLocationOn } from "react-icons/md";
import { useIsLoading, useUserToken } from "@/utils/Auth/auth-selectors";
import api from "@/utils/api";
import { studentHighProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import StudentCertifications from "@/Components/Students/StudentCertifications";
import StudentExperiences from "@/Components/Students/StudentExperiences";
import ProfileSkills from "@/Components/Profiles/ProfileSkills";
import ContactsAndSocialMedia from "@/Components/Profiles/ContactsAndSocialMedia";
import { useSupervisorFacultyId } from "@/utils/supervisor/supervisor-selectors";
import FormItem from "antd/es/form/FormItem";

const CompanyStudentProfile = () => {
  const router = useRouter();

  const { id } = useParams();
  const facultyId = useSupervisorFacultyId();
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [student, setStudent] = useState({});

  const fetchStudent = async () => {
    await api
      .get(`Faculties/${facultyId}/Student/${id}`, null, token)
      .then((res) => {
        setStudent(res.item);
      });
  };

  useEffect(() => {
    if (isLoading) return;
    fetchStudent();
  }, [isLoading]);

  return (
    <div>
      {student && (
        <div className="font-default flex flex-col items-center mb-10 pt-6">
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

                  {/* Other details */}
                  <div className="bg-white shadow rounded-md p-4 font-default mt-2 flex flex-col gap-4">
                    <h5 className="font-bold text-base">Other Details</h5>
                    <Form
                      labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      layout="vertical"
                      className="custom-form"
                    >
                      <FormItem
                        label={
                          <span className="font-default text-dark-dark-blue font-semibold">
                            Student number
                          </span>
                        }
                      >
                        <Input value={student.studentId} className=" w-40" />
                      </FormItem>

                      <FormItem
                        label={
                          <span className="font-default text-dark-dark-blue font-semibold">
                            Personal email
                          </span>
                        }
                      >
                        <Input
                          value={student.personalEmail}
                          className=" w-80"
                        />
                      </FormItem>

                      <FormItem
                        label={
                          <span className="font-default text-dark-dark-blue font-semibold">
                            University email
                          </span>
                        }
                      >
                        <Input
                          value={student.universityEmail}
                          className=" w-80"
                        />
                      </FormItem>

                      <Row gutter={32}>
                        <Col span={12}>
                          <FormItem
                            label={
                              <span className="font-default text-dark-dark-blue font-semibold">
                                Phone number
                              </span>
                            }
                          >
                            <Input value={student.phoneNumber} />
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem
                            label={
                              <span className="font-default text-dark-dark-blue font-semibold">
                                CGPA
                              </span>
                            }
                          >
                            <Input
                              value={student.cgpa === 0 ? "N/A" : student.cgpa}
                            />
                          </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyStudentProfile;
