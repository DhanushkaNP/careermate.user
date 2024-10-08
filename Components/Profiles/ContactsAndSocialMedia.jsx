"use client";

import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import CreateFormModal from "../Forms/CreateFormModal";
import Form from "antd/es/form/Form";
import { Select, Input, message } from "antd";
import { useIsLoading, useUserToken } from "@/utils/Auth/auth-selectors";
import api from "@/utils/api";
import ContactAndSocialMediaItem from "./ContactAndSocialMediaItem";
import { StudentContactTypes } from "@/shared/studentContactTypes";
import { CompanyContactTypes } from "@/shared/companyContactType";

const ContactsAndSocialMedia = ({ editable, studentId, companyId }) => {
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [contacts, setContacts] = useState([]);

  const [contactTypes, setContactTypes] = useState(StudentContactTypes);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const fetchContacts = async () => {
    if (studentId) {
      await api
        .get(`Students/${studentId}/Contact`, null, token)
        .then((response) => {
          setContacts(response.items);
        });
    } else if (companyId) {
      await api
        .get(`Companies/${companyId}/Contact`, null, token)
        .then((response) => {
          setContacts(response.items);
        });
    }
  };
  const onAddContact = async (values) => {
    if (studentId) {
      await api
        .post(
          `Students/${studentId}/Contact`,
          {
            data: values.data,
            contactType: parseInt(values.type),
          },
          token
        )
        .then(() => {
          message.success("Contact added successfully");
          fetchContacts();
          setIsCreateModalVisible(false);
        });
    } else if (companyId) {
      await api
        .post(
          `Companies/${companyId}/Contact`,
          {
            data: values.data,
            contactType: parseInt(values.type),
          },
          token
        )
        .then(() => {
          message.success("Contact added successfully");
          fetchContacts();
          setIsCreateModalVisible(false);
        });
    }
  };

  const onDeleteContact = async (id) => {
    await api.delete(`Contact/${id}`, token).then(async () => {
      message.success("Skill deleted successfully");
      fetchContacts();
    });
  };

  useEffect(() => {
    if (studentId) {
      setContactTypes(StudentContactTypes);
    } else if (companyId) {
      setContactTypes(CompanyContactTypes);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    fetchContacts();
  }, [isLoading, studentId]);

  return (
    (contacts.length > 0 || editable === true) && (
      <>
        {editable && isCreateModalVisible && (
          <CreateFormModal
            open={isCreateModalVisible}
            onCancel={() => setIsCreateModalVisible(false)}
            title={"Add Contacts and Social Media"}
            onCreate={onAddContact}
          >
            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  Type
                </span>
              }
              name={"type"}
              rules={[
                { required: true, message: "Please select a employment type!" },
              ]}
            >
              <Select placeholder="Linkedin" notFoundContent={null} allowClear>
                {Object.entries(contactTypes).map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <span className="font-default text-dark-dark-blue font-bold">
                  Contact / Link
                </span>
              }
              name={"data"}
              rules={[
                { required: true, message: "Please input a contact or link!" },
              ]}
            >
              <Input
                className="font-default font-normal text-dark-dark-blue"
                placeholder="011 - 1223328  |  https://www.linkedin.com/in/someone/"
              />
            </Form.Item>
          </CreateFormModal>
        )}

        <div className="bg-white shadow rounded-md p-4 font-default mt-2 ">
          <div className=" flex justify-between">
            <h5 className="font-bold text-base mb-2">
              Contacts & Social media
            </h5>{" "}
            {editable && (
              <PlusOutlined
                className=" hover:cursor-pointer hover:text-light-blue text-lg"
                onClick={() => {
                  setIsCreateModalVisible(true);
                }}
              />
            )}
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {contacts.map((item) => (
              <ContactAndSocialMediaItem
                key={item.id}
                id={item.id}
                type={item.type}
                value={item.data}
                onDelete={onDeleteContact}
                editable={editable}
              />
            ))}
          </div>
        </div>
      </>
    )
  );
};

export default ContactsAndSocialMedia;
