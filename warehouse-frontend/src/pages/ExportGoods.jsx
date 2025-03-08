import { useState, useEffect } from "react";

const ExportGoods = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [receiptCode, setReceiptCode] = useState("");
  const [creator, setCreator] = useState("admin");

  const handleSearch = () => {
    console.log("Tìm kiếm:", searchTerm);
  };

  const handleAddProduct = () => {
    if (!searchTerm) return;
    const newProduct = { name: searchTerm, quantity };
    setSelectedProducts([...selectedProducts, newProduct]);
    setSearchTerm("");
    setQuantity(1);
  };

  useEffect(() => {
    // Giả sử lấy thông tin người dùng từ localStorage hoặc API
    const user = localStorage.getItem("username") || "admin";
    setCreator(user);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Xuất hàng</h2>

      <div className="grid grid-cols-2 gap-4 h-[500px]">
        {/* Phần 1: Tìm kiếm sản phẩm */}
        <div className="bg-white p-4 shadow rounded h-full flex flex-col overflow-y-auto">
          <h3 className="font-bold mb-2">Chọn sản phẩm</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập thông tin tìm kiếm..."
              className="border p-2 flex-1"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Tìm
            </button>
          </div>

          {/* Danh sách sản phẩm */}
          <ul className="border p-2 flex-1 overflow-y-auto">
            {/* Sản phẩm từ database sẽ hiển thị ở đây */}
          </ul>

          <div className="flex gap-2 mt-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 w-20"
            />
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* Phần 2: Thông tin xuất hàng */}
        <div className="bg-white p-4 shadow rounded h-full flex flex-col overflow-y-auto">
          <h3 className="font-bold mb-2">Thông tin xuất hàng</h3>
          <div className="mb-2 flex items-center gap-2">
            <label className="font-semibold w-1/3">Mã phiếu xuất</label>
            <input
              type="text"
              value={receiptCode}
              onChange={(e) => setReceiptCode(e.target.value)}
              className="border p-2 w-2/3"
            />
          </div>

          <div className="mb-2 flex items-center gap-2">
            <label className="font-semibold w-1/3">Người tạo phiếu</label>
            <input
              type="text"
              value={creator}
              readOnly
              className="border p-2 w-2/3 bg-gray-100"
            />
          </div>

          {/* Danh sách sản phẩm đã chọn */}
          <ul className="border p-2 flex-1 overflow-y-auto">
            {selectedProducts.map((product, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  {product.name} - SL: {product.quantity}
                </span>
                <button className="text-red-500">Xóa</button>
              </li>
            ))}
          </ul>

          {/* Các nút chức năng */}
          <div className="flex gap-2 mt-2">
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              Nhập Excel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Sửa số lượng
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Xóa sản phẩm
            </button>
          </div>

          {/* Tổng tiền + Xuất hàng */}
          <div className="flex justify-between items-center mt-4">
            <p className="font-bold">Tổng tiền: $0</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Xuất hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportGoods;
