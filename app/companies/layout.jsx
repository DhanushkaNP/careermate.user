"use client";

import {
  useIsAuth,
  useIsLoading,
  useAvatarUrl,
  useIsCompany,
} from "@/utils/Auth/auth-selectors";
import { Menu, Avatar } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TbBriefcase2Filled } from "react-icons/tb";
import { BiSolidBookBookmark } from "react-icons/bi";
import { PiStudentFill } from "react-icons/pi";
import { MdSupervisorAccount } from "react-icons/md";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import { useLogout } from "@/utils/Auth/auth-actions";
import { useCompanyName } from "@/utils/company/company-selectors";

const mapPathToKey = (path) => {
  switch (path) {
    case "/companies/internships/our-posts":
      return "1.1";
    case "/companies/internships/create-post":
      return "1.2";
    case "/companies/students":
      return "2.1";
    case "/companies/applicants":
      return "2.2";
    case "/companies/interns":
      return "2.3";
    case "/companies/daily-diaries":
      return "3";
    case "/companies/supervisors/create":
      return "4.1";
    case "/companies/supervisors":
      return "4.2";
    default:
      return "1.1";
  }
};

const CompanyLayout = ({ children }) => {
  const router = useRouter();
  const isLoading = useIsLoading();
  const isAuth = useIsAuth();
  const isCompany = useIsCompany();
  const companyName = useCompanyName();
  const companyAvatar = useAvatarUrl();
  const signout = useLogout();

  const [currentKey, setCurrentKey] = useState(() => {
    if (typeof window !== "undefined") {
      return [mapPathToKey(window.location.pathname)];
    }
    return ["1.1"]; // Default value for server render
  });

  useEffect(() => {
    const pathKey = mapPathToKey(window.location.pathname);
    setCurrentKey([pathKey]);
  }, []);

  const onClick = (e) => {
    if (e.key === "title" || e.key === "5.1" || e.key === "5.2") return;
    setCurrentKey([e.key]);
  };

  useEffect(() => {
    if (!isLoading && (!isAuth || !isCompany)) {
      router.push("/auth/companies/signin");
    }
  }, [isAuth, isCompany, isLoading, router]);

  const menuItems = [
    {
      key: "title",
      label: (
        <div>
          <h1 className="font-inika text-dark-blue hover:text-dark-blue font-bold text-xl ms-10">
            CareerMate
          </h1>
        </div>
      ),
    },
    {
      key: "1",
      label: "Internships",
      icon: (
        <TbBriefcase2Filled
          size={24}
          className={
            currentKey.some((key) => key.startsWith("1."))
              ? "fill-light-blue"
              : "fill-dark-gray"
          }
        />
      ),
      children: [
        {
          key: "1.1",
          label: (
            <Link
              href="/companies/internships/our-posts"
              className="font-default text-dark-gray"
            >
              Our posts
            </Link>
          ),
        },
        {
          key: "1.2",
          label: (
            <Link
              href="/companies/internships/create-post"
              className="font-default"
            >
              Create post
            </Link>
          ),
        },
      ],
    },
    {
      key: "2",
      label: "Students",
      icon: (
        <PiStudentFill
          size={26}
          className={
            currentKey.some((key) => key.startsWith("2."))
              ? "fill-light-blue"
              : "fill-dark-gray"
          }
        />
      ),
      children: [
        {
          key: "2.1",
          label: (
            <Link
              href="/companies/students"
              className="font-default text-dark-gray"
            >
              Students
            </Link>
          ),
        },
        {
          key: "2.2",
          label: (
            <Link
              href="/companies/applicants"
              className="font-default text-dark-gray"
            >
              Applicants
            </Link>
          ),
        },
        {
          key: "2.3",
          label: (
            <Link
              href="/companies/interns"
              className="font-default text-dark-gray"
            >
              Interns
            </Link>
          ),
        },
      ],
    },
    // {
    //   key: "3",
    //   label: <Link href="/companies/daily-diaries">Daily diary</Link>,
    //   icon: (
    //     <BiSolidBookBookmark
    //       size={24}
    //       className={
    //         currentKey.some((key) => key.startsWith("3."))
    //           ? "fill-light-blue"
    //           : "fill-dark-gray"
    //       }
    //     />
    //   ),
    // },
    {
      key: "4",
      label: "Supervisors",
      icon: (
        <MdSupervisorAccount
          size={30}
          className={
            currentKey.some((key) => key.startsWith("4."))
              ? "fill-light-blue"
              : "fill-dark-gray"
          }
        />
      ),
      children: [
        {
          key: "4.1",
          label: (
            <Link
              href="/companies/supervisors/create"
              className="font-default text-dark-gray"
            >
              Create
            </Link>
          ),
        },
        {
          key: "4.2",
          label: (
            <Link href="/companies/supervisors" className="font-default">
              Supervisors
            </Link>
          ),
        },
      ],
    },
    {
      key: "5",
      label: (
        <div className="flex items-center">
          <Avatar
            icon={!companyAvatar && <UserOutlined />}
            src={companyAvatar}
          />
          <h5 className="ms-2">{companyName}</h5>
        </div>
      ),
      style: { marginLeft: "auto" },
      className: "!me-14",
      children: [
        {
          key: "5.1",
          label: (
            <Link href="/companies/profile" className="font-default">
              Profile
            </Link>
          ),
        },
        {
          key: "5.2",
          label: (
            <h5
              className="font-default"
              onClick={() => {
                signout();
                router.push("/auth/companies/signin");
              }}
            >
              Signout
            </h5>
          ),
        },
      ],
    },
  ];

  return (
    <div>
      <Menu
        selectedKeys={currentKey}
        onClick={onClick}
        mode="horizontal"
        className="font-default fixed-top-menu w-full shadow-sm z-10"
        items={menuItems}
      />
      <div className="mx-44 h-full">{children}</div>
    </div>
  );
};

export default CompanyLayout;
