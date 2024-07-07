"use client";

import { workPlaceTypes } from "@/shared/workPlaceTypes";
import api, { formatFilters } from "@/utils/api";
import { useIsLoading, useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/student/student-selectors";
import { Avatar, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import CustomPagination from "../CustomPagination";
import InternshipDetailPostSummary from "@/Components/Internships/InternshipDetailPostSummary";

const Internships = () => {
  const facultyId = useFacultyId();
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [posts, setPosts] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedWorkPlaceType, setSelectedWorkPlaceType] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [industries, setIndustries] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [companySearchTerm, setCompanySearchTerm] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchIndustries = async () => {
    try {
      const response = await api.get(`Faculty/${facultyId}/Industries`);
      setIndustries(response.items);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  const handleCompanySearch = async (value) => {
    setCompanySearchTerm(value);
    if (value) {
      try {
        await api
          .get(
            `Faculties/${facultyId}/Company/Suggestions`,
            {
              search: value,
            },
            token
          )
          .then((response) => {
            setCompanies(response.items);
          });
      } catch (error) {
        setCompanies([]);
      }
    } else {
      setCompanies([]);
    }
  };

  useEffect(() => {
    if (!isLoading) fetchIndustries();
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    fetchPosts();
  }, [
    searchKeyword,
    selectedCompany,
    selectedIndustry,
    selectedWorkPlaceType,
    isLoading,
  ]);

  const fetchPosts = async (page = 1, pageSize = 10) => {
    let offset = (page - 1) * pageSize;

    let filters = { status: "approved" };
    if (selectedIndustry) filters = { ...filters, industry: selectedIndustry };
    if (selectedCompany) filters = { ...filters, company: selectedCompany };
    if (selectedWorkPlaceType)
      filters = { ...filters, type: selectedWorkPlaceType };

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
      ...formatFilters(filters),
    };

    try {
      const response = await api.get(
        `Faculties/${facultyId}/InternshipPost/List`,
        params,
        token
      );
      setPosts(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchPosts(page, pageSize);
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <h2 className=" text-4xl font-bold text-dark-blue">
        Find your dream <span className=" text-light-blue">internship</span>{" "}
        today
      </h2>

      <Input.Search
        placeholder={"What type of internship are you looking for ?"}
        enterButton="Search jobs"
        className="shadow-sm flex-initial mt-10 font-semibold"
        size="large"
        style={{ borderRadius: "0px !important" }}
        onSearch={(value) => setSearchKeyword(value)}
      />

      <div className=" mt-4">
        <div className=" flex gap-2">
          <h6 className=" inline-block">Filter by:</h6>{" "}
          <Select
            showSearch
            optionFilterProp="children"
            className="font-default bg-default-background w-52"
            placeholder="Industry"
            onSelect={(value) => setSelectedIndustry(value)}
            maxCount={5}
            allowClear
            onClear={() => setSelectedIndustry(null)}
          >
            {industries.map((i) => (
              <Select.Option key={i.id} label={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            showSearch
            placeholder="Type"
            notFoundContent={null}
            allowClear
            className=" w-24"
            onSelect={(value) => setSelectedWorkPlaceType(value)}
            onClear={() => setSelectedWorkPlaceType(null)}
          >
            {Object.entries(workPlaceTypes).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
          <Select
            showSearch
            optionFilterProp="children"
            className="font-default bg-default-background w-56"
            placeholder="Search company"
            value={companySearchTerm}
            onSelect={(value, option) => {
              setCompanySearchTerm(option.children.name);
              setSelectedCompany(value);
            }}
            maxCount={5}
            allowClear
            onClear={() => {
              setSelectedCompany(null);
              setCompanySearchTerm(null);
            }}
            filterOption={false}
            onSearch={handleCompanySearch}
          >
            {companySearchTerm &&
              companies.map((i) => (
                <Select.Option key={i.id} label={i.name}>
                  {i.name}
                </Select.Option>
              ))}
          </Select>
        </div>
      </div>

      {/* <div className="mt-4">
        <div className=" w-full bg-white shadow-sm border rounded p-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                size={56}
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRg1gJW339_irXORB52coRZ5CgsitxOI_NjA&s"
                }
                className="!border-2"
              />
              <h5 className=" font-semibold text-lg">Calcey Technologies</h5>
            </div>

            <div className=" text-sm">
              <div className="flex gap-2 text-xs">
                <div className=" text-light-blue bg-opacity-light-blue px-2 py-0.5 rounded-lg font-semibold">
                  4 Applicants
                </div>
                <div className=" text-light-blue bg-opacity-light-blue px-2 py-0.5 rounded-lg font-semibold">
                  2 Jobs
                </div>
              </div>

              <p>Location: Colombo</p>
              <p>Type: Hybrid</p>
            </div>
          </div>

          <div>
            <h5>Software Enigneer - Intern</h5>
            <p className=" text-xs mt-2">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised wordswhich don't look even slightly
              believable. If you are going to use a passage of Lorem Ipsum, you
              need to be sure there isn't anything embarrassing hidden in the
              middle of text . . .
            </p>
          </div>
        </div>
      </div> */}
      <div className="mt-4">
        {posts.map((ip) => (
          <InternshipDetailPostSummary
            id={ip.id}
            companyName={ip.companyName}
            companylogo={ip.companyLogoUrl}
            numberOfApplicants={ip.numberOfApplicants}
            numberOfJobs={ip.numberOfJobs}
            location={ip.location}
            type={ip.type}
            title={ip.title}
            description={ip.description}
            postUrl={"internships/"}
          />
        ))}
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

export default Internships;
