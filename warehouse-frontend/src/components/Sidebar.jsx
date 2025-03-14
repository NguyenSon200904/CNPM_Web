import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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

  // Cập nhật tiêu đề dựa trên route
  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    document.title = currentItem ? currentItem.name : "Quản lý kho";
  }, [location.pathname]);

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
          className="toggle-button text-white mr-2 focus:outline-none" // Thêm class toggle-button
        >
          <Menu size={24} className="custom-menu-icon" color="white" />
        </button>
        {isOpen && <h1 className="text-xl font-bold">Quản lý kho</h1>}
      </div>

      {/* Menu Items */}
      <ul className="mt-2 flex-1">
        {menuItems.map((item) => (
          <li key={item.name} className="mt-1.5">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block p-3 flex items-center gap-3 rounded-md font-bold cursor-pointer text-white ${
                  isActive ? "bg-green-800" : "hover:bg-green-800"
                } ${isOpen ? "justify-start" : "justify-center p-2"}`
              }
            >
              {React.cloneElement(item.icon, { color: "white" })}
              {isOpen && (
                <span className="text-sm text-white">{item.name}</span>
              )}
            </NavLink>
          </li>
        ))}
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
            onClick={() => setIsLogoutModalVisible(true)}
          >
            {React.cloneElement(<LogOut size={24} />, { color: "white" })}
            {isOpen && <span className="text-sm text-white">ĐĂNG XUẤT</span>}
          </li>
        </ul>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isVisible={isLogoutModalVisible}
        onConfirm={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        onCancel={() => setIsLogoutModalVisible(false)}
      />
    </div>
  );
};

export default Sidebar;
