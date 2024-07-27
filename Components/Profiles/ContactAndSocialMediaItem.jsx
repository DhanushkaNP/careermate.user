import {
  DeleteOutlined,
  FacebookFilled,
  GithubFilled,
  GlobalOutlined,
  LinkedinFilled,
  MailFilled,
  MediumSquareFilled,
  PhoneFilled,
} from "@ant-design/icons";
import React from "react";

const ContactAndSocialMediaItem = ({ value, type, id, onDelete, editable }) => {
  const deleteContact = async () => {
    await onDelete(id);
  };

  let icon;

  switch (type) {
    case 0:
      icon = <MailFilled />;
      break;
    case 1:
      icon = <PhoneFilled />;
      break;

    case 2:
      icon = <LinkedinFilled />;
      break;
    case 3:
      icon = <FacebookFilled />;
      break;
    case 4:
      icon = <GithubFilled />;
      break;
    case 5:
      icon = <MediumSquareFilled />;
      break;
    case 6:
    case 7:
      icon = <GlobalOutlined />;

    default:
      icon = <GlobalOutlined />;
      break;
  }

  <MailFilled />;

  return (
    <div className="flex justify-between">
      <div className="px-2 border-2 border-light-blue flex gap-4 text-light-blue font-semibold w-fit rounded-lg">
        {icon}
        <p>{value}</p>
      </div>
      {editable && (
        <DeleteOutlined
          className=" hover:cursor-pointer hover:text-light-blue  text-light-gray"
          onClick={deleteContact}
          editable={editable}
        />
      )}
    </div>
  );
};

export default ContactAndSocialMediaItem;
