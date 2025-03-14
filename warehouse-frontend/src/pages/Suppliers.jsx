import { useState, useEffect } from "react";
import { Button, Input, Select, Table } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Supplier = () => {
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
      id: "NCC01",
      name: "Nhà cung cấp 1",
      phone: "0123456789",
      address: "123 Đường ABC, Quận XYZ, TP HCM",
    },
    {
      id: "NCC02",
      name: "Nhà cung cấp 2",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận ABC, TP HCM",
    },
    {
      id: "NCC03",
      name: "Nhà cung cấp 3",
      phone: "0123456789",
      address: "123 Đường ABC, Quận XYZ, TP HCM",
    },
    {
      id: "NCC04",
      name: "Nhà cung cấp 4",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận ABC, TP HCM",
    },
    {
      id: "NCC05",
      name: "Nhà cung cấp 5",
      phone: "0123456789",
      address: "123 Đường ABC, Quận XYZ, TP HCM",
    },
    {
      id: "NCC06",
      name: "Nhà cung cấp 6",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận ABC, TP HCM",
    },
    {
      id: "NCC07",
      name: "Nhà cung cấp 7",
      phone: "0123456789",
      address: "123 Đường ABC, Quận XYZ, TP HCM",
    },
    {
      id: "NCC08",
      name: "Nhà cung cấp 8",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận ABC, TP HCM",
    },
    {
      id: "NCC09",
      name: "Nhà cung cấp 9",
      phone: "0123456789",
      address: "123 Đường ABC, Quận XYZ, TP HCM",
    },
    {
      id: "NCC10",
      name: "Nhà cung cấp 10",
      phone: "0987654321",
      address: "456 Đường XYZ, Quận ABC, TP HCM",
    },
  ]);

  const filteredData = data.filter((item) =>
    item[filterBy].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Mã NCC", dataIndex: "id", key: "id" },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
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
            <Option value="id">Mã NCC</Option>
            <Option value="name">Tên nhà cung cấp</Option>
            <Option value="phone">Số điện thoại</Option>
            <Option value="address">Địa chỉ</Option>
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
                icon={<FileExcelOutlined />}
                type="primary"
                className="min-w-[120px] h-[50px]"
              >
                Xuất Excel
              </Button>
              <Button
                icon={<FileExcelOutlined />}
                type="primary"
                className="min-w-[120px] h-[50px]"
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

export default Supplier;
