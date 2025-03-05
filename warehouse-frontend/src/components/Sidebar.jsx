const Sidebar = ({ setSelectedPage }) => {
  const menuItems = [
    "SẢN PHẨM",
    "NHÀ CUNG CẤP",
    "NHẬP HÀNG",
    "PHIẾU NHẬP",
    "XUẤT HÀNG",
    "PHIẾU XUẤT",
    "TỒN KHO",
    "TÀI KHOẢN",
    "THỐNG KÊ",
    "ĐỔI THÔNG TIN",
    "ĐĂNG XUẤT",
  ];

  return (
    <div className="w-1/5 bg-green-600 text-white h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Quản lý kho</h1>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item}
            className="p-2 hover:bg-green-800 cursor-pointer"
            onClick={() => setSelectedPage(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
