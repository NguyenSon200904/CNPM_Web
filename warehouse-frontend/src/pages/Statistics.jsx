import { useState } from "react";
import { Card, Table, Input, Button, DatePicker, Tabs } from "antd";
import {
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Statistics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");

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
    invoices: [],
    accounts: [],
  };

  const columns = [
    { title: "STT", dataIndex: "key", key: "key" },
    { title: "Mã máy", dataIndex: "code", key: "code" },
    { title: "Tên máy", dataIndex: "name", key: "name" },
    { title: "Số lượng nhập", dataIndex: "imported", key: "imported" },
    { title: "Số lượng xuất", dataIndex: "exported", key: "exported" },
  ];

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
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
        <TabPane tab="Sản phẩm" key="products" />
        <TabPane tab="Phiếu" key="invoices" />
        <TabPane tab="Tài khoản" key="accounts" />
      </Tabs>
      {/* Thanh tìm kiếm và lọc */}
      <div className="flex justify-between mb-4 p-4 bg-gray-100 rounded">
        <Input
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80"
        />
        <div className="flex items-center gap-2">
          <span>Lọc theo ngày:</span>
          <RangePicker />
          {activeTab === "invoices" ? (
            <Button className="ml-2">Xem chi tiết</Button>
          ) : null}
        </div>
      </div>
      {/* Bảng dữ liệu */}
      <Table
        dataSource={data[activeTab]}
        columns={columns}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default Statistics;
