"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Upload,
} from "antd";
import { LinkOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { SlGraduation } from "react-icons/sl";
import { MdOutlineLocationOn } from "react-icons/md";
import FormItem from "antd/es/form/FormItem";
import { FcApproval } from "react-icons/fc";
import { IoMdCloudDone } from "react-icons/io";
import { CiWarning } from "react-icons/ci";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/student/student-selectors";
import api from "@/utils/api";
import UpdateFormModal from "@/Components/Forms/UpdateFormModal";
import TextArea from "antd/es/input/TextArea";
import AvatarUploader from "@/Components/Forms/AvatarUploader";
import { storage } from "@/utils/firebase/firebaseConfig";
import {
  studentHighProfilePicture,
  studentLowProfilePicture,
} from "@/utils/firebase/FirebaseImageUrls";
import { deleteObject, ref } from "firebase/storage";
import { useSetAvatarUrl } from "@/utils/Auth/auth-actions";
import { useSetStudentName } from "@/utils/student/student-actions";
import StudentExperiences from "../../../Components/Students/StudentExperiences";
import StudentCertifications from "@/Components/Students/StudentCertifications";
import ProfileSkills from "@/Components/Profiles/ProfileSkills";
import ContactsAndSocialMedia from "@/Components/Profiles/ContactsAndSocialMedia";

const StudentProfile = () => {
  const router = useRouter();

  const studentId = useUserId();
  const facultyId = useFacultyId();
  const token = useUserToken();
  const isLoading = useIsLoading();

  const setAvatarUrl = useSetAvatarUrl();
  const setStudentName = useSetStudentName();

  const [student, setStudent] = useState({});

  const [studentCv, setStudentCv] = useState(null);
  const [cvStatus, setCvStatus] = useState(0);

  const [backendProfilePicId, setBackendProfilePicId] = useState(null);
  const [profilePicId, setProfilePicId] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchStudent = async () => {
    await api
      .get(`Faculties/${facultyId}/Student/${studentId}`, null, token)
      .then((res) => {
        console.log(res);
        setStudent(res.item);
        setBackendProfilePicId(res.item.profilePicFirebaseId);
        setProfilePicId(res.item.profilePicFirebaseId);
        setStudentName(res.item.firstName + " " + res.item.lastName);
        setCvStatus(res.item.cvStatus);
      });
  };

  const handleProfilePictureUpload = (imageId) => {
    setProfilePicId(imageId);
  };

  const onProfileUpdate = async (values) => {
    await api
      .put(
        `Faculties/${facultyId}/Student/${studentId}`,
        {
          firstName: values["first-name"],
          lastName: values["last-name"],
          personalEmail: values["personal-email"],
          phone: values["phone-number"],
          cgpa: values.cgpa,
          headline: values.headline,
          location: values.location,
          about: values.about,
          profilePicFirebaseId: profilePicId,
        },
        token
      )
      .then(async () => {
        if (backendProfilePicId != profilePicId && backendProfilePicId) {
          const initialHighImageRef = ref(
            storage,
            `student_profile_picture/high/${backendProfilePicId}`
          );
          const initialLowImageRef = ref(
            storage,
            `student_profile_picture/low/${backendProfilePicId}`
          );
          await deleteObject(initialHighImageRef);
          await deleteObject(initialLowImageRef);
        }

        setBackendProfilePicId(profilePicId);
        setIsUpdateModalOpen(false);
        fetchStudent();
        setAvatarUrl(
          profilePicId ? studentLowProfilePicture(profilePicId) : null
        );
      });
  };

  const cvUploaderProps = {
    name: "cv",
    multiple: false,
    accept: ".pdf",
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error(`${file.name} is not a PDF file`);
      }
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        message.error("File must be smaller than 3MB!");
      }
      return isPDF && isLt3M;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest: ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append("cvName", file.name);
      formData.append("cv", file);

      api
        .post(
          `Faculties/${facultyId}/Student/${studentId}/CV`,
          formData,
          token,
          {
            "Content-Type": "multipart/form-data",
            Accept: "multipart/form-data",
          }
        )
        .then((response) => {
          onSuccess(file);
          setStudentCv(file);
          setCvStatus(1);
        })
        .catch((error) => {
          onError(error);
        });
    },
  };

  const downloadCv = async () => {
    router.push(
      `http://localhost:62200/api/Faculties/${facultyId}/Student/${studentId}/CV`
    );
  };

  const deleteCv = async () => {
    await api
      .delete(`Faculties/${facultyId}/Student/${studentId}/CV`, token)
      .then(() => {
        setStudentCv(null);
        setCvStatus(0);
      });
  };

  useEffect(() => {
    if (isLoading) return;
    fetchStudent();
  }, [isLoading]);

  return (
    <div>
      {isUpdateModalOpen && (
        <UpdateFormModal
          open={isUpdateModalOpen}
          width={"36%"}
          onCancel={() => {
            setIsUpdateModalOpen(false);
          }}
          onUpdate={(values) => onProfileUpdate(values)}
          title={"Update Profile"}
          initialValues={{
            "first-name": student.firstName,
            "last-name": student.lastName,
            "personal-email": student.personalEmail,
            "phone-number": student.phoneNumber,
            cgpa: student.cgpa,
            headline: student.headline,
            location: student.location,
            about: student.about,
          }}
        >
          <Row gutter={20}>
            <Col span={10}>
              <AvatarUploader
                onAvatarUpload={handleProfilePictureUpload}
                backendImageId={backendProfilePicId}
                firebaseUrlPrefix={"student_profile_picture"}
              />
            </Col>
            <Col span={14}>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    First Name
                  </span>
                }
                name={"first-name"}
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input className="font-default font-normal text-dark-dark-blue" />
              </Form.Item>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    Last Name
                  </span>
                }
                name={"last-name"}
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input className="font-default font-normal text-dark-dark-blue" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    Personal Email
                  </span>
                }
                name={"personal-email"}
                rules={[
                  {
                    required: true,
                    message: "Please input your personal name!",
                  },
                ]}
              >
                <Input className="font-default font-normal text-dark-dark-blue" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    Phone number
                  </span>
                }
                name={"phone-number"}
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input
                  className="font-default font-normal text-dark-dark-blue"
                  placeholder="071-3343344"
                />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    CGPA
                  </span>
                }
                name={"cgpa"}
                rules={[{ required: true, message: "Please input your CGPA!" }]}
              >
                <Input
                  className="font-default font-normal text-dark-dark-blue"
                  placeholder="3.82"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-semibold">
                Headline
              </span>
            }
            name={"headline"}
          >
            <TextArea
              className="font-default font-normal text-dark-dark-blue"
              rows={1}
              placeholder="BICT(Hons) undergraduate | .NET enthusiast | Content creator "
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-semibold">
                Your Location
              </span>
            }
            name={"location"}
          >
            <Input
              className="font-default font-normal text-dark-dark-blue"
              placeholder="Kandy District, Central Province, Sri Lanka"
              rows={1}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-semibold">
                About
              </span>
            }
            name={"about"}
          >
            <TextArea
              className="font-default font-normal text-dark-dark-blue"
              placeholder="About me"
              rows={8}
            />
          </Form.Item>
        </UpdateFormModal>
      )}

      {student && (
        <div className="font-default flex flex-col items-center mb-10">
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
                  <EditOutlined
                    className="text-lg hover:cursor-pointer hover:text-light-blue"
                    onClick={() => setIsUpdateModalOpen(true)}
                  />
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

                {!student.profilePicFirebaseId &&
                  !student.location &&
                  !student.headline && (
                    <Alert
                      message="Add profile data for better view"
                      type="warning"
                      className="mt-2"
                      showIcon
                    />
                  )}

                <div className="mt-4">
                  {cvStatus === 0 && (
                    // CV Upload
                    <div className="flex gap-2 text-light-blue items-end h-full">
                      <Upload {...cvUploaderProps} accept=".pdf" maxCount={1}>
                        <Button
                          type="primary"
                          ghost
                          size="small"
                          icon={<UploadOutlined />}
                        >
                          Upload CV
                        </Button>
                      </Upload>
                    </div>
                  )}
                  {cvStatus === 1 && (
                    <div className="flex gap-2 text-light-blue items-center">
                      <div className="flex text-sm gap-2">
                        <LinkOutlined className=" text-dark-gray" />
                        <p
                          href={`http://localhost:62200/api/Faculties/${facultyId}/Student/${studentId}/CV`}
                          className=" underline hover:cursor-pointer"
                          onClick={downloadCv}
                        >
                          Click to download CV
                        </p>
                        <DeleteOutlined
                          className=" text-dark-gray hover:cursor-pointer"
                          onClick={deleteCv}
                        />
                      </div>
                      <span>|</span>
                      <p className="font-semibold text-sm">CV Uploaded</p>
                      <IoMdCloudDone size={20} />
                    </div>
                  )}
                  {cvStatus === 2 && (
                    <div className="flex gap-2 text-light-blue">
                      <div className="flex text-sm gap-2">
                        <LinkOutlined className=" text-dark-gray" />
                        <p
                          href={`http://localhost:62200/api/Faculties/${facultyId}/Student/${studentId}/CV`}
                          className=" underline hover:cursor-pointer"
                          onClick={downloadCv}
                        >
                          Click to download CV
                        </p>
                        <DeleteOutlined
                          className=" text-dark-gray hover:cursor-pointer "
                          onClick={deleteCv}
                        />
                      </div>
                      <span>|</span>
                      <p className="font-semibold text-sm text-green">
                        CV Approved
                      </p>
                      <FcApproval size={20} className="text-green" />
                    </div>
                  )}
                  {cvStatus === 3 && (
                    <div className="flex gap-2 text-light-blue">
                      <div className="flex text-sm gap-2">
                        <LinkOutlined className=" text-dark-gray" />
                        <p
                          href={`http://localhost:62200/api/Faculties/${facultyId}/Student/${studentId}/CV`}
                          className=" underline hover:cursor-pointer"
                          onClick={downloadCv}
                        >
                          Click to download CV
                        </p>
                        <DeleteOutlined
                          className=" text-dark-gray hover:cursor-pointer"
                          onClick={deleteCv}
                        />
                      </div>
                      <span>|</span>
                      <p className="font-semibold text-sm text-red">
                        CV Rejected
                      </p>
                      <CiWarning size={20} className="text-red" />
                      <p className="text-light-gray text-sm">
                        (Upload a new CV)
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
                  <StudentExperiences editable={true} studentId={studentId} />

                  {/* Certifications */}
                  <StudentCertifications
                    editable={true}
                    studentId={studentId}
                  />
                </Col>
                <Col span={10}>
                  {/* Skills */}
                  <ProfileSkills editable={true} studentId={studentId} />

                  {/* Contact */}
                  <ContactsAndSocialMedia
                    editable={true}
                    studentId={studentId}
                  />

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

export default StudentProfile;
