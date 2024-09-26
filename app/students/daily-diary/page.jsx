"use client";

import DailyDiaryStudentSummary from "@/Components/DailyDiary/DailyDiraryStudentSummary";
import DailyDiaryStudentSummaryHeading from "@/Components/DailyDiary/DailyDiraryStudentSummaryHeading";
import api from "@/utils/api";
import {
  useIsLoading,
  useUserId,
  useUserToken,
} from "@/utils/Auth/auth-selectors";
import React, { useEffect, useState } from "react";

const StudentDailyDiary = () => {
  const token = useUserToken();
  const studentId = useUserId();
  const isLoading = useIsLoading();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [dailyDiaries, setDailyDiaries] = useState([]);

  const fetchDailyDiary = async () => {
    await api
      .get(`Students/${studentId}/DailyDiary`, { search: searchKeyword }, token)
      .then((response) => {
        console.log(response);
        setDailyDiaries(response.items);
      });
  };

  useEffect(() => {
    if (isLoading) return;
    fetchDailyDiary();
  }, [studentId, searchKeyword, isLoading]);

  return (
    <div className="h-full">
      <h2 className=" text-4xl font-bold text-dark-blue">
        Manage your <span className=" text-light-blue">Daily-diary</span> here
      </h2>
      {dailyDiaries.length == 0 && (
        <p className=" text-light-gray italic">
          No daily diary until you join a internship
        </p>
      )}
      {dailyDiaries.length > 0 && dailyDiaries.some((dd) => dd.isLocked) && (
        <p className=" text-light-gray italic mt-2">
          Weekly diaries will unlock when you are in right time period
        </p>
      )}
      <div className="mt-4">
        <DailyDiaryStudentSummaryHeading />
        <div className="mt-2">
          {dailyDiaries.map((dailyDiary) => (
            <DailyDiaryStudentSummary
              key={dailyDiary.id}
              id={dailyDiary.id}
              weekNumber={dailyDiary.weekNumber}
              from={dailyDiary.from}
              to={dailyDiary.to}
              dueDate={dailyDiary.dueDate}
              coordinatorApprovalStatus={dailyDiary.coordinatorApprovalStatus}
              supervisorApprovalStatus={dailyDiary.supervisorApprovalStatus}
              isLocked={dailyDiary.isLocked}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDailyDiary;
