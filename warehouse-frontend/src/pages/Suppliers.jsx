import { useState } from "react";

const Supplier = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Tất cả");

  const handleSearch = () => {
    console.log("Tìm kiếm:", searchTerm, "- Tiêu chí:", filter);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý nhà cung cấp</h2>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập thông tin tìm kiếm..."
          className="border p-2 flex-1"
        />

        {/* Dropdown chọn tiêu chí lọc */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2"
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Mã nhà cung cấp">Mã nhà cung cấp</option>
          <option value="Tên nhà cung cấp">Tên nhà cung cấp</option>
          <option value="Số điện thoại">Số điện thoại</option>
          <option value="Địa chỉ">Địa chỉ</option>
        </select>

        {/* Nút Tìm */}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tìm
        </button>
      </div>

      {/* Các button chức năng */}
      <div className="flex gap-2 mb-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Thêm
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
          Sửa
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Xóa</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Xuất Excel
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded">
          Nhập Excel
        </button>
      </div>

      {/* Khu vực hiển thị nhà cung cấp */}
      <div className="border p-4 bg-white shadow">
        Danh sách nhà cung cấp sẽ hiển thị ở đây...
      </div>
    </div>
  );
};

export default Supplier;
