import React from "react";

const layout = ({ children }) => {
  return (
    <div className="bg-supervisor-image bg-cover  bg-no-repeat h-screen">
      <div className="h-full flex items-center">
        <div className="ms-64 me-32">
          <h1 className="bg-white w-min font-inika text-5xl font-bold text-dark-blue p-2 opacity-90">
            CareerMate
          </h1>
          <p className="bg-white w-[480px] text-lg p-2 font-semibold opacity-90">
            CareerMate ease your management works, it helps you to manage your
            interns
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default layout;
