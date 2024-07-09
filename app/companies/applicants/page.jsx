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
      console.log(response.items);
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
          {/* <div className="bg-white shadow-md w-full h-10 border">
            <Row gutter={16} className="h-full">
              <Col
                span={1}
                className="font-default flex justify-center items-center w-full "
              >
                <div className="border rounded-full">
                  <Avatar
                    className=""
                    src="https://firebasestorage.googleapis.com/v0/b/careermate-564aa.appspot.com/o/flyers%2FUntitled%20design%20(2).png?alt=media&token=769a6a85-cc21-41b1-8447-747943a2d8c0"
                  />
                </div>
              </Col>
              <Col span={5} className="font-default flex items-center">
                Danushka Nuwan
              </Col>
              <Col span={3} className="font-default flex items-center">
                BICT (Hons)
              </Col>
              <Col span={5} className="font-default flex items-center">
                Software system technology
              </Col>
              <Col span={2} className="font-default flex items-center">
                3.82
              </Col>
              <Col span={5} className="font-default flex items-center">
                <Link href={"test"}>Software engineer - Intern</Link>
              </Col>
              <Col span={3} className="font-default flex items-center">
                <Button type="primary" size="small" className="!text-xs" ghost>
                  View profile
                </Button>
              </Col>
            </Row>
          </div> */}
          {applicants.map((applicant) => (
            <ApplicantOverview
              name={`${applicant.firstName} ${applicant.lastName}`}
              degree={applicant.degreeAcronym}
              pathway={applicant.pathwayName}
              gpa={applicant.cgpa}
              internship={applicant.appliedInternshipName}
              id={applicant.id}
              proPicUrl={applicant.profilePicUrl}
              internshipPostId={applicant.appliedInternshipPostId}
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
