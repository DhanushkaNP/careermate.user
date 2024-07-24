"use client";

import React, { useEffect, useState } from "react";

const StatusIndicator = ({ name, color }) => {
  const [borderColor, setBorderColor] = useState("!border-light-blue");
  const [nameColor, setNameColor] = useState("!text-light-blue");

  useEffect(() => {
    if (color == "blue") {
      setBorderColor("!border-light-blue");
      setNameColor("!text-light-blue");
    } else if (color === "red") {
      setBorderColor("!border-red");
      setNameColor("!text-red");
    } else if (color === "green") {
      setBorderColor("!border-green");
      setNameColor("!text-green");
    }
  }, [color]);

  return (
    <div
      className={`border-2 rounded-2xl text-center w-fit px-2 py-0 h-fit ${borderColor}`}
    >
      <span className={`font-semibold !text-sm ${nameColor}`}>{name}</span>
    </div>
  );
};

export default StatusIndicator;
