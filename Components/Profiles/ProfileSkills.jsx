import { useIsLoading, useUserToken } from "@/utils/Auth/auth-selectors";
import { Col, Form, Input, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import CreateFormModal from "../Forms/CreateFormModal";
import { PlusOutlined } from "@ant-design/icons";
import api from "@/utils/api";
import ProfileSkillItem from "./ProfileSkillItem";

const ProfileSkills = ({
  editable,
  studentId = null,
  companyId,
  title = "Skills",
}) => {
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [skillSetOne, setSkillSetOne] = useState([]);
  const [skillSetTwo, setSkillSetTwo] = useState([]);

  const fetchSkills = async () => {
    if (studentId) {
      await api
        .get(`Students/${studentId}/Skill`, null, token)
        .then((response) => {
          const skills = response.items;
          const half = Math.ceil(skills.length / 2);
          setSkillSetOne(skills.slice(0, half));
          setSkillSetTwo(skills.slice(half, skills.length));
        });
    } else if (companyId) {
      console.log("Company ID", companyId);
      await api
        .get(`Companies/${companyId}/Skill`, null, token)
        .then((response) => {
          const skills = response.items;
          const half = Math.ceil(skills.length / 2);
          setSkillSetOne(skills.slice(0, half));
          setSkillSetTwo(skills.slice(half, skills.length));
        });
    }
  };

  const onAddSkill = async (values) => {
    if (studentId) {
      await api
        .post(`Students/${studentId}/Skill`, { name: values.name }, token)
        .then(async () => {
          message.success("Skill added successfully");
          await fetchSkills();
        });
    } else if (companyId) {
      await api
        .post(`Companies/${companyId}/Skill`, { name: values.name }, token)
        .then(async () => {
          message.success("Skill added successfully");
          await fetchSkills();
        });
    }
  };

  const onDeleteSkill = async (id) => {
    await api.delete(`Skill/${id}`, token).then(async () => {
      message.success("Skill deleted successfully");
      await fetchSkills();
    });
  };

  useEffect(() => {
    if (isLoading) return;
    fetchSkills();
    console.log("Company ID", companyId);
  }, [isLoading, studentId, companyId]);

  return (
    (skillSetOne.length > 0 || skillSetTwo.length > 0 || editable === true) && (
      <>
        {editable && isCreateModalVisible && (
          <CreateFormModal
            open={isCreateModalVisible}
            onCancel={() => setIsCreateModalVisible(false)}
            title={"Add a Skill"}
            onCreate={onAddSkill}
          >
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  Name
                </span>
              }
              name={"name"}
              rules={[{ required: true, message: "Please input a name!" }]}
            >
              <Input className="font-default font-normal text-dark-dark-blue" />
            </Form.Item>
          </CreateFormModal>
        )}

        <div className="bg-white shadow rounded-md p-4 font-default">
          <div className="flex justify-between">
            <h5 className="font-bold text-base">{title}</h5>{" "}
            {editable && (
              <PlusOutlined
                onClick={() => setIsCreateModalVisible(true)}
                className=" hover:cursor-pointer hover:text-light-blue"
              />
            )}
          </div>

          <div className="justify-between mt-2">
            <Row gutter={4}>
              <Col span={12}>
                <ul className="font-default font-semibold list-disc ps-4 w-full pe-3">
                  {skillSetOne.map((skill) => (
                    <ProfileSkillItem
                      key={skill.id}
                      id={skill.id}
                      name={skill.name}
                      onDelete={onDeleteSkill}
                      editable={editable}
                    />
                  ))}
                </ul>
              </Col>
              <Col span={12}>
                <ul className="font-default font-semibold list-disc ps-4 w-full pe-3">
                  {skillSetTwo.map((skill) => (
                    <ProfileSkillItem
                      key={skill.id}
                      id={skill.id}
                      name={skill.name}
                      onDelete={onDeleteSkill}
                      editable={editable}
                    />
                  ))}
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  );
};

export default ProfileSkills;
