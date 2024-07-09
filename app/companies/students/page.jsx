"use client";

import CustomPagination from "@/app/students/CustomPagination";
import StudentOverview from "@/Components/Students/StudentOverview";
import api, { formatFilters } from "@/utils/api";
import { useIsLoading, useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/company/company-selectors";
import { Col, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";

const CompanyStudents = () => {
  const facultyId = useFacultyId();
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [degrees, setDegrees] = useState([]);
  const [pathways, setPathways] = useState([]);
  const [students, setStudents] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchDegrees = async (value) => {
    try {
      const response = await api.get(
        `Faculty/${facultyId}/Degrees/Suggestions`,
        { limit: 15 },
        null
      );
      setDegrees(response.items);
      console.log(response.items);
    } catch (error) {
      console.error("Failed to fetch degrees:", error);
      setDegrees([]);
    }
  };

  const fetchPathways = async (value) => {
    try {
      const response = await api.get(
        `Degree/${selectedDegreeProgram}/Pathways/Suggestions`,
        { limit: 15 }
      );
      setPathways(response.items);
    } catch (error) {
      console.error("Failed to fetch pathways:", error);
      setPathways([]);
    }
  };

  const fetchStudents = async (page = 1, pageSize = 15) => {
    let offset = (page - 1) * pageSize;

    let filters = {};
    if (selectedDegreeProgram)
      filters = { ...filters, degree: selectedDegreeProgram };
    if (selectedPathway) filters = { ...filters, pathway: selectedPathway };

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
      ...formatFilters(filters),
    };

    try {
      const response = await api.get(
        `/Faculties/${facultyId}/Student/List`,
        params,
        token
      );
      setStudents(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error(error);
      setStudents([]);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchStudents(page, pageSize);
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  useEffect(() => {
    if (!selectedDegreeProgram) return;
    fetchPathways();
  }, [selectedDegreeProgram]);

  useEffect(() => {
    if (isLoading) return;
    fetchStudents();
  }, [
    searchKeyword,
    selectedDegreeProgram,
    selectedPathway,
    isLoading,
    facultyId,
  ]);

  return (
    <div className="pt-6 h-full flex flex-col min-h-screen">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Select
            placeholder="Degree Program"
            className="shadow-md font-default custom-placeholder w-80 custom-select"
            size="large"
            allowClear
            onSelect={(value) => setSelectedDegreeProgram(value)}
            onClear={() => {
              setSelectedDegreeProgram(null);
              setSelectedPathway(null);
            }}
          >
            {degrees.map((i) => (
              <Select.Option key={i.id} label={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Pathway"
            className="shadow-md text-black font-default custom-placeholder w-72 custom-select"
            size="large"
            allowClear
            onSelect={(value) => setSelectedPathway(value)}
            onClear={() => setSelectedPathway(null)}
            disabled={!selectedDegreeProgram}
          >
            {pathways.map((i) => (
              <Select.Option key={i.id} label={i.name}>
                {i.name}
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
            <Col span={4} className="font-default flex items-center">
              Student number
            </Col>
            <Col span={3} className="font-default flex items-center">
              Status
            </Col>
            <Col span={3} className="font-default flex items-center"></Col>
          </Row>
        </div>

        <div className="mt-2">
          {students.map((s) => (
            <StudentOverview
              proPicUrl={s.profilePicUrl}
              name={`${s.firstName} ${s.lastName}`}
              degree={s.degreeAcronym}
              pathway={s.pathwayName}
              studentId={s.studentId}
              isHired={s.isHired}
              id={s.id}
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

export default CompanyStudents;
