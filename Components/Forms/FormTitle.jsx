import React from "react";

const FormTitle = ({ title, subTitle, description, titleStyle, className }) => {
  return (
    <div className={`${className}`}>
      <div>
        <h3
          className={`text-dark-blue font-bold text-2xl font-default ${titleStyle}`}
        >
          {title}{" "}
          {subTitle && (
            <span className=" text-light-gray text-lg font-medium">
              - {subTitle}
            </span>
          )}
        </h3>
        <div className=" text-light-gray mb-2">{description}</div>
      </div>
    </div>
  );
};

export default FormTitle;
