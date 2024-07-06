"use client";

import {
  useIsAuth,
  useIsStudent,
  useIsLoading,
  useAvatarUrl,
} from "@/utils/Auth/auth-selectors";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TbBriefcase2Filled } from "react-icons/tb";
import { BsBuildings } from "react-icons/bs";
import { BiSolidBookBookmark } from "react-icons/bi";
import Link from "next/link";
import { useStudentFullName } from "@/utils/student/student-selectors";
import Avatar from "antd/es/avatar/avatar";
import { UserOutlined } from "@ant-design/icons";
import { useLogout } from "@/utils/Auth/auth-actions";

const StudentLayout = ({ children }) => {
  const router = useRouter();
  const isLoading = useIsLoading();
  const isAuth = useIsAuth();
  const isStudent = useIsStudent();
  const studentName = useStudentFullName();
  const studentAvatar = useAvatarUrl();
  const signout = useLogout();

  const [currentKey, setCurrentKey] = useState(["1.1"]);

  useEffect(() => {
    const storedKey = localStorage.getItem("selectedMenuKey");
    if (storedKey) {
      setCurrentKey([storedKey]);
    }
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

  return (
    <div>
      <Menu
        defaultSelectedKeys={currentKey}
        onClick={onClick}
        selectedKeys={currentKey}
        mode="horizontal"
        className="font-default fixed w-full"
      >
        <Menu.Item key="title" disabled>
          <div>
            <h1 className="font-inika text-dark-blue hover:text-dark-blue font-bold text-xl ms-10">
              CareerMate
            </h1>
          </div>
        </Menu.Item>
        <Menu.SubMenu
          key="1"
          title="Internships"
          icon={
            <TbBriefcase2Filled
              size={24}
              className={
                currentKey.some((key) => key.startsWith("1."))
                  ? "fill-light-blue"
                  : "fill-dark-gray"
              }
            />
          }
        >
          <Menu.Item key="1.1">
            <Link href={"internships"} className="font-default text-dark-gray">
              Find an internship
            </Link>
          </Menu.Item>
          <Menu.Item key="1.2">
            <Link href={"test1"} className="font-default">
              Post internships
            </Link>
          </Menu.Item>
          <Menu.Item key="1.3">
            <Link href={"test2"} className="font-default">
              Recruitation Invites
            </Link>
          </Menu.Item>
          <Menu.Item key="1.4">
            <Link href={"test3"} className="font-default">
              My posts
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key="2"
          icon={
            <BsBuildings
              size={20}
              className={
                currentKey.includes("2") ? "fill-light-blue" : "fill-dark-gray"
              }
            />
          }
        >
          <Link href={"companies"}>Find Companies</Link>
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={
            <BiSolidBookBookmark
              size={24}
              className={
                currentKey.includes("3") ? "fill-light-blue" : "fill-dark-gray"
              }
            />
          }
        >
          <Link href={"internships5"}>Daily diary</Link>
        </Menu.Item>
        <Menu.SubMenu
          key="4"
          style={{ marginLeft: "auto" }}
          className=" !me-14"
          title={
            <h5 className="ext-base">
              <Avatar
                icon={!studentAvatar && <UserOutlined />}
                src={studentAvatar}
              />
              <span className=" ms-2">{studentName}</span>
            </h5>
          }
        >
          <Menu.Item key="4.1">
            <Link href={"profile"} className="font-default">
              Profile
            </Link>
          </Menu.Item>
          <Menu.Item
            key="4.2"
            onClick={() => {
              signout();
              router.refresh();
            }}
          >
            <h5 className=" font-default">Signout</h5>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <div className="mx-44 h-full pt-24">{children}</div>
    </div>
  );
};

export default StudentLayout;
