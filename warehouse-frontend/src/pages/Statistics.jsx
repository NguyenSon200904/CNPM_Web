import { useState, useEffect, useMemo } from "react";
import { Card, Table, Input, Button, DatePicker, Tabs, Select } from "antd";
import {
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Statistics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [currentPage, setCurrentPage] = useState(1); // ⭐ Quản lý trang hiện tại
  const [filterKey, setFilterKey] = useState("code");

  useEffect(() => {
    setSearchTerm(""); // ⭐ Reset ô tìm kiếm khi đổi tab
  }, [activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1); // ⭐ Reset về trang 1 khi đổi tab
    // Cập nhật tiêu chí lọc mặc định theo tab
    const defaultFilter = {
      products: "code",
      invoices: "key",
      accounts: "username",
    };
    setFilterKey(defaultFilter[key]);
  };

  const data = {
    products: [
      {
        key: 1,
        code: "LP10",
        name: "Laptop Lenovo IdeaPad Gaming 3",
        imported: 2,
        exported: 1,
      },
      {
        key: 2,
        code: "LP14",
        name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
        imported: 4,
        exported: 4,
      },
      {
        key: 3,
        code: "LP15",
        name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
        imported: 8,
        exported: 1,
      },
      {
        key: 4,
        code: "LP22",
        name: "Laptop Lenovo Yoga Slim 7 Pro 14IHU5O",
        imported: 4,
        exported: 3,
      },
      {
        key: 5,
        code: "LP3",
        name: "Lenovo ThinkPad E14",
        imported: 3,
        exported: 3,
      },
      {
        key: 6,
        code: "LP4",
        name: "Lenovo Ideapad 3 15ITL6",
        imported: 12,
        exported: 3,
      },
    ],
    invoices: [
      {
        key: 1,
        creator: "Admin",
        total: 1000000,
        date: "08/03/2025 16:33",
      },
      {
        key: 2,
        creator: "Admin",
        total: 100000,
        date: "09/03/2025 16:33",
      },
      {
        key: 3,
        creator: "Admin",
        total: 200000,
        date: "10/03/2025 16:33",
      },
      {
        key: 4,
        creator: "Admin",
        total: 300000,
        date: "11/03/2025 16:33",
      },
      {
        key: 5,
        creator: "Admin",
        total: 400000,
        date: "12/03/2025 16:33",
      },
      {
        key: 6,
        creator: "Admin",
        total: 500000,
        date: "13/03/2025 16:33",
      },
    ],

    accounts: [
      {
        key: 1,
        username: "admin",
        fullname: "Quản trị viên",
        email: "admin@example.com",
        role: "Admin",
        status: "Active",
      },
      {
        key: 2,
        username: "user1",
        fullname: "Người dùng 1",
        email: "user1@example.com",
        role: "Nhân viên nhập",
        status: "Active",
      },
      {
        key: 3,
        username: "user2",
        fullname: "Người dùng 1",
        email: "user1@example.com",
        role: "Nhân viên xuất",
        status: "Inactive",
      },
      {
        key: 4,
        username: "user3",
        fullname: "Người dùng 1",
        email: "user1@example.com",
        role: "Nhân viên nhập",
        status: "Inactive",
      },
      {
        key: 5,
        username: "user4",
        fullname: "Người dùng 1",
        email: "user1@example.com",
        role: "Nhân viên xuất",
        status: "Inactive",
      },
      {
        key: 6,
        username: "user5",
        fullname: "Người dùng 1",
        email: "user1@example.com",
        role: "Quản lý kho",
        status: "Active",
      },
    ],
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
      { title: "Mã phiếu nhập", dataIndex: "key", key: "key" },
      { title: "Người tạo", dataIndex: "creator", key: "creator" },
      { title: "Thời gian tạo", dataIndex: "date", key: "date" },
      { title: "Tổng tiền", dataIndex: "total", key: "total" },
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
      { label: "Mã phiếu nhập", value: "key" },
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

  // Lọc dữ liệu theo tiêu chí đã chọn
  const filteredData = useMemo(() => {
    return data[activeTab].filter((item) =>
      item[filterKey]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeTab, filterKey]);

  return (
    <div className="p-4 -mt-6">
      {" "}
      {/* Dịch giao diện lên trên */}
      {/* Thống kê */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="p-4 flex items-center bg-yellow-400 text-white h-32">
          {" "}
          {/* Cập nhật chiều cao lên 8rem (32px * 8) */}
          <div className="text-6xl flex-shrink-0 mr-4">
            <ShoppingOutlined />
          </div>
          <div className="flex flex-col items-start text-lg font-bold">
            <div className="text-3xl">29</div>
            <div>Sản phẩm trong kho</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center bg-orange-500 text-white h-32">
          <div className="text-6xl flex-shrink-0 mr-4">
            <TeamOutlined />
          </div>
          <div className="flex flex-col items-start text-lg font-bold">
            <div className="text-3xl">8</div>
            <div>Nhà cung cấp</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center bg-teal-500 text-white h-32">
          <div className="text-6xl flex-shrink-0 mr-4">
            <UserOutlined />
          </div>
          <div className="flex flex-col items-start text-lg font-bold">
            <div className="text-3xl">2</div>
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
            <RangePicker />
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
      />
    </div>
  );
};

export default Statistics;
