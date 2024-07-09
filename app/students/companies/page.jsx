"use client";
import api, { formatFilters } from "@/utils/api";
import { useIsLoading, useUserToken } from "@/utils/Auth/auth-selectors";
import { useFacultyId } from "@/utils/student/student-selectors";
import { Avatar, Button, Col, Input, Row, Select } from "antd";
import React, { useState, useEffect } from "react";
import CustomPagination from "../CustomPagination";
import CompanySummary from "@/Components/Companies/CompanySummary";

const Companies = () => {
  const isLoading = useIsLoading();
  const facultyId = useFacultyId();
  const token = useUserToken();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const [industries, setIndustries] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchIndustries = async () => {
    try {
      const response = await api.get(`Faculty/${facultyId}/Industries`);
      setIndustries(response.items);
      console.log(response.items);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  const fetchCompanies = async (page = 1, pageSize = 12) => {
    let offset = (page - 1) * pageSize;

    let filters = {};
    if (selectedIndustry) filters = { ...filters, industry: selectedIndustry };

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
      ...formatFilters(filters),
    };

    console.log("params", params);

    try {
      const response = await api.get(
        `Faculties/${facultyId}/Company/List`,
        params,
        token
      );
      console.log(response);
      setCompanies(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchCompanies(page, pageSize);
  };

  useEffect(() => {
    if (!isLoading) fetchIndustries();
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) fetchCompanies();
  }, [searchKeyword, selectedIndustry, isLoading, facultyId]);

  return (
    <div className="flex flex-col min-h-screen ">
      <h2 className=" text-4xl font-bold text-dark-blue">
        Discover your dream <span className=" text-light-blue">Company</span>
      </h2>

      <Input.Search
        placeholder={"Which is the company you looking for ?"}
        enterButton="Find Company"
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
            allowClear
            onClear={() => setSelectedIndustry(null)}
          >
            {industries.map((i) => (
              <Select.Option key={i.id} label={i.name}>
                {i.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6 mx-20">
        <Row gutter={20}>
          {companies.map((company) => (
            <CompanySummary
              key={company.id}
              id={company.id}
              logoUrl={company.logoUrl}
              name={company.name}
              industry={company.industryName}
              location={company.location}
              numberOfFollowers={company.followersCount}
              bio={company.bio}
            />
          ))}
          {/* <Col span={8}>
            <div className="bg-white shadow border p-4 font-default pb-8 hover:bg-default-background hover:cursor-pointer rounded-md">
              <div className="flex gap-4">
                <div>
                  <div className="border rounded-full">
                    <Avatar
                      size={56}
                      src={
                        "https://calcey.com/wp-content/uploads/2022/10/Calcey-Profile-Picture-V2.png"
                      }
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold">Calcey Technologies</h2>
                  <div className="flex gap-2 items-center">
                    <h5 className="text-lg">IT services</h5>
                    <span className="font-extrabold">&middot;</span>
                    <h6>Colombo</h6>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <p>4 Followers</p>
                <Button type="primary" size="small" className="px-4 text-sm">
                  Follow
                </Button>
              </div>

              <div className=" mt-4">
                <p className=" text-justify">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised wordswhich don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text . . .There are many
                  variations of passages of Lor . . .
                </p>
              </div>
            </div>
          </Col> */}
        </Row>
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

export default Companies;
