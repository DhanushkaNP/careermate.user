import React from "react";
import { Pagination } from "antd";

const CustomPagination = ({ current, pageSize, total, onChange }) => {
  return (
    <div className="mt-auto flex justify-center py-4">
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false} // You can enable this if you want to change page size
      />
    </div>
  );
};

export default CustomPagination;
