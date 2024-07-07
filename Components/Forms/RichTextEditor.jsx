import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // import styles

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RichTextEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const formats = ["bold", "italic", "underline", "list", "bullet"];

  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      theme="snow"
      className="custom-quill-editor !w-full h-72"
      style={{ fontFamily: "Montserrat" }}
    />
  );
};

export default RichTextEditor;
