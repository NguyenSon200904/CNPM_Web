import { useState, useEffect } from "react";
import { Button, Input, Select, Table } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Product = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("id");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [data, setData] = useState([
    {
      id: "LP13",
      name: "Laptop HP 15s",
      quantity: 18,
      price: 9990000,
      cpu: "i3 1115G4",
      ram: "4 GB",
      storage: "256 GB",
      type: "Laptop",
    },
    {
      id: "LP14",
      name: "Laptop Lenovo IdeaPad",
      quantity: 3,
      price: 22490000,
      cpu: "i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
    {
      id: "LP15",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
    {
      id: "LP16",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
    {
      id: "LP17",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
    {
      id: "LP18",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
    {
      id: "LP19",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
    {
      id: "LP20",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
    {
      id: "LP21",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
    {
      id: "LP22",
      name: "Laptop Lenovo IdeaPad 5 Pro 16IAH7",
      quantity: 3,
      price: 22490000,
      cpu: "Intel Core i5 12500H",
      ram: "16 GB",
      storage: "512 GB",
      type: "Laptop",
    },
  ]);

  const filteredData = data.filter((item) =>
    item[filterBy].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Mã máy", dataIndex: "id", key: "id", responsive: ["sm"] },
    { title: "Tên máy", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()}đ`,
    },
    { title: "Bộ xử lý", dataIndex: "cpu", key: "cpu", responsive: ["md"] },
    { title: "RAM", dataIndex: "ram", key: "ram", responsive: ["md"] },
    {
      title: "Bộ nhớ",
      dataIndex: "storage",
      key: "storage",
      responsive: ["lg"],
    },
    { title: "Loại máy", dataIndex: "type", key: "type", responsive: ["lg"] },
  ];

  const _updateData = (newData) => {
    setData(newData);
  };

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2> */}

      {/* Tìm kiếm & Bộ lọc */}
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nhập từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 md:w-80 h-[50px]"
          />
          <Select
            value={filterBy}
            onChange={setFilterBy}
            className="w-40  h-[50px]"
          >
            <Option value="id">Mã máy</Option>
            <Option value="name">Tên máy</Option>
            <Option value="quantity">Số lượng</Option>
            <Option value="price">Đơn giá</Option>
            <Option value="cpu">Bộ xử lý</Option>
            <Option value="ram">RAM</Option>
            <Option value="storage">Bộ nhớ</Option>
            <Option value="type">Loại máy</Option>
          </Select>
        </div>

        {/* Nhóm chức năng */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="min-w-[100px]  h-[50px]"
          >
            Thêm
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
            danger
            icon={<DeleteOutlined />}
            className="min-w-[100px]  h-[50px]"
          >
            Xóa
          </Button>
          {!isMobile && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 7 }}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default Product;
