"use client";

import {
  useIsAuth,
  useIsStudent,
  useIsLoading,
  useAvatarUrl,
  useIsSupervisor,
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
import { PiStudentFill } from "react-icons/pi";
import { useLogout } from "@/utils/Auth/auth-actions";
import { useSupervisorName } from "@/utils/supervisor/supervisor-selectors";

const mapPathToKey = (path) => {
  switch (path) {
    case "/supervisors/interns":
      return "1";
    case "/supervisors/interns":
      return "2";
    default:
      return "1";
  }
};

const SupervisorLayout = ({ children }) => {
  const router = useRouter();
  const isLoading = useIsLoading();
  const isAuth = useIsAuth();
  const isSupervisor = useIsSupervisor();
  const supervisorName = useSupervisorName();
  const companyAvatar = useAvatarUrl();
  const signout = useLogout();

  const [currentKey, setCurrentKey] = useState(() => {
    if (typeof window !== "undefined") {
      return [mapPathToKey(window.location.pathname)];
    }
    return ["1"]; // Default value for server render
  });

  useEffect(() => {
    const pathKey = mapPathToKey(window.location.pathname);
    setCurrentKey([pathKey]);
  }, []);

  const onClick = (e) => {
    if (e.key === "title") return;
    setCurrentKey([e.key]);
    localStorage.setItem("selectedMenuKey", e.key);
  };

  useEffect(() => {
    if (!isLoading && (!isAuth || !isSupervisor)) {
      router.push("/auth/supervisors/signin");
    }
  }, [isAuth, isSupervisor, isLoading, router]);

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
      label: <Link href="/supervisors/interns">Interns</Link>,
      icon: (
        <PiStudentFill
          size={26}
          className={
            currentKey.includes("1") ? "fill-light-blue" : "fill-dark-gray"
          }
        />
      ),
    },
    {
      key: "2",
      label: <Link href="/supervisors/daily-diaries">Daily-Diaries</Link>,
      icon: (
        <BiSolidBookBookmark
          size={24}
          className={
            currentKey.includes("2") ? "fill-light-blue" : "fill-dark-gray"
          }
        />
      ),
    },
    {
      key: "3",
      style: { marginLeft: "auto" },
      className: "!me-14",
      label: (
        <h5 className="text-base">
          <Avatar
            icon={!companyAvatar && <UserOutlined />}
            src={companyAvatar}
          />
          <span className="ms-2 text-sm">{supervisorName}</span>
        </h5>
      ),
      children: [
        {
          key: "3.1",
          label: (
            <h5
              className="font-default"
              onClick={() => {
                signout();
                router.push("/auth/supervisors/signin");
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
      <div className="mx-44 h-full pt-6">{children}</div>
    </div>
  );
};

export default SupervisorLayout;
