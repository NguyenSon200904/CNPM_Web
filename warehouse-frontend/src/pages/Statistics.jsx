import { useState, useEffect, useMemo } from "react";
import { Card, Table, Input, Select, DatePicker, Tabs, message } from "antd";
import {
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api from "../api"; // Import instance api từ api.jsx
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Statistics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKey, setFilterKey] = useState("code");
  const [dateRange, setDateRange] = useState([]);
  const [data, setData] = useState({
    products: [],
    invoices: [],
    accounts: [],
  });
  const [stats, setStats] = useState({
    productCount: 0,
    supplierCount: 0,
    accountCount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchTerm("");
    setDateRange([]);
  }, [activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
    const defaultFilter = {
      products: "code",
      invoices: "key",
      accounts: "username",
    };
    setFilterKey(defaultFilter[key]);
  };

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu sản phẩm
        const inventoryResponse = await api.get("/inventory"); // Sử dụng api thay vì axios
        const receiptsResponse = await api.get("/receipts"); // Sử dụng api thay vì axios
        const exportReceiptsResponse = await api.get("/export-receipts"); // Sử dụng api thay vì axios

        // Tính số lượng nhập và xuất cho từng sản phẩm
        const importQuantities = {};
        const exportQuantities = {};

        receiptsResponse.data.forEach((receipt) => {
          receipt.chiTietPhieuNhaps.forEach((detail) => {
            const maSanPham = detail.id.maSanPham;
            importQuantities[maSanPham] =
              (importQuantities[maSanPham] || 0) + detail.soLuong;
          });
        });

        exportReceiptsResponse.data.forEach((exportReceipt) => {
          exportReceipt.chiTietPhieuXuats.forEach((detail) => {
            const maSanPham = detail.id.maSanPham;
            exportQuantities[maSanPham] =
              (exportQuantities[maSanPham] || 0) + detail.soLuong;
          });
        });

        const productsData = inventoryResponse.data.map((item, index) => ({
          key: index + 1,
          code: item.maSanPham,
          name: item.tenSanPham,
          imported: importQuantities[item.maSanPham] || 0,
          exported: exportQuantities[item.maSanPham] || 0,
        }));

        // Lấy dữ liệu phiếu (kết hợp phiếu nhập và phiếu xuất)
        const invoicesData = [
          ...receiptsResponse.data.map((receipt) => ({
            key: `PN-${receipt.maPhieuNhap}`,
            type: "Phiếu nhập",
            creator: receipt.nguoiTao?.userName || "Không xác định",
            total: receipt.tongTien,
            date: moment(receipt.ngayNhap).format("DD/MM/YYYY HH:mm"),
          })),
          ...exportReceiptsResponse.data.map((exportReceipt) => ({
            key: `PX-${exportReceipt.maPhieuXuat}`,
            type: "Phiếu xuất",
            creator: exportReceipt.nguoiTao?.userName || "Không xác định",
            total: exportReceipt.tongTien,
            date: moment(exportReceipt.ngayXuat).format("DD/MM/YYYY HH:mm"),
          })),
        ].sort(
          (a, b) =>
            moment(b.date, "DD/MM/YYYY HH:mm").unix() -
            moment(a.date, "DD/MM/YYYY HH:mm").unix()
        );

        // Lấy dữ liệu tài khoản
        const accountsResponse = await api.get("/accounts"); // Sử dụng api thay vì axios
        const accountsData = accountsResponse.data.map((account, index) => ({
          key: index + 1,
          username: account.userName,
          fullname: account.fullName,
          email: account.email,
          role: mapRole(account.role),
          status: account.status === 1 ? "Active" : "Inactive",
        }));

        // Lấy số lượng nhà cung cấp
        const suppliersResponse = await api.get("/suppliers"); // Sử dụng api thay vì axios

        // Cập nhật dữ liệu
        setData({
          products: productsData,
          invoices: invoicesData,
          accounts: accountsData,
        });

        // Cập nhật số liệu cho các Card
        setStats({
          productCount: inventoryResponse.data.filter(
            (item) => item.soLuongTonKho > 0
          ).length,
          supplierCount: suppliersResponse.data.length,
          accountCount: accountsResponse.data.length,
        });
      } catch (error) {
        console.error("Error fetching statistics data:", error);
        message.error(
          "Lỗi khi tải dữ liệu thống kê: " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapRole = (role) => {
    switch (role) {
      case 1:
        return "Nhân viên nhập";
      case 2:
        return "Nhân viên xuất";
      case 3:
        return "Quản lý kho";
      default:
        return "Admin";
    }
  };

  // Cấu hình cột cho từng tab
  const columns = {
    products: [
      { title: "STT", dataIndex: "key", key: "key" },
      { title: "Mã máy", dataIndex: "code", key: "code" },
      { title: "Tên máy", dataIndex: "name", key: "name" },
      { title: "Số lượng nhập", dataIndex: "imported", key: "imported" },
      { title: "Số lượng xuất", dataIndex: "exported", key: "exported" },
    ],
    invoices: [
      { title: "Mã phiếu", dataIndex: "key", key: "key" },
      { title: "Loại phiếu", dataIndex: "type", key: "type" },
      { title: "Người tạo", dataIndex: "creator", key: "creator" },
      { title: "Thời gian tạo", dataIndex: "date", key: "date" },
      {
        title: "Tổng tiền",
        dataIndex: "total",
        key: "total",
        render: (total) => `${total.toLocaleString()}đ`,
      },
    ],
    accounts: [
      { title: "Họ và tên", dataIndex: "fullname", key: "fullname" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Tên người dùng", dataIndex: "username", key: "username" },
      { title: "Vai trò", dataIndex: "role", key: "role" },
      { title: "Tình trạng", dataIndex: "status", key: "status" },
    ],
  };

  // Cấu hình tiêu chí lọc cho từng tab
  const filterOptions = {
    products: [
      { label: "Mã máy", value: "code" },
      { label: "Tên máy", value: "name" },
      { label: "Số lượng nhập", value: "imported" },
      { label: "Số lượng xuất", value: "exported" },
    ],
    invoices: [
      { label: "Mã phiếu", value: "key" },
      { label: "Loại phiếu", value: "type" },
      { label: "Người tạo", value: "creator" },
      { label: "Thời gian tạo", value: "date" },
    ],
    accounts: [
      { label: "Tên người dùng", value: "username" },
      { label: "Email", value: "email" },
      { label: "Vai trò", value: "role" },
      { label: "Tình trạng", value: "status" },
    ],
  };

  // Lọc dữ liệu theo tiêu chí đã chọn và khoảng thời gian (nếu có)
  const filteredData = useMemo(() => {
    let filtered = data[activeTab].filter((item) =>
      item[filterKey]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    // Lọc theo khoảng thời gian trong tab "Phiếu"
    if (activeTab === "invoices" && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter((item) => {
        const itemDate = moment(item.date, "DD/MM/YYYY HH:mm");
        return itemDate.isBetween(start, end, null, "[]");
      });
    }

    return filtered;
  }, [searchTerm, activeTab, filterKey, dateRange, data]);

  return (
    <div className="p-4 -mt-6">
      {/* Thống kê */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="p-4 flex items-center bg-yellow-400 text-white h-32">
          <div className="text-6xl flex-shrink-0 mr-4">
            <ShoppingOutlined />
          </div>
          <div className="flex flex-col items-start text-lg font-bold">
            <div className="text-3xl">{stats.productCount}</div>
            <div>Sản phẩm trong kho</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center bg-orange-500 text-white h-32">
          <div className="text-6xl flex-shrink-0 mr-4">
            <TeamOutlined />
          </div>
          <div className="flex flex-col items-start text-lg font-bold">
            <div className="text-3xl">{stats.supplierCount}</div>
            <div>Nhà cung cấp</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center bg-teal-500 text-white h-32">
          <div className="text-6xl flex-shrink-0 mr-4">
            <UserOutlined />
          </div>
          <div className="flex flex-col items-start text-lg font-bold">
            <div className="text-3xl">{stats.accountCount}</div>
            <div>Tài khoản người dùng</div>
          </div>
        </Card>
      </div>
      {/* Tabs chọn nội dung */}
      <Tabs activeKey={activeTab} onChange={handleTabChange} className="mb-4">
        <TabPane tab="Sản phẩm" key="products" />
        <TabPane tab="Phiếu" key="invoices" />
        <TabPane tab="Tài khoản" key="accounts" />
      </Tabs>
      {/* Thanh tìm kiếm và lọc */}
      <div className="flex gap-2 mb-4 items-center">
        <Input
          placeholder="Nhập từ khóa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-60 md:w-80 h-[50px]"
        />
        <Select
          value={filterKey}
          onChange={setFilterKey}
          className="w-40 h-[50px]"
        >
          {filterOptions[activeTab].map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        {activeTab === "invoices" && (
          <div className="ml-auto flex items-center gap-2 text-black">
            <span>Lọc theo ngày:</span>
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              format="DD/MM/YYYY"
            />
          </div>
        )}
      </div>
      {/* Bảng dữ liệu */}
      <Table
        dataSource={filteredData}
        columns={columns[activeTab]}
        pagination={{
          pageSize: 5,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
        bordered
        loading={loading}
      />
    </div>
  );
};

export default Statistics;
