"use client";

import {
  useIsAuth,
  useIsStudent,
  useIsLoading,
  useAvatarUrl,
} from "@/utils/Auth/auth-selectors";
import { Menu, Avatar } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TbBriefcase2Filled } from "react-icons/tb";
import { BsBuildings } from "react-icons/bs";
import { BiSolidBookBookmark } from "react-icons/bi";
import Link from "next/link";
import { useStudentFullName } from "@/utils/student/student-selectors";
import { UserOutlined } from "@ant-design/icons";
import { useLogout } from "@/utils/Auth/auth-actions";

const mapPathToKey = (path) => {
  switch (path) {
    case "/students/internships":
      return "1.1";
    case "/students/internships/create-post":
      return "1.2";
    case "/test2":
      return "1.3";
    case "/students/internships/my-posts":
      return "1.4";
    case "/students/companies":
      return "2";
    case "/students/daily-diary":
      return "3";
    case "/students/profile":
      return "4.1";
    default:
      return "1.1";
  }
};

const StudentLayout = ({ children }) => {
  const router = useRouter();
  const isLoading = useIsLoading();
  const isAuth = useIsAuth();
  const isStudent = useIsStudent();
  const studentName = useStudentFullName();
  const studentAvatar = useAvatarUrl();
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
    if (e.key === "title" || e.key === "4.1" || e.key === "4.2") return;
    setCurrentKey([e.key]);
    localStorage.setItem("selectedMenuKey", e.key);
  };

  useEffect(() => {
    if (!isLoading && (!isAuth || !isStudent)) {
      router.push("/auth/students/signin");
    }
  }, [isAuth, isStudent, isLoading, router]);

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
      disabled: true,
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
              href="/students/internships"
              className="font-default text-dark-gray"
            >
              Find an internship
            </Link>
          ),
        },
        {
          key: "1.2",
          label: (
            <Link
              href="/students/internships/create-post"
              className="font-default"
            >
              Post internships
            </Link>
          ),
        },
        {
          key: "1.3",
          label: (
            <Link href="/students/internship-offers" className="font-default">
              Internship offers
            </Link>
          ),
        },
        {
          key: "1.4",
          label: (
            <Link
              href="/students/internships/my-posts"
              className="font-default"
            >
              My posts
            </Link>
          ),
        },
      ],
    },
    {
      key: "2",
      icon: (
        <BsBuildings
          size={20}
          className={
            currentKey.includes("2") ? "fill-light-blue" : "fill-dark-gray"
          }
        />
      ),
      label: <Link href="/students/companies">Find Companies</Link>,
    },
    {
      key: "3",
      icon: (
        <BiSolidBookBookmark
          size={24}
          className={
            currentKey.includes("3") ? "fill-light-blue" : "fill-dark-gray"
          }
        />
      ),
      label: <Link href="/students/daily-diary">Daily diary</Link>,
    },
    {
      key: "4",
      style: { marginLeft: "auto" },
      className: "!me-14",
      label: (
        <h5 className="text-base">
          <Avatar
            icon={!studentAvatar && <UserOutlined />}
            src={studentAvatar}
          />
          <span className="ms-2">{studentName}</span>
        </h5>
      ),
      children: [
        {
          key: "4.1",
          label: (
            <Link href="/students/profile" className="font-default">
              Profile
            </Link>
          ),
        },
        {
          key: "4.2",
          label: (
            <h5
              className="font-default"
              onClick={() => {
                signout();
                router.push("/auth/students/signin");
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
      <div className="mx-44 h-full pt-16">{children}</div>
    </div>
  );
};

export default StudentLayout;
