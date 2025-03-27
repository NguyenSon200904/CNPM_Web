import { useState, useEffect } from "react";
import { Button, Input, Select, Table, message } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import api from "../api";
import * as XLSX from "xlsx";

const { Option } = Select;

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("maSanPham");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu tồn kho từ API
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await api.get("http://localhost:8080/api/inventory");
        const formattedInventory = response.data.map((item) => ({
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuongTonKho: item.soLuongTonKho,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
        }));
        if (formattedInventory.length === 0) {
          message.warning(
            "Không có hàng hóa nào trong kho! Vui lòng nhập hàng trước."
          );
        }
        setInventory(formattedInventory);
      } catch (error) {
        message.error(
          "Không thể tải danh sách hàng hóa trong kho: " +
            (error.response?.data || error.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = inventory.filter((item) =>
    item[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý xuất Excel
  const handleExportExcel = () => {
    const exportData = filteredData.map((item) => ({
      "Mã sản phẩm": item.maSanPham,
      "Tên sản phẩm": item.tenSanPham,
      "Số lượng tồn kho": item.soLuongTonKho,
      "Đơn giá": item.gia,
      "Loại sản phẩm": item.loaiSanPham,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory.xlsx");
    message.success("Xuất Excel thành công!");
  };

  // Cấu hình cột cho bảng
  const columns = [
    { title: "Mã sản phẩm", dataIndex: "maSanPham", key: "maSanPham" },
    { title: "Tên sản phẩm", dataIndex: "tenSanPham", key: "tenSanPham" },
    {
      title: "Số lượng tồn kho",
      dataIndex: "soLuongTonKho",
      key: "soLuongTonKho",
    },
    {
      title: "Đơn giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia) => `${gia.toLocaleString()}đ`,
    },
    { title: "Loại sản phẩm", dataIndex: "loaiSanPham", key: "loaiSanPham" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý tồn kho</h2>

      {/* Tìm kiếm và xuất Excel */}
      <div className="flex gap-4 mb-4 items-center">
        <Input
          placeholder="Nhập từ khóa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-[50px]"
        />
        <Select
          value={filterBy}
          onChange={setFilterBy}
          className="w-40 h-[50px]"
        >
          <Option value="maSanPham">Mã sản phẩm</Option>
          <Option value="tenSanPham">Tên sản phẩm</Option>
          <Option value="soLuongTonKho">Số lượng tồn kho</Option>
          <Option value="gia">Đơn giá</Option>
          <Option value="loaiSanPham">Loại sản phẩm</Option>
        </Select>
        <Button
          className="h-[50px]"
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={handleExportExcel}
        >
          Xuất Excel
        </Button>
      </div>

      {/* Danh sách tồn kho */}
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="maSanPham"
        pagination={{ pageSize: 7 }}
        loading={loading}
      />
    </div>
  );
};

export default Inventory;
