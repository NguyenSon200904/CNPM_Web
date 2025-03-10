import { useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";

const { Option } = Select;

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("id");
  const [data, setData] = useState([
    {
      id: "LP13",
      name: "Laptop HP 15s-fq2663TU",
      quantity: 18,
      price: 9990000,
      cpu: "Intel Core i3 1115G4",
      ram: "4 GB",
      storage: "256 GB",
      gpu: "Intel UHD",
      origin: "Vietnam",
    },
    {
      id: "LP15",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      gpu: "NVIDIA RTX 3050",
      origin: "China",
    },
  ]);

  const _updateData = (newData) => {
    setData(newData);
  };

  const filteredData = data.filter((item) =>
    item[filterBy].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Mã máy", dataIndex: "id", key: "id" },
    { title: "Tên máy", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()}đ`,
    },
    { title: "Bộ xử lý", dataIndex: "cpu", key: "cpu" },
    { title: "RAM", dataIndex: "ram", key: "ram" },
    { title: "Bộ nhớ", dataIndex: "storage", key: "storage" },
    { title: "Dung lượng card màn hình", dataIndex: "gpu", key: "gpu" },
    { title: "Xuất xứ", dataIndex: "origin", key: "origin" },
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
          <Option value="id">Mã máy</Option>
          <Option value="name">Tên máy</Option>
          <Option value="cpu">Bộ xử lý</Option>
          <Option value="ram">RAM</Option>
          <Option value="storage">Bộ nhớ</Option>
          <Option value="gpu">Dung lượng card</Option>
          <Option value="origin">Xuất xứ</Option>
        </Select>
        <Button
          className="h-[50px]"
          type="primary"
          icon={<FileExcelOutlined />}
        >
          Xuất Excel
        </Button>
      </div>

      {/* Danh sách tồn kho */}
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Inventory;
