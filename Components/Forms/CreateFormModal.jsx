"use client";

import React, { useState } from "react";
import { Form, Modal, Alert, Button } from "antd";
import FormTitle from "./FormTitle";
import { getErrorMessage } from "@/utils/error-util";

const CreateFormModal = ({
  open,
  onCancel,
  onCreate,
  title,
  width,
  children,
  buttonTitle = "Add",
}) => {
  const [form] = Form.useForm();
  const [error, setError] = useState();

  const handlSubmit = async () => {
    form.validateFields().then(async (values) => {
      try {
        await onCreate(values);
        setError(null);
        form.resetFields();
      } catch (err) {
        console.log(err);
        const errorMessage = getErrorMessage(err);
        console.log(errorMessage);
        setError(errorMessage.message);
        console.log(error.message);
        return;
      }
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      className="w-fit"
      width={width}
      onOk={handlSubmit}
      closeIcon={false}
      footer={[
        <Button key={buttonTitle} type="primary" onClick={handlSubmit}>
          {buttonTitle}
        </Button>,
        <Button key="cancel" onClick={() => onCancel()}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        layout="vertical"
        form={form}
      >
        <FormTitle title={title} />
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            className="mb-4"
          />
        )}
        {children}
      </Form>
    </Modal>
  );
};

export default CreateFormModal;
