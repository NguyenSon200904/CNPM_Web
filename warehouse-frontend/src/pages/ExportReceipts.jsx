import { useState, useEffect } from "react";

const ExportReceipts = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(10000000);
  const [receipts, setReceipts] = useState([
    {
      id: "PX41",
      creator: "Admin",
      total: 1000000,
      date: "08/03/2025 16:33",
    },
    {
      id: "PX39",
      creator: "Admin",
      total: 9990000,
      date: "08/03/2025 16:25",
    },
  ]);

  useEffect(() => {
    const filtered = receipts.filter(
      (r) =>
        (!dateFrom || new Date(r.date) >= new Date(dateFrom)) &&
        (!dateTo || new Date(r.date) <= new Date(dateTo)) &&
        r.total >= priceFrom &&
        r.total <= priceTo
    );
    setReceipts(filtered);
  }, [dateFrom, dateTo, priceFrom, priceTo]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách phiếu xuất</h2>

      {/* Thanh công cụ */}
      <div className="flex gap-2 mb-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded">Xóa</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
          Sửa
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Xem chi tiết
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Xuất Excel
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded">
          Nhập Excel
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Lọc theo ngày</h3>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Lọc theo giá</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={priceFrom}
              onChange={(e) => setPriceFrom(Number(e.target.value))}
              className="border p-2 w-full"
            />
            <input
              type="number"
              value={priceTo}
              onChange={(e) => setPriceTo(Number(e.target.value))}
              className="border p-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Danh sách phiếu xuất */}
      <div className="bg-white p-4 shadow rounded h-[400px] overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">STT</th>
              <th className="border p-2">Mã phiếu xuất</th>
              <th className="border p-2">Người tạo</th>
              <th className="border p-2">Thời gian tạo</th>
              <th className="border p-2">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt, index) => (
              <tr key={receipt.id} className="border">
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{receipt.id}</td>
                <td className="border p-2 text-center">{receipt.creator}</td>
                <td className="border p-2 text-center">{receipt.date}</td>
                <td className="border p-2 text-right">
                  {receipt.total.toLocaleString()}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExportReceipts;
