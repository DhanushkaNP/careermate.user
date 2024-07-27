"use client";

import AvatarUploader from "@/Components/Forms/AvatarUploader";
import UpdateFormModal from "@/Components/Forms/UpdateFormModal";
import StatusIndicator from "@/Components/StatusIndicator";
import { CompanySize } from "@/shared/companySize";
import api from "@/utils/api";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/company/company-selectors";
import {
  EditOutlined,
  EnvironmentFilled,
  FireFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Col, DatePicker, Form, Input, Rate, Row, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { BsBuildings } from "react-icons/bs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/utils/firebase/firebaseConfig";
import {
  companyHighProfilePicture,
  companyLowProfilePicture,
} from "@/utils/firebase/FirebaseImageUrls";
import { useSetAvatarUrl } from "@/utils/Auth/auth-actions";
import ProfileSkills from "@/Components/Profiles/ProfileSkills";
import ContactsAndSocialMedia from "@/Components/Profiles/ContactsAndSocialMedia";
import Link from "next/link";

const formatDateToYearMonthStyle = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const formatBioText = (text) => {
  return text.split("\n\n").map((paragraph, index) => (
    <p key={index} className="mb-4">
      {paragraph}
    </p>
  ));
};

const CompanyProfile = () => {
  const companyId = useUserId();
  const facultyId = useFacultyId();
  const token = useUserToken();
  const isLoading = useIsLoading();

  const setAvatarUrl = useSetAvatarUrl();

  const [company, setCompany] = useState({});

  const [companyStatus, setCompanyStatus] = useState(1);

  const [backendLogoPicId, setBackendLogoPicId] = useState(null);
  const [logoId, setLogoId] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchCompany = async () => {
    await api
      .get(`Faculties/${facultyId}/Company/${companyId}`, null, token)
      .then((res) => {
        setCompany(res.item);
        setCompanyStatus(res.item.status);
        setBackendLogoPicId(res.item.firebaseLogoId);
        setLogoId(res.item.firebaseLogoId);
      });
  };

  const handleLogoUpload = (imageId) => {
    setLogoId(imageId);
  };

  const onCompanyUpdate = async (values) => {
    console.log("Updating company details:", values);
    try {
      let formattedFoundedOn = null;
      if (values.founded) {
        formattedFoundedOn = values.founded.format("YYYY-MM-01");
      }

      // Update the company details
      await api.put(
        `Faculties/${facultyId}/Company/${companyId}`,
        {
          name: values.name,
          webUrl: values.website,
          location: values.location,
          email: values.email,
          phoneNumber: values.phone,
          foundedOn: formattedFoundedOn,
          companySize: parseInt(values.size),
          address: values.address,
          bio: values.bio,
          firebaseLogoId: logoId,
        },
        token
      );

      // Delete previous logo if it was changed
      if (backendLogoPicId !== logoId && backendLogoPicId) {
        const initialHighImageRef = ref(
          storage,
          `companies_logo/high/${backendLogoPicId}`
        );
        const initialLowImageRef = ref(
          storage,
          `companies_logo/low/${backendLogoPicId}`
        );

        await deleteObject(initialHighImageRef);
        await deleteObject(initialLowImageRef);
      }

      // Update state and close modal
      setBackendLogoPicId(logoId);
      setIsUpdateModalOpen(false);
      fetchCompany();
      setAvatarUrl(logoId ? companyLowProfilePicture(logoId) : null);
    } catch (error) {
      console.error("Error updating company details:", error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    fetchCompany();
  }, [isLoading, companyId]);

  return (
    <>
      {isUpdateModalOpen && (
        <UpdateFormModal
          open={isUpdateModalOpen}
          width={"40%"}
          onUpdate={(values) => {
            onCompanyUpdate(values);
          }}
          onCancel={() => {
            setIsUpdateModalOpen(false);
          }}
          title={"Update Profile"}
          initialValues={{
            name: company.name,
            website: company.webUrl,
            location: company.location,
            email: company.email,
            phone: company.phoneNumber,
            founded: company.foundedOn ? dayjs(company.foundedOn) : null,
            size: CompanySize[company.companySize],
            address: company.address,
            bio: company.bio,
          }}
        >
          <Row gutter={20}>
            <Col span={8}>
              <AvatarUploader
                onAvatarUpload={handleLogoUpload}
                backendImageId={backendLogoPicId}
                firebaseUrlPrefix={"companies_logo"}
              />
            </Col>
            <Col span={16}>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    Company Name
                  </span>
                }
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Please input your company name!",
                  },
                ]}
              >
                <Input className="font-default font-normal text-dark-dark-blue" />
              </Form.Item>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    Website
                  </span>
                }
                name={"website"}
              >
                <Input
                  className="font-default font-normal text-dark-dark-blue"
                  placeholder="https://www.ibm.com/"
                />
              </Form.Item>
            </Col>
          </Row>
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
                message: "Please input your company location!",
              },
            ]}
          >
            <Input className="font-default font-normal text-dark-dark-blue" />
          </Form.Item>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    Email
                  </span>
                }
                name={"email"}
                rules={[
                  {
                    required: true,
                    message: "Please input your company email!",
                  },
                  { type: "email", message: "The input is not valid E-mail!" },
                ]}
              >
                <Input className="font-default font-normal text-dark-dark-blue" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    Phone
                  </span>
                }
                name={"phone"}
                rules={[
                  {
                    required: true,
                    message: "Please input your company phone number!",
                  },
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
                    Founded on
                  </span>
                }
                name={"founded"}
              >
                <DatePicker picker="month" className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-default text-dark-dark-blue font-semibold">
                    Company size
                  </span>
                }
                name={"size"}
              >
                <Select
                  placeholder="1-10 employees"
                  notFoundContent={null}
                  allowClear
                >
                  {Object.entries(CompanySize).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-semibold">
                Address
              </span>
            }
            name={"address"}
            rules={[
              {
                required: true,
                message: "Please input your company address!",
              },
            ]}
          >
            <TextArea className="font-default font-normal text-dark-dark-blue" />
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
                message: "Please input your company bio!",
              },
            ]}
          >
            <TextArea
              className="font-default font-normal text-dark-dark-blue"
              rows={10}
            />
          </Form.Item>
        </UpdateFormModal>
      )}

      <div className="font-default flex flex-col mb-10 pt-16 items-center ">
        <div className="max-w-5xl">
          <div className="w-full bg-white shadow p-4 rounded-md gap-6 flex items-center">
            <div className="rounded-full h-fit border">
              <Avatar
                size={140}
                icon={!company.firebaseLogoId && <UserOutlined />}
                src={
                  company.firebaseLogoId && companyHighProfilePicture(logoId)
                }
              />
            </div>
            <div className=" w-full h-full pt-3">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <h3 className=" text-3xl font-bold ">{company.name}</h3>

                  <Link
                    className=" text-light-blue font-bold underline text-sm hover:cursor-pointer content-center"
                    href={"internships/our-posts"}
                  >
                    {company.availableInternshipsCount} Jobs available
                  </Link>
                </div>
                <div>
                  <EditOutlined
                    className="text-lg hover:cursor-pointer hover:text-light-blue"
                    onClick={() => setIsUpdateModalOpen(true)}
                  />
                </div>
              </div>
              <p className=" text-light-blue font-bold underline hover:cursor-pointer content-center mt-1 text-lg">
                {company.webUrl}
              </p>

              <p className=" items-end text-sm text-light-blue font-semibold ps-2">
                {company.followersCount} Followers
              </p>
              <div className="flex mt-2 gap-2 text-sm font-bold">
                <p className=" text-ice-blue content-center ps-2">
                  {company.companyRatings ? company.companyRatings : "0.0"}
                </p>
                <p>
                  <Rate
                    value={Math.round(company.companyRatings * 2) / 2}
                    className="text-ice-blue text-base"
                    allowHalf
                    disabled
                  />
                </p>
                {company.companyRatings == null && (
                  <p className=" text-sm text-light-gray font-extralight">
                    No ratings so far
                  </p>
                )}
              </div>
              <div className="flex justify-between items-end">
                <div className="flex gap-6 mt-4">
                  {company.foundedOn && (
                    <div className="flex gap-2">
                      <div className="border rounded-full w-8 h-8 flex justify-center">
                        <FireFilled className="text-lg text-ice-blue" />
                      </div>
                      <div className="text-xs">
                        <p>Founded</p>
                        <p className=" font-bold">
                          {formatDateToYearMonthStyle(company.foundedOn)}
                        </p>
                      </div>
                    </div>
                  )}

                  {company.companySize && (
                    <div className="flex gap-2">
                      <div className="border rounded-full w-8 h-8 flex justify-center">
                        <TeamOutlined className="text-lg text-ice-blue" />
                      </div>
                      <div className="text-xs">
                        <p>Company size</p>
                        <p className=" font-bold">
                          {CompanySize[company.companySize]}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="border rounded-full w-8 h-8 flex justify-center">
                      <EnvironmentFilled className="text-lg text-ice-blue" />
                    </div>
                    <div className="text-xs">
                      <p>Location</p>
                      <p className=" font-bold">{company.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="border rounded-full w-8 h-8 flex justify-center items-center">
                      <BsBuildings className="text-lg text-ice-blue" />
                    </div>
                    <div className="text-xs">
                      <p>Industry</p>
                      <p className=" font-bold">{company.industryName}</p>
                    </div>
                  </div>
                </div>
                {companyStatus == 1 && (
                  <StatusIndicator name={"Pending"} color={"blue"} />
                )}
                {companyStatus == 2 && (
                  <StatusIndicator name={"Approved"} color={"green"} />
                )}
                {companyStatus == 3 && (
                  <StatusIndicator name={"Blocked"} color={"black"} />
                )}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <Row gutter={10}>
              <Col span={14}>
                <div className="bg-white shadow rounded-md p-4 font-default max-w-4xl">
                  <h5 className="font-bold text-base">Company Bio</h5>
                  <p className=" text-justify">
                    {company.bio && formatBioText(company.bio)}
                  </p>
                </div>

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
                    <Row gutter={32}>
                      <Col span={12}>
                        <FormItem
                          label={
                            <span className="font-default text-dark-dark-blue font-semibold">
                              Phone number
                            </span>
                          }
                        >
                          <Input value={company.phoneNumber} />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem
                          label={
                            <span className="font-default text-dark-dark-blue font-semibold">
                              Email
                            </span>
                          }
                        >
                          <Input value={company.email} />
                        </FormItem>
                      </Col>
                    </Row>

                    <FormItem
                      label={
                        <span className="font-default text-dark-dark-blue font-semibold">
                          Address
                        </span>
                      }
                    >
                      <TextArea value={company.address} />
                    </FormItem>

                    <FormItem
                      label={
                        <span className="font-default text-dark-dark-blue font-semibold">
                          Location
                        </span>
                      }
                    >
                      <Input value={company.location} />
                    </FormItem>
                  </Form>
                </div>
              </Col>

              <Col span={10}>
                {/* Skills company looking for */}
                <ProfileSkills
                  editable={true}
                  companyId={companyId}
                  title="Skills we are looking for"
                />

                {/* Contact */}
                <ContactsAndSocialMedia companyId={companyId} editable={true} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;
