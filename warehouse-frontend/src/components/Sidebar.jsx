import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import LogoutModal from "../pages/LogoutModal";
import "../assets/Sidebar.css";
import {
  Menu,
  Package,
  Truck,
  Users,
  FileText,
  BarChart,
  Settings,
  LogOut,
  FileInput,
  FileOutput,
  ChartPie,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // Lưu vai trò của người dùng
  const [loading, setLoading] = useState(true); // Trạng thái tải thông tin người dùng
  const location = useLocation();

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        window.location.href = "/login"; // Chuyển hướng về login nếu không có token
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRole(response.data.role); // Lưu vai trò của người dùng
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Định nghĩa quyền truy cập cho từng vai trò
  const importerAllowedPaths = [
    "/san-pham",
    "/nha-cung-cap",
    "/nhap-hang",
    "/phieu-nhap",
  ];

  const exporterAllowedPaths = [
    "/san-pham",
    "/nha-cung-cap",
    "/xuat-hang",
    "/phieu-xuat",
  ];

  const _adminManagerOnlyPaths = [
    "/tai-khoan",
    "/ton-kho",
    "/thong-ke",
  ];

  // Kiểm tra xem một đường dẫn có được phép truy cập hay không
  const isPathAllowed = (path) => {
    // Trang "/doi-thong-tin" luôn được phép truy cập
    if (path === "/doi-thong-tin") {
      return true;
    }

    if (!userRole) return false; // Nếu chưa có vai trò, vô hiệu hóa tất cả

    if (userRole === "Admin" || userRole === "Manager") {
      return true; // Admin và Manager có thể truy cập tất cả
    }

    if (userRole === "Importer") {
      return importerAllowedPaths.includes(path);
    }

    if (userRole === "Exporter") {
      return exporterAllowedPaths.includes(path);
    }

    return false; // Vai trò không hợp lệ
  };

  const menuItems = [
    { path: "/san-pham", name: "SẢN PHẨM", icon: <Package size={24} /> },
    { path: "/nha-cung-cap", name: "NHÀ CUNG CẤP", icon: <Truck size={24} /> },
    { path: "/nhap-hang", name: "NHẬP HÀNG", icon: <FileInput size={24} /> },
    { path: "/phieu-nhap", name: "PHIẾU NHẬP", icon: <FileText size={24} /> },
    { path: "/xuat-hang", name: "XUẤT HÀNG", icon: <FileOutput size={24} /> },
    { path: "/phieu-xuat", name: "PHIẾU XUẤT", icon: <FileText size={24} /> },
    { path: "/ton-kho", name: "TỒN KHO", icon: <BarChart size={24} /> },
    { path: "/tai-khoan", name: "TÀI KHOẢN", icon: <Users size={24} /> },
    { path: "/thong-ke", name: "THỐNG KẾ", icon: <ChartPie size={24} /> },
  ];

  const accountItems = [
    {
      path: "/doi-thong-tin",
      name: "ĐỔI THÔNG TIN",
      icon: <Settings size={24} />,
    },
  ];

  // Cập nhật tiêu đề dựa trên route
  useEffect(() => {
    const currentMenuItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    const currentAccountItem = accountItems.find(
      (item) => item.path === location.pathname
    );
    document.title = currentMenuItem
      ? currentMenuItem.name
      : currentAccountItem
      ? currentAccountItem.name
      : "Quản lý kho";
  }, [location.pathname]);

  if (loading) {
    return <div className="h-screen bg-green-600 text-white p-4">Đang tải...</div>;
  }

  return (
    <div
      className={`h-screen bg-green-600 text-white transition-all duration-300 ${
        isOpen ? "w-1/5" : "w-15"
      } flex flex-col`}
    >
      {/* Header với nút toggle */}
      <div
        className={`flex items-center p-2 ${
          isOpen ? "justify-start" : "justify-center"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="toggle-button text-white mr-2 focus:outline-none"
        >
          <Menu size={24} className="custom-menu-icon" color="white" />
        </button>
        {isOpen && <h1 className="text-xl font-bold">Quản lý kho</h1>}
      </div>

      {/* Menu Items */}
      <ul className="mt-2 flex-1">
        {menuItems.map((item) => {
          const isAllowed = isPathAllowed(item.path);
          return (
            <li key={item.name} className="mt-1.5">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block p-3 flex items-center gap-3 rounded-md font-bold cursor-pointer text-white ${
                    isActive ? "bg-green-800" : "hover:bg-green-800"
                  } ${isOpen ? "justify-start" : "justify-center p-2"} ${
                    !isAllowed ? "opacity-50 pointer-events-none" : ""
                  }`
                }
              >
                {React.cloneElement(item.icon, { color: "white" })}
                {isOpen && (
                  <span className="text-sm text-white">{item.name}</span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Đổi thông tin & Đăng xuất */}
      <div className="border-t border-green-400 pt-4 pb-4">
        <ul>
          <li>
            <NavLink
              to="/doi-thong-tin"
              className={({ isActive }) =>
                `block p-3 flex items-center gap-3 rounded-md font-bold cursor-pointer text-white ${
                  isActive ? "bg-green-800" : "hover:bg-green-800"
                } ${isOpen ? "justify-start" : "justify-center p-2"}`
              }
            >
              {React.cloneElement(<Settings size={24} />, { color: "white" })}
              {isOpen && (
                <span className="text-sm text-white">ĐỔI THÔNG TIN</span>
              )}
            </NavLink>
          </li>
          <li
            className={`p-3 flex items-center gap-3 rounded-md hover:bg-red-700 cursor-pointer font-bold ${
              isOpen ? "justify-start" : "justify-center p-2"
            }`}
            onClick={() => setIsLogoutModalOpen(true)}
          >
            {React.cloneElement(<LogOut size={24} />, { color: "white" })}
            {isOpen && <span className="text-sm text-white">ĐĂNG XUẤT</span>}
          </li>
        </ul>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalVisible}
        onConfirm={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;