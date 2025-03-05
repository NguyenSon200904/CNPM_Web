import { useState } from "react";
import Sidebar from "../components/Sidebar";

const Main = () => {
  const [selectedPage, setSelectedPage] = useState("SẢN PHẨM");

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar setSelectedPage={setSelectedPage} />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 overflow-hidden">
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold p-4 bg-white shadow-sm">
            {selectedPage}
          </h2>
          <div className="flex-1 p-4 overflow-hidden">
            {selectedPage === "SẢN PHẨM" && <p>Danh sách sản phẩm</p>}
            {selectedPage === "NHÀ CUNG CẤP" && <p>Danh sách nhà cung cấp</p>}
            {selectedPage === "NHẬP HÀNG" && <p>Nhập hàng</p>}
            {selectedPage === "PHIẾU NHẬP" && <p>Danh sách phiếu nhập</p>}
            {selectedPage === "XUẤT HÀNG" && <p>Xuất hàng</p>}
            {selectedPage === "PHIẾU XUẤT" && <p>Danh sách phiếu xuất</p>}
            {selectedPage === "TỒN KHO" && <p>Thông tin tồn kho</p>}
            {selectedPage === "TÀI KHOẢN" && <p>Quản lý tài khoản</p>}
            {selectedPage === "THỐNG KÊ" && <p>Thống kê dữ liệu</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
