"use client";

import api, { formatFilters } from "@/utils/api";
import { useFacultyId } from "@/utils/company/company-selectors";
import { Col, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import CustomPagination from "@/app/students/CustomPagination";
import ApplicantOverview from "@/Components/Applicants/ApplicantOverview";
import { studentLowProfilePicture } from "@/utils/firebase/FirebaseImageUrls";

const CompanyApplicants = () => {
  const facultyId = useFacultyId();
  const token = useUserToken();
  const isLoading = useIsLoading();
  const companyId = useUserId();

  const [internships, setInternships] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchInternships = async (value) => {
    try {
      const response = await api.get(
        `Faculties/${facultyId}/Companies/${companyId}/InternshipPosts/Suggestions`,
        { limit: 20 },
        token
      );
      setInternships(response.items);
    } catch (error) {
      console.error("Failed to fetch degrees:", error);
      setInternships([]);
    }
  };

  const fetchApplicants = async (page = 1, pageSize = 20) => {
    let offset = (page - 1) * pageSize;

    let filters = {};
    if (selectedInternship)
      filters = { ...filters, internshipPost: selectedInternship };

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
      ...formatFilters(filters),
    };

    try {
      const response = await api.get(
        `Faculties/${facultyId}/Companies/${companyId}/Applicant/List`,
        params,
        token
      );
      setApplicants(response.items);
      console.log("Applicants", response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error(error);
      setApplicants([]);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchApplicants(page, pageSize);
  };

  useEffect(() => {
    fetchInternships();
  }, [companyId, facultyId]);

  useEffect(() => {
    if (isLoading) return;
    fetchApplicants();
  }, [searchKeyword, selectedInternship, isLoading, companyId]);

  return (
    <div className="pt-6 h-full flex flex-col min-h-screen">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Select
            placeholder="Filter by Internship"
            className="shadow-md font-default custom-placeholder w-80 custom-select !text-lg"
            size="large"
            allowClear
            onSelect={(value) => setSelectedInternship(value)}
            onClear={() => {
              setSelectedInternship(null);
            }}
          >
            {internships.map((i) => (
              <Select.Option key={i.id} label={i.title}>
                {i.title}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Input.Search
          placeholder={"Search by name and student number"}
          enterButton="Search"
          className="shadow-sm flex-initial font-semibold w-96"
          size="large"
          style={{ borderRadius: "0px !important" }}
          onSearch={(value) => setSearchKeyword(value)}
          allowClear
        />
      </div>

      <div className="mt-4">
        <div className="bg-white shadow-md w-full h-8 font-semibold">
          <Row gutter={16} className="h-full">
            <Col span={1} className="font-default flex justify-center"></Col>
            <Col span={5} className="font-default flex items-center">
              Name
            </Col>
            <Col span={3} className="font-default flex items-center">
              Degree Program
            </Col>
            <Col span={5} className="font-default flex items-center">
              Pathway
            </Col>
            <Col span={2} className="font-default flex items-center">
              CGPA
            </Col>
            <Col span={5} className="font-default flex items-center">
              Applied Internship
            </Col>
            <Col span={3} className="font-default flex items-center"></Col>
          </Row>
        </div>

        <div className="mt-2">
          {applicants.map((applicant) => (
            <ApplicantOverview
              key={applicant.id}
              name={`${applicant.firstName} ${applicant.lastName}`}
              degree={applicant.degreeAcronym}
              pathway={applicant.pathwayName}
              gpa={applicant.cgpa}
              internship={applicant.appliedInternshipName}
              id={applicant.id}
              proPicUrl={
                applicant.profilePicFirebaseId
                  ? studentLowProfilePicture(applicant.profilePicFirebaseId)
                  : null
              }
              internshipPostId={applicant.appliedInternshipPostId}
              internshipId={applicant.appliedInternshipId}
              studentId={applicant.studentId}
              profilePicFirebaseId={applicant.profilePicFirebaseId}
              isAlreadyIntern={applicant.isAlreadyIntern}
              fetchApplicants={fetchApplicants}
            />
          ))}
        </div>
      </div>

      <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePaginationChange}
      />
    </div>
  );
};

export default CompanyApplicants;
