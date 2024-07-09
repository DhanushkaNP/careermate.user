import api from "@/utils/api";
import { useUserId, useUserToken } from "@/utils/Auth/auth-selectors";
import { Col, Avatar, Button, message } from "antd";
import React, { useEffect, useState } from "react";

const CompanySummary = ({
  id,
  logoUrl,
  name,
  industry,
  location,
  numberOfFollowers,
  bio,
}) => {
  const truncatedBio = bio.length > 400 ? bio.slice(0, 400) + " . . ." : bio;

  const [followersCount, setFollowersCount] = useState(numberOfFollowers);
  const token = useUserToken();
  const studentId = useUserId();
  const [isFollowing, setIsFollowing] = useState(false);

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
      console.log(response);
      setIsFollowing(response.isFollowing);
    } catch (error) {
      message.error("Failed to check following status.");
    }
  };

  useEffect(() => {
    checkFollowing();
  }, [id]);

  return (
    <Col span={8} className="mb-4">
      <div className="bg-white shadow border p-4 font-default pb-8 hover:bg-default-background hover:cursor-pointer rounded-md h-full">
        <div className="flex gap-4">
          <div>
            <div className="border rounded-full">
              {logoUrl && <Avatar size={56} src={logoUrl} />}
            </div>
          </div>

          <div className=" h-20">
            <h2 className="text-lg font-bold">{name}</h2>
            <div className="flex gap-2 items-center">
              <h5 className="text-base">{industry}</h5>
              <span className="font-extrabold">&middot;</span>
              <h6>{location}</h6>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <p>{followersCount} Followers</p>
          {!isFollowing && (
            <Button
              type="primary"
              size="small"
              className="px-4 text-sm"
              onClick={followCompany}
            >
              Follow
            </Button>
          )}

          {isFollowing && (
            <Button
              type="primary"
              size="small"
              className="px-4 text-sm"
              disabled
            >
              Following
            </Button>
          )}
        </div>

        <div className=" mt-4">
          <p className=" text-justify">{truncatedBio}.</p>
        </div>
      </div>
    </Col>
  );
};

export default CompanySummary;
