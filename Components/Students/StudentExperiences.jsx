import CreateFormModal from "@/Components/Forms/CreateFormModal";
import { employmentTypes } from "@/shared/employmentTypes";
import api from "@/utils/api";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, DatePicker, message } from "antd";
import React, { useEffect, useState } from "react";
import StudentExperienceItem from "./StudentExperienceItem";
const { RangePicker } = DatePicker;

const StudentExperiences = ({ editable, studentId }) => {
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [experiences, setExperiences] = useState([]);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const fetchExperiences = async () => {
    await api
      .get(`Students/${studentId}/Experience`, null, token)
      .then((response) => {
        setExperiences(response.items);
        console.log(response.items);
      });
  };

  const onAddExperience = async (values) => {
    const [startDate, endDate] = values.time;
    const formattedStartDate = startDate.format("YYYY-MM-01"); // Set day to 01
    const formattedEndDate = endDate.format("YYYY-MM-01"); // Set day to 01

    console.log(values);
    await api
      .post(
        `Students/${studentId}/Experience`,
        {
          title: values.title,
          companyName: values.company,
          employmentType: parseInt(values.type),
          from: formattedStartDate,
          to: formattedEndDate,
        },
        token
      )
      .then(() => {
        message.success("Experience added successfully");
        fetchExperiences();
        setIsCreateModalVisible(false);
      });
  };

  const onDeleteExperience = async (id) => {
    await api
      .delete(`Students/${studentId}/Experience/${id}`, null, token)
      .then(() => {
        message.success("Experience deleted successfully");
        fetchExperiences();
      });
  };

  useEffect(() => {
    if (isLoading) return;
    fetchExperiences();
  }, [studentId, isLoading]);

  return (
    <>
      {editable && isCreateModalVisible && (
        <CreateFormModal
          open={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          title={"Add Experience"}
          onCreate={onAddExperience}
        >
          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Title
              </span>
            }
            name={"title"}
            rules={[{ required: true, message: "Please input a title!" }]}
          >
            <Input className="font-default font-normal text-dark-dark-blue" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Company name
              </span>
            }
            name={"company"}
            rules={[{ required: true, message: "Please input a company!" }]}
          >
            <Input className="font-default font-normal text-dark-dark-blue" />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Employment type
              </span>
            }
            name={"type"}
            rules={[
              { required: true, message: "Please select a employment type!" },
            ]}
          >
            <Select placeholder="Hybrid" notFoundContent={null} allowClear>
              {Object.entries(employmentTypes).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="font-default text-dark-dark-blue font-bold">
                Time
              </span>
            }
            name={"time"}
            rules={[
              { required: true, message: "Please select a employment type!" },
            ]}
          >
            <RangePicker picker="month" className="w-full" />
          </Form.Item>
        </CreateFormModal>
      )}

      <div className="bg-white shadow rounded-md pt-4 ps-4 pe-4 pb-1 font-default max-w-4xl mt-2">
        <div className="flex justify-between">
          <h5 className="font-bold text-base mb-2">Experience</h5>
          {editable && (
            <PlusOutlined
              className=" hover:cursor-pointer hover:text-light-blue text-lg"
              onClick={() => {
                setIsCreateModalVisible(true);
              }}
            />
          )}
        </div>

        {experiences.map((experience) => (
          <StudentExperienceItem
            key={experience.id}
            {...experience}
            ondelete={onDeleteExperience}
          />
        ))}
      </div>
    </>
  );
};

export default StudentExperiences;
