const ProductActions = () => {
  return (
    <div className="flex gap-4 mb-4">
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Thêm
      </button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Sửa</button>
      <button className="bg-red-600 text-white px-4 py-2 rounded">Xóa</button>
      <button className="bg-gray-600 text-white px-4 py-2 rounded">
        Xem chi tiết
      </button>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded">
        Xuất Excel
      </button>
      <button className="bg-purple-500 text-white px-4 py-2 rounded">
        Nhập Excel
      </button>
      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="border px-4 py-2 rounded"
      />
    </div>
  );
};

export default ProductActions;
