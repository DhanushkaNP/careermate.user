"use client";

import { CompanySize } from "@/shared/companySize";
import api from "@/utils/api";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import {
  EnvironmentFilled,
  FireFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, message, Rate, Row } from "antd";
import React, { useEffect, useState } from "react";
import { BsBuildings } from "react-icons/bs";
import { companyHighProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import ProfileSkills from "@/Components/Profiles/ProfileSkills";
import ContactsAndSocialMedia from "@/Components/Profiles/ContactsAndSocialMedia";
import { useParams } from "next/navigation";
import { useFacultyId } from "@/utils/student/student-selectors";
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

const StudentCompanyProfile = () => {
  const { id } = useParams();
  const facultyId = useFacultyId();
  const studentId = useUserId();
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [company, setCompany] = useState({});

  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchCompany = async () => {
    await api
      .get(`Faculties/${facultyId}/Company/${id}`, null, token)
      .then((res) => {
        setCompany(res.item);
        setFollowersCount(res.item.followersCount);
      });
  };

  const followCompany = async () => {
    try {
      await api.post(`Companies/${id}/Follower`, { studentId }, token);
      message.success("Company followed!");
      setIsFollowing(true);
      setFollowersCount(followersCount + 1);
    } catch (error) {
      message.error("Failed to follow company.");
    }
  };

  const checkFollowing = async () => {
    try {
      const response = await api.get(
        `Companies/${id}/Follower/${studentId}`,
        null,
        token
      );
      setIsFollowing(response.isFollowing);
    } catch (error) {
      console.log(error);
      message.error("Failed to check following status.");
    }
  };

  useEffect(() => {
    checkFollowing();
  }, [id]);

  useEffect(() => {
    if (isLoading) return;
    fetchCompany();
  }, [isLoading, id]);

  return (
    <>
      <div className="font-default flex flex-col mb-10 items-center ">
        <div className="max-w-5xl">
          <div className="w-full bg-white shadow p-4 rounded-md gap-6 flex items-center">
            <div className="rounded-full h-fit border">
              <Avatar
                size={140}
                icon={!company.firebaseLogoId && <UserOutlined />}
                src={
                  company.firebaseLogoId &&
                  companyHighProfilePicture(company.firebaseLogoId)
                }
              />
            </div>
            <div className=" w-full h-full pt-3">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <h3 className=" text-3xl font-bold ">{company.name}</h3>
                  <Link
                    className=" text-light-blue font-bold underline text-sm hover:cursor-pointer content-center"
                    href={`${id}/internships`}
                  >
                    {company.availableInternshipsCount} Jobs available
                  </Link>
                </div>
              </div>
              {company.webUrl && (
                <Link
                  className=" text-light-blue font-bold underline hover:cursor-pointer content-center mt-1 text-lg"
                  href={company.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.webUrl}
                </Link>
              )}

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
              <div className="flex justify-between">
                <div className="flex gap-6 mt-4 items-end">
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

                {!isFollowing && (
                  <Button
                    type="primary"
                    size="small"
                    className="px-4 text-sm self-end"
                    onClick={followCompany}
                  >
                    Follow
                  </Button>
                )}

                {isFollowing && (
                  <Button
                    type="primary"
                    size="small"
                    className="px-4 text-sm self-end"
                    disabled
                  >
                    Following
                  </Button>
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
              </Col>

              <Col span={10}>
                {/* Skills company looking for */}
                <ProfileSkills
                  editable={true}
                  companyId={id}
                  title="Skills we are looking for"
                />

                {/* Contact */}
                <ContactsAndSocialMedia companyId={id} editable={true} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCompanyProfile;
