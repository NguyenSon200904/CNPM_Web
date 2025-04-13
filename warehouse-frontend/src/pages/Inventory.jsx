import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Table,
  message,
  Drawer,
  Menu,
  Dropdown,
} from "antd";
import {
  FileExcelOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";
import api from "../api";
import * as XLSX from "xlsx";

const { Option } = Select;

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("maSanPham");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await api.get("http://localhost:8080/api/inventory", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
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
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filteredData = inventory.filter((item) =>
    item[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }

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

  const columns = [
    { title: "Mã sản phẩm", dataIndex: "maSanPham", key: "maSanPham" },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
      ellipsis: true,
    },
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
      responsive: ["sm"],
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "loaiSanPham",
      key: "loaiSanPham",
      responsive: ["md"],
    },
  ];

  const expandedRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Mã sản phẩm:</strong> {record.maSanPham}
      </p>
      <p>
        <strong>Tên sản phẩm:</strong> {record.tenSanPham}
      </p>
      <p>
        <strong>Số lượng tồn kho:</strong> {record.soLuongTonKho}
      </p>
      <p>
        <strong>Đơn giá:</strong> {record.gia.toLocaleString()}đ
      </p>
      <p>
        <strong>Loại sản phẩm:</strong> {record.loaiSanPham}
      </p>
    </div>
  );

  const menu = (
    <Menu>
      <Menu.Item key="export" onClick={handleExportExcel}>
        <FileExcelOutlined /> Xuất Excel
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="relative">
      {/* Nút mở sidebar trên mobile */}
      {isMobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-10 h-12 w-12 text-base bg-blue-500 text-white"
        />
      )}

      {/* Sidebar dưới dạng Drawer trên mobile */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsSidebarOpen(false)}
        open={isSidebarOpen}
        width={200}
      >
        <Menu mode="vertical">
          <Menu.Item key="sanpham">SẢN PHẨM</Menu.Item>
          <Menu.Item key="nhacungcap">NHÀ CUNG CẤP</Menu.Item>
          <Menu.Item key="nhaphang">NHẬP HÀNG</Menu.Item>
          <Menu.Item key="phieunhap">PHIẾU NHẬP</Menu.Item>
          <Menu.Item key="xuathang">XUẤT HÀNG</Menu.Item>
          <Menu.Item key="phieuxuat">PHIẾU XUẤT</Menu.Item>
          <Menu.Item key="tonkho">TỒN KHO</Menu.Item>
          <Menu.Item key="taikhoan">TÀI KHOẢN</Menu.Item>
          <Menu.Item key="thongke">THỐNG KÊ</Menu.Item>
          <Menu.Item key="doithongtin">ĐỔI THÔNG TIN</Menu.Item>
        </Menu>
      </Drawer>

      <div className="p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-left">
          TỒN KHO
        </h2>

        <div
          className={`flex ${
            isMobile ? "flex-col" : "flex-row"
          } gap-3 mb-6 sm:mb-8 items-center`}
        >
          <Input
            placeholder="Nhập từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-12 text-base rounded-lg"
          />
          <Select
            value={filterBy}
            onChange={setFilterBy}
            className="w-full sm:w-40 h-12 text-base rounded-lg"
          >
            <Option value="maSanPham">Mã sản phẩm</Option>
            <Option value="tenSanPham">Tên sản phẩm</Option>
            <Option value="soLuongTonKho">Số lượng tồn kho</Option>
            <Option value="gia">Đơn giá</Option>
            <Option value="loaiSanPham">Loại sản phẩm</Option>
          </Select>
          {isMobile ? (
            <Dropdown overlay={menu}>
              <Button className="min-w-[100px] h-12 text-base">
                Thao tác <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              className="min-w-[120px] h-12 text-base"
              onClick={handleExportExcel}
            >
              Xuất Excel
            </Button>
          )}
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="maSanPham"
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{ pageSize: 5 }}
          loading={loading}
          scroll={{ x: isMobile ? 300 : "max-content" }}
          className="custom-table"
        />
      </div>

      <style jsx>{`
        .custom-table .ant-table {
          font-size: 14px;
        }
        @media (max-width: 640px) {
          .custom-table .ant-table {
            font-size: 12px;
          }
          .custom-table .ant-table-thead > tr > th,
          .custom-table .ant-table-tbody > tr > td {
            padding: 8px !important;
          }
        }
        @media (min-width: 1024px) {
          .custom-table .ant-table {
            font-size: 16px;
          }
        }

        @media (max-width: 768px) {
          .ant-layout-sider {
            display: none !important;
          }
          .ant-layout-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Inventory;
