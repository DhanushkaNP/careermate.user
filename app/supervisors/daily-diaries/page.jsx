"use client";

import SupervisorInternDailyDiarySummary from "@/Components/DailyDiary/SupervisorInternDailyDiarySummary";
import SupervisorInternDailyDiarySummaryHeading from "@/Components/DailyDiary/SupervisorInternDailyDiarySummaryHeading";
import api from "@/utils/api";
import { useUserToken } from "@/utils/Auth/auth-selectors";
import { useSupervisorId } from "@/utils/supervisor/supervisor-selectors";
import { Input } from "antd";
import React, { useEffect, useState } from "react";

const SuperivsorDailyDiaries = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [diaries, setDiaries] = useState([]);

  const token = useUserToken();
  const supervisorId = useSupervisorId();

  const fetchDiaries = async () => {
    try {
      await api
        .get(
          `Supervisors/${supervisorId}/DailyDiary/SupervisorApprovalRequested`,
          { search: searchKeyword },
          token
        )
        .then((response) => {
          console.log(response);
          setDiaries(response.items);
        });
    } catch (error) {
      setDiaries([]);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, [searchKeyword]);

  return (
    <div>
      <div className="flex justify-end">
        <Input.Search
          placeholder={"Search by intern name"}
          enterButton="Search"
          className="shadow-sm flex-initial font-semibold w-96"
          size="large"
          style={{ borderRadius: "0px !important" }}
          onSearch={(value) => setSearchKeyword(value)}
        />
      </div>

      <div className="mt-4">
        <SupervisorInternDailyDiarySummaryHeading />

        <div className="mt-2">
          {diaries.map((d) => (
            <SupervisorInternDailyDiarySummary
              id={d.id}
              key={d.id}
              internName={d.studentName}
              week={d.weekNumber}
              dateSubmitted={d.dateSubmittedForSupervisorApproval}
              internshipName={d.internshipName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperivsorDailyDiaries;
