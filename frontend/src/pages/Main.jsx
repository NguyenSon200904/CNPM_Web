import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import Sidebar from "../components/Sidebar";

const Main = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Xóa tất cả thông báo khi chuyển trang
    message.destroy();

    // Hiển thị thông báo chào mừng khi vào trang chính
    if (location.pathname === "/") {
      message.info("Chào mừng đến với hệ thống quản lý kho", {
        key: "welcome-message",
        duration: 2,
      });
    }
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 overflow-hidden p-4">
        {children || (
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold text-gray-800">
              Chào mừng đến với hệ thống quản lý kho
            </h1>
            <p className="text-lg text-gray-600">
              Chọn một mục từ thanh điều hướng để bắt đầu
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
