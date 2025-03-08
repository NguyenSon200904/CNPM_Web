import { useState } from "react";

const Product = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Tất cả");

  const handleSearch = () => {
    console.log("Tìm kiếm:", searchTerm, "- Tiêu chí:", filter);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>

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
          <option value="Mã máy">Mã máy</option>
          <option value="Tên máy">Tên máy</option>
          <option value="Số lượng">Số lượng</option>
          <option value="Đơn giá">Đơn giá</option>
          <option value="RAM">RAM</option>
          <option value="CPU">CPU</option>
          <option value="Dung lượng">Dung lượng</option>
          <option value="Card màn hình">Card màn hình</option>
          <option value="Xuất xứ">Xuất xứ</option>
        </select>

        {/* Nút Tìm */}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tìm
        </button>
      </div>

      {/* Các nút chức năng */}
      <div className="flex gap-2 mb-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Thêm
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
          Sửa
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Xóa</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded">
          Xem chi tiết
        </button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded">
          Xuất Excel
        </button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          Nhập Excel
        </button>
      </div>

      {/* Khu vực hiển thị sản phẩm */}
      <div className="border p-4 bg-white shadow">
        Danh sách sản phẩm sẽ hiển thị ở đây...
      </div>
    </div>
  );
};

export default Product;
