"use client";

import FormContainer from "@/Components/Forms/FormContainer";
import FormTitle from "@/Components/Forms/FormTitle";
import { useLogIn } from "@/utils/Auth/auth-actions";
import { decodeToken } from "@/utils/Auth/auth-util";
import api from "@/utils/api";
import { getErrorMessage } from "@/utils/error-util";
import { companyLowProfilePicture } from "@/utils/firebase/FirebaseImageUrls";
import { useSetSupervisorData } from "@/utils/supervisor/supervisor-actions";
import { Alert, Button, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SupervisorSignIn = () => {
  const [form] = Form.useForm();
  const [error, SetError] = useState(null);
  const router = useRouter();

  const logIn = useLogIn();
  const setSupervisorData = useSetSupervisorData();

  const signSupervisor = async () => {
    form.validateFields().then(async (values) => {
      try {
        await api
          .post("Supervisor/Login", {
            email: values["personal-email"],
            password: values.password,
          })
          .then((response) => {
            const decodedToken = decodeToken(response.token);
            console.log(response);

            setSupervisorData(
              response.userId,
              response.companyId,
              `${response.firstName} ${response.lastName}`,
              response.facultyId
            );

            logIn(
              response.token,
              response.userId,
              decodedToken.exp,
              false,
              false,
              true,
              response.companyLogoFirebaseId
                ? companyLowProfilePicture(response.companyLogoFirebaseId)
                : null
            );

            message.success("Sign In successful!");
            router.push("/supervisors/interns");
          });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        SetError(errorMessage.message);
        return;
      }
    });
  };

  return (
    <FormContainer className={"w-full"}>
      <Form
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        form={form}
        className="bg-white p-4 rounded-md font-default px-6 max-w-md shadow-md min-w-96"
        layout="vertical"
        onFinish={signSupervisor}
      >
        <FormTitle
          description={"Enter your information to Sign in!"}
          title={"Sign In"}
          subTitle={"Supervisor"}
          className="mb-4"
        />

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-semibold">
              Personal Email
            </span>
          }
          name={"personal-email"}
          rules={[
            { required: true, message: "Please input your E-mail!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input
            className="font-default font-normal text-dark-dark-blue w-96"
            placeholder="johnsmith@email.com"
            allowClear
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-default text-dark-dark-blue font-semibold">
              Password
            </span>
          }
          name={"password"}
          rules={[
            { required: true, message: "Please input your Password!" },
            {
              validator: (_, value) => {
                if (value && value.length < 8) {
                  return Promise.reject(
                    "Password must include more than 8 characters!"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            className="font-default font-normal text-dark-dark-blue"
            autoComplete="password"
            placeholder={"Password"}
            size="large"
          />
        </Form.Item>

        {error && (
          <Alert
            message={error}
            type="error"
            closable
            className="mb-4 text-red max-w-96"
          />
        )}

        <Button
          htmlType="submit"
          type="primary"
          block
          className=" font-semibold tracking-wide"
        >
          Sign In
        </Button>

        <p className=" mt-4">
          Forgot password? <Link href={"/test"}>Click here</Link>
        </p>

        {/* <Divider plain className=" !font-default !my-2">
          or
        </Divider>

        <div className="flex justify-between mt-4">
          <Link
            href={"signup"}
            className="text-left w-full text-dark-blue block"
          >
            Sign Up
          </Link>
          <Link
            href={"/auth/companies/signin"}
            className="text-right w-full font-semibold text-dark-blue block"
          >
            Sign in as a company
          </Link>
        </div> */}
      </Form>
    </FormContainer>
  );
};

export default SupervisorSignIn;
