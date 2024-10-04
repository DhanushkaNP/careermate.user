"use client";

import SupervisorInternOverview from "@/Components/Interns/SupervisorInternOverview";
import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { studentLowProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import { useSupervisorId } from "@/utils/supervisor/supervisor-selectors";
import { Avatar, Button, Col, Input, Row } from "antd";
import React, { useEffect, useState } from "react";

const SupervisorInterns = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [interns, setInterns] = useState([]);

  const token = useUserToken();
  const supervisorId = useSupervisorId();

  const fetchInterns = async () => {
    try {
      await api
        .get(
          `Supervisors/${supervisorId}/Interns`,
          { search: searchKeyword },
          token
        )
        .then((response) => {
          console.log(response);

          setInterns(response.items);
        });
    } catch (error) {
      setInterns([]);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, [searchKeyword]);

  return (
    <div>
      <div className="flex justify-end">
        <Input.Search
          placeholder={"Search by name"}
          enterButton="Search"
          className="shadow-sm flex-initial font-semibold w-96"
          size="large"
          style={{ borderRadius: "0px !important" }}
          onSearch={(value) => setSearchKeyword(value)}
        />
      </div>

      <div className="mt-4">
        <div className="bg-white shadow-md w-full h-8 font-semibold">
          <Row gutter={16} className="h-full">
            <Col span={1} className="font-default flex justify-center"></Col>
            <Col span={5} className="font-default flex items-center">
              Name
            </Col>
            <Col span={5} className="font-default flex items-center">
              Period of internship
            </Col>
            <Col span={4} className="font-default flex items-center">
              Docs
            </Col>
            <Col span={5} className="font-default flex items-center">
              Internship
            </Col>
            <Col span={4} className="font-default flex items-center"></Col>
          </Row>
        </div>
      </div>

      <div className="mt-2">
        <div>
          {interns.map((i) => (
            <SupervisorInternOverview
              key={i.internId}
              id={i.internId}
              studentId={i.internStudentId}
              name={i.name}
              internFrom={i.internshipStartAt}
              internTo={i.internshipEndAt}
              internshipName={i.internshipName}
              numberOfDocs={i.totalDocumentsToReview}
              proPicUrl={
                i.profilePicFirebaseId
                  ? studentLowProfilePicture(i.profilePicFirebaseId)
                  : null
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupervisorInterns;
