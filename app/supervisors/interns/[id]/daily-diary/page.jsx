"use client";

import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import { useIsLoading, useUserToken } from "@/utils/Auth/auth-selectors";
import SupervisorInternDailyDiarySummary from "@/Components/DailyDiary/SupervisorInternDailyDiarySummary";
import SupervisorInternDailyDiarySummaryHeading from "@/Components/DailyDiary/SupervisorInternDailyDiarySummaryHeading";

const SupervisorInternDailyDiary = () => {
  const token = useUserToken();
  const isLoading = useIsLoading();

  const [dailyDiaries, setDailyDiaries] = useState([]);

  const { id: studentId } = useParams();

  const fetchDailyDiary = async () => {
    await api
      .get(`Students/${studentId}/DailyDiary/Supervisor/List`, {}, token)
      .then((response) => {
        console.log(response);
        setDailyDiaries(response.items);
      });
  };

  useEffect(() => {
    if (isLoading) return;
    fetchDailyDiary();
  }, [studentId, isLoading]);

  return (
    <div>
      <SupervisorInternDailyDiarySummaryHeading />

      <div className="mt-2">
        {dailyDiaries.map((d) => (
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
  );
};

export default SupervisorInternDailyDiary;
