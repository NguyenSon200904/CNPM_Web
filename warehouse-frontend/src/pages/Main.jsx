import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Products from "../pages/Products"; // Import trang sản phẩm
import Supplier from "../pages/Suppliers"; // Import file Supplier
import ImportGoods from "../pages/ImportGoods";
import ImportReceipts from "../pages/ImportReceipts";
import ExportGoods from "../pages/ExportGoods";
import ExportReceipts from "../pages/ExportReceipts";
// import Inventory from "../pages/Inventory";
// import Accounts from "../pages/Accounts";
// import Statistics from "../pages/Statistics";

const Main = () => {
  const [selectedPage, setSelectedPage] = useState(""); // Ban đầu không chọn gì

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar setSelectedPage={setSelectedPage} />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 overflow-hidden p-4">
        {selectedPage === "" && (
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold">
              Chào mừng đến với hệ thống quản lý kho
            </h1>
            <p className="text-lg text-gray-600">
              Chọn một mục từ thanh điều hướng để bắt đầu
            </p>
          </div>
        )}
        {selectedPage === "SẢN PHẨM" && <Products />}
        {selectedPage === "NHÀ CUNG CẤP" && <Supplier />}
        {selectedPage === "NHẬP HÀNG" && <ImportGoods />}
        {selectedPage === "PHIẾU NHẬP" && <ImportReceipts />}
        {selectedPage === "XUẤT HÀNG" && <ExportGoods />}
        {selectedPage === "PHIẾU XUẤT" && <ExportReceipts />}
        {/* {selectedPage === "TỒN KHO" && <Inventory />}
        {selectedPage === "TÀI KHOẢN" && <Accounts />}
        {selectedPage === "THỐNG KÊ" && <Statistics />} */}
        {/* Thêm các trang khác tương tự khi cần */}
      </div>
    </div>
  );
};

export default Main;
