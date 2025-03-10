import { useState } from "react";
import {
  Menu,
  Package,
  Truck,
  Users,
  FileText,
  BarChart,
  Settings,
  LogOut,
  ArrowDownCircle,
  ArrowUpCircle,
  ChartPie,
} from "lucide-react";

const Sidebar = ({ setSelectedPage }) => {
  const [isOpen, setIsOpen] = useState(true); // State mở/đóng sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "SẢN PHẨM", icon: <Package size={24} /> },
    { name: "NHÀ CUNG CẤP", icon: <Truck size={24} /> },
    { name: "NHẬP HÀNG", icon: <ArrowDownCircle size={24} /> },
    { name: "PHIẾU NHẬP", icon: <FileText size={24} /> },
    { name: "XUẤT HÀNG", icon: <ArrowUpCircle size={24} /> },
    { name: "PHIẾU XUẤT", icon: <FileText size={24} /> },
    { name: "TỒN KHO", icon: <BarChart size={24} /> },
    { name: "TÀI KHOẢN", icon: <Users size={24} /> },
    { name: "THỐNG KÊ", icon: <ChartPie size={24} /> },
  ];

  return (
    <div
      className={`h-screen bg-green-600 text-white transition-all duration-300 ${
        isOpen ? "w-1/5" : "w-16"
      }`}
    >
      {/* Nút Toggle */}
      <div className="flex items-center p-4">
        <button onClick={toggleSidebar} className="text-white">
          <Menu size={24} />
        </button>
        {isOpen && <h1 className="text-xl font-bold ml-2">Quản lý kho</h1>}
      </div>

      {/* Menu Items */}
      <ul className="flex-1">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className="p-3 flex items-center gap-3 rounded-md hover:bg-green-800 cursor-pointer font-bold"
            onClick={() => setSelectedPage(item.name)}
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </li>
        ))}
      </ul>

      {/* Đổi thông tin & Đăng xuất */}
      <div className="mt-6 border-t border-green-400 pt-4">
        <ul>
          <li
            className="p-3 flex items-center gap-3 rounded-md hover:bg-green-800 cursor-pointer font-bold"
            onClick={() => setSelectedPage("ĐỔI THÔNG TIN")}
          >
            <Settings size={24} />
            {isOpen && <span>ĐỔI THÔNG TIN</span>}
          </li>
          <li
            className="p-3 flex items-center gap-3 rounded-md hover:bg-red-700 cursor-pointer font-bold"
            onClick={() => setSelectedPage("ĐĂNG XUẤT")}
          >
            <LogOut size={24} />
            {isOpen && <span>ĐĂNG XUẤT</span>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
