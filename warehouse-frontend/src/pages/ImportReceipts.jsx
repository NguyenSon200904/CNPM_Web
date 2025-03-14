import { useState } from "react";
import { Table, Button, Input, DatePicker } from "antd";
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const ImportReceipts = () => {
  const [dateRange, setDateRange] = useState([]);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(10000000);
  const [receipts] = useState([
    {
      id: "PN41",
      supplier: "Công Ty TNHH Điều Khiển Tự Động An Phát",
      creator: "Admin",
      total: 1000000,
      date: "2025-03-08 16:33",
    },
    {
      id: "PN39",
      supplier: "Công ty CP Công nghệ Thương mại Dịch vụ Vietstars",
      creator: "Admin",
      total: 9990000,
      date: "2025-03-08 16:25",
    },
    {
      id: "PN38",
      supplier: "Công ty TNHH MTV Thương mại Dịch vụ Điện tử Vào Bờ",
      creator: "Admin",
      total: 5000000,
      date: "2025-03-08 16:25",
    },
    {
      id: "PN37",
      supplier: "Công ty TNHH MTV Thương mại Dịch vụ Điện tử Vào Bờ",
      creator: "Admin",
      total: 5000000,
      date: "2025-03-08 16:25",
    },
    {
      id: "PN36",
      supplier: "Công ty TNHH MTV Thương mại Dịch vụ Điện tử Vào Bờ",
      creator: "Admin",
      total: 5000000,
      date: "2025-03-08 16:25",
    },
    {
      id: "PN35",
      supplier: "Công ty TNHH MTV Thương mại Dịch vụ Điện tử Vào Bờ",
      creator: "Admin",
      total: 5000000,
      date: "2025-03-08 16:25",
    },
    {
      id: "PN34",
      supplier: "Công ty TNHH MTV Thương mại Dịch vụ Điện tử Vào Bờ",
      creator: "Admin",
      total: 5000000,
      date: "2025-03-08 16:25",
    },
    {
      id: "PN33",
      supplier: "Công ty TNHH MTV Thương mại Dịch vụ Điện tử Vào Bờ",
      creator: "Admin",
      total: 5000000,
      date: "2025-03-08 16:25",
    },
    {
      id: "PN32",
      supplier: "Công ty TNHH MTV Thương mại Dịch vụ Điện tử Vào Bờ",
      creator: "Admin",
      total: 5000000,
      date: "2025-03-08 16:25",
    },
  ]);

  // Lọc dữ liệu dựa trên khoảng ngày và giá
  const filteredReceipts = receipts.filter((r) => {
    const receiptDate = new Date(r.date);
    const startDate = dateRange[0] ? new Date(dateRange[0]) : null;
    const endDate = dateRange[1] ? new Date(dateRange[1]) : null;

    return (
      (!startDate || receiptDate >= startDate) &&
      (!endDate || receiptDate <= endDate) &&
      r.total >= priceFrom &&
      r.total <= priceTo
    );
  });

  // Cấu hình cột bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "Mã phiếu nhập",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      key: "creator",
      align: "center",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (value) => `${value.toLocaleString()}đ`,
    },
  ];

  return (
    <div className="p-4">
      {/* Thanh công cụ */}
      <div className="flex gap-2 mb-4">
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          className="min-w-[100px]  h-[50px]"
        >
          Xóa
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          className="min-w-[100px]  h-[50px]"
        >
          Sửa
        </Button>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          className="min-w-[100px]  h-[50px]"
        >
          Xem chi tiết
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          className="min-w-[100px]  h-[50px]"
        >
          Xuất Excel
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          className="min-w-[100px]  h-[50px]"
        >
          Nhập Excel
        </Button>
      </div>

      {/* Bộ lọc */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2 text-black">Lọc theo ngày</h3>
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            className="w-full"
          />
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2 text-black">Lọc theo giá</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              value={priceFrom}
              onChange={(e) => setPriceFrom(Number(e.target.value))}
              placeholder="Giá từ"
            />
            <Input
              type="number"
              value={priceTo}
              onChange={(e) => setPriceTo(Number(e.target.value))}
              placeholder="Giá đến"
            />
          </div>
        </div>
      </div>

      {/* Danh sách phiếu nhập */}
      <div className="bg-white p-4 shadow rounded">
        <Table
          dataSource={filteredReceipts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </div>
    </div>
  );
};

export default ImportReceipts;
