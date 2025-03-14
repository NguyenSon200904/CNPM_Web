import { useState, useEffect } from "react";
import { Button, Input, Select, Table } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("username");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [data, setData] = useState([
    {
      username: "admin",
      fullname: "Quản trị viên",
      email: "admin@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      username: "user1",
      fullname: "Người dùng 1",
      email: "user1@example.com",
      role: "Nhân viên nhập",
      status: "Active",
    },
    {
      username: "user2",
      fullname: "Người dùng 1",
      email: "user1@example.com",
      role: "Nhân viên xuất",
      status: "Inactive",
    },
    {
      username: "user3",
      fullname: "Người dùng 1",
      email: "user1@example.com",
      role: "Nhân viên nhập",
      status: "Inactive",
    },
    {
      username: "user4",
      fullname: "Người dùng 1",
      email: "user1@example.com",
      role: "Nhân viên xuất",
      status: "Inactive",
    },
    {
      username: "user5",
      fullname: "Người dùng 1",
      email: "user1@example.com",
      role: "Quản lý kho",
      status: "Active",
    },
    {
      username: "user5",
      fullname: "Người dùng 1",
      email: "user1@example.com",
      role: "Quản lý kho",
      status: "Active",
    },
    {
      username: "user6",
      fullname: "Người dùng 1",
      email: "user1@example.com",
      role: "Quản lý kho",
      status: "Active",
    },
    {
      username: "user7",
      fullname: "Người dùng 1",
      email: "user1@example.com",
      role: "Quản lý kho",
      status: "Active",
    },
  ]);

  const filteredData = data.filter((item) =>
    item[filterBy].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Tên tài khoản",
      dataIndex: "fullname",
      key: "fullname",
      responsive: ["sm"],
    },
    { title: "Tên đăng nhập", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Vai trò", dataIndex: "role", key: "role" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];

  const _updateData = (newData) => {
    setData(newData);
  };

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Quản lý tài khoản</h2> */}

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
            <Option value="username">Tên đăng nhập</Option>
            <Option value="fullname">Tên tài khoản</Option>
            <Option value="email">Email</Option>
            <Option value="role">Vai trò</Option>
            <Option value="status">Trạng thái</Option>
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
                icon={<ReloadOutlined />}
                className="min-w-[100px]  h-[50px]"
              >
                Đặt lại
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

export default Accounts;
