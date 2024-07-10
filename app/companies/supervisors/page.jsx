"use client";

import { Col, Form, Input, Row } from "antd";
import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { useFacultyId } from "@/utils/company/company-selectors";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import CustomPagination from "@/app/students/CustomPagination";
import SupervisorOverview from "@/Components/Supervisors/SupervisorOverview";
import DeleteModal from "@/Components/DeleteModal";
import UpdateFormModal from "@/Components/Forms/UpdateFormModal";

const Supervisors = () => {
  const facultyId = useFacultyId();
  const token = useUserToken();
  const companyId = useUserId();
  const isLoading = useIsLoading();

  const [supervisors, setSupervisors] = useState([{}]);

  const [searchKeyword, setSearchKeyword] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const [supervisorDeleteModalDetails, setSupervisorDeleteModalDetails] =
    useState({
      isOpen: false,
      id: null,
      name: null,
    });

  const [supervisorEditModalDetails, setSupervisorEditModalDetails] = useState({
    isOpen: false,
    id: null,
    firstName: null,
    lastName: null,
    designation: null,
  });

  const fetchSupervisors = async (page = 1, pageSize = 20) => {
    let offset = (page - 1) * pageSize;

    let params = {
      offset,
      limit: pageSize,
      search: searchKeyword,
    };

    try {
      const response = await api.get(
        `Faculties/${facultyId}/Companies/${companyId}/Supervisor`,
        params,
        token
      );
      setSupervisors(response.items);
      console.log(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.count,
        current: page,
        pageSize: pageSize,
      }));
    } catch (error) {
      console.error(error);
      setSupervisors([]);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchSupervisors(page, pageSize);
  };

  useEffect(() => {
    if (isLoading) return;
    fetchSupervisors();
  }, [searchKeyword, isLoading, companyId]);

  const deleteSupervisor = async (id) => {
    await api.delete(
      `Faculties/${facultyId}/Companies/${companyId}/Supervisor/${id}`,
      token
    );
    setSupervisorDeleteModalDetails({ isOpen: false, id: null, name: null });
    fetchSupervisors();
  };

  const onSupervisorEditClickHandler = async (id) => {
    try {
      await api
        .get(
          `Faculties/${facultyId}/Companies/${companyId}/Supervisor/${id}`,
          null,
          token
        )
        .then((response) => {
          setSupervisorEditModalDetails({
            isOpen: true,
            id: response.item.id,
            firstName: response.item.firstName,
            lastName: response.item.lastName,
            designation: response.item.designation,
          });
        });
    } catch (error) {
      throw error;
    }
  };

  const UpdateSupervisor = async (values) => {
    await api.put(
      `Faculties/${facultyId}/Companies/${companyId}/Supervisor/${supervisorEditModalDetails.id}`,
      {
        firstName: values["first-name"],
        lastName: values["last-name"],
        designation: values.designation,
      },
      token
    );
    fetchSupervisors();
    setSupervisorEditModalDetails({
      isOpen: false,
      id: null,
      firstName: null,
      lastName: null,
      designation: null,
    });
  };

  return (
    <>
      {/* Superviosr delete */}
      <DeleteModal
        open={supervisorDeleteModalDetails.isOpen}
        onCancel={() =>
          setSupervisorDeleteModalDetails({
            isOpen: false,
            id: null,
            name: null,
          })
        }
        message={`Do you want to delete degree ${supervisorDeleteModalDetails.name}?`}
        onDelete={() => deleteSupervisor(supervisorDeleteModalDetails.id)}
      />
      {/* update Pathway Modal */}
      <UpdateFormModal
        open={supervisorEditModalDetails.isOpen}
        message={"Update Supervisor"}
        onCancel={() =>
          setSupervisorEditModalDetails({
            isOpen: false,
            id: null,
            firstName: null,
            lastName: null,
            designation: null,
          })
        }
        initialValues={{
          "first-name": supervisorEditModalDetails.firstName,
          "last-name": supervisorEditModalDetails.lastName,
          designation: supervisorEditModalDetails.designation,
        }}
        onUpdate={UpdateSupervisor}
      >
        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              First name
            </span>
          }
          name={"first-name"}
          rules={[
            { required: true, message: "Please provide name first name" },
          ]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Last name
            </span>
          }
          name={"last-name"}
          rules={[{ required: true, message: "Please provide name last name" }]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-bold">
              Designation
            </span>
          }
          name={"designation"}
          rules={[
            { required: true, message: "Please provide name designation" },
          ]}
        >
          <Input className="font-default font-normal text-dark-dark-blue" />
        </Form.Item>
      </UpdateFormModal>

      <div className="pt-6 h-full flex flex-col min-h-screen">
        <Input.Search
          placeholder={"Search by name and student number"}
          enterButton="Search"
          className="shadow-sm flex-initial font-semibold w-96"
          size="large"
          style={{ borderRadius: "0px !important" }}
          onSearch={(value) => setSearchKeyword(value)}
          allowClear
        />

        <div className="mt-4">
          <div className="bg-white shadow-md w-full h-8 font-semibold border">
            <Row gutter={16} className="h-full ps-4">
              <Col span={5} className="font-default flex items-center">
                Supervisor Name
              </Col>
              <Col span={4} className="font-default flex items-center">
                Designation
              </Col>
              <Col span={5} className="font-default flex items-center">
                Email
              </Col>
              <Col span={10} className="font-default flex items-center"></Col>
            </Row>
          </div>
          <div className="mt-2">
            {supervisors.map((supervisor) => (
              <SupervisorOverview
                key={supervisor.id}
                id={supervisor.id}
                designation={supervisor.designation}
                email={supervisor.email}
                firstName={supervisor.firstName}
                lastName={supervisor.lastName}
                onDeleteClick={(id, name) => {
                  setSupervisorDeleteModalDetails({
                    isOpen: true,
                    id: id,
                    name: name,
                  });
                }}
                onEditClick={onSupervisorEditClickHandler}
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
    </>
  );
};

export default Supervisors;
