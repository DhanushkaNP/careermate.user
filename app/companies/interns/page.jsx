"use client";

import api, { formatFilters } from "@/utils/api";
import { useFacultyId } from "@/utils/company/company-selectors";
import { Col, Input, Row, Select, Avatar, Button } from "antd";
import React, { useEffect, useState } from "react";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import CustomPagination from "@/app/students/CustomPagination";
import ApplicantOverview from "@/Components/Applicants/ApplicantOverview";

const CompanyInterns = () => {
  const facultyId = useFacultyId();
  const token = useUserToken();
  const isLoading = useIsLoading();
  const companyId = useUserId();

  const [internships, setInternships] = useState([]);
  const [interns, setInterns] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchInternships = async () => {
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

  const fetchInterns = async (page = 1, pageSize = 20) => {
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
        // Url should verify with backend
        `Faculties/${facultyId}/Companies/${companyId}/Interns/List`,
        params,
        token
      );
      setInterns(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      setInterns([]);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchInterns(page, pageSize);
  };

  useEffect(() => {
    fetchInternships();
  }, [companyId, facultyId]);

  useEffect(() => {
    if (isLoading) return;
    fetchInterns();
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
            <Col span={5} className="font-default flex items-center">
              Supervisor
            </Col>
            <Col span={3} className="font-default flex items-center">
              Start Date
            </Col>
            <Col span={2} className="font-default flex items-center">
              Duration
            </Col>
            <Col span={5} className="font-default flex items-center">
              Internship
            </Col>
            <Col span={3} className="font-default flex items-center"></Col>
          </Row>
        </div>

        <div className="mt-2">
          <div className="bg-white shadow-md w-full h-14 border">
            <Row gutter={16} className="h-full">
              <Col
                span={1}
                className="font-default flex justify-center items-center w-full "
              >
                <div className="border rounded-full ms-2">
                  <Avatar
                    size={"large"}
                    src="https://firebasestorage.googleapis.com/v0/b/careermate-564aa.appspot.com/o/flyers%2FUntitled%20design%20(2).png?alt=media&token=769a6a85-cc21-41b1-8447-747943a2d8c0"
                  />
                </div>
              </Col>
              <Col span={5} className="font-default flex items-center">
                Danushka Nuwan
              </Col>
              <Col span={5} className="font-default flex items-center">
                Sahan Diasena
              </Col>
              <Col span={3} className="font-default flex items-center">
                October 02, 2023
              </Col>
              <Col span={2} className="font-default flex items-center">
                6 Months
              </Col>
              <Col span={5} className="font-default flex items-center">
                <p>Software engineer - Intern</p>
              </Col>
              <Col span={3} className="font-default flex items-center">
                <Button type="primary" className="!text-xs" ghost>
                  View profile
                </Button>
              </Col>
            </Row>
          </div>
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

export default CompanyInterns;
