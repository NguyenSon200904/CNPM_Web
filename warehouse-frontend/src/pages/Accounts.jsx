import { useState } from "react";
import { Button, Input, Select, Table } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";

const { Option } = Select;

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("username");
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
      role: "Nhân viên",
      status: "Inactive",
    },
  ]);

  const filteredData = data.filter((item) =>
    item[filterBy].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Tên tài khoản", dataIndex: "fullname", key: "fullname" },
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
      <h2 className="text-2xl font-bold mb-4">Quản lý tài khoản</h2>

      {/* Chức năng và tìm kiếm */}
      <div className="flex justify-between mb-4">
        {/* Nhóm tìm kiếm */}
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Nhập từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 h-[50px]"
          />
          <Select
            value={filterBy}
            onChange={setFilterBy}
            className="w-40 h-[50px]"
          >
            <Option value="username">Tên đăng nhập</Option>
            <Option value="fullname">Tên tài khoản</Option>
            <Option value="email">Email</Option>
            <Option value="role">Vai trò</Option>
            <Option value="status">Trạng thái</Option>
          </Select>
        </div>

        {/* Nhóm chức năng */}
        <div className="flex gap-4">
          <Button type="primary" className="h-[50px]">
            Thêm
          </Button>
          <Button className="h-[50px]">Sửa</Button>
          <Button danger className="h-[50px]">
            Xóa
          </Button>
          <Button className="h-[50px]">Đặt lại</Button>
          <Button icon={<FileExcelOutlined />} className="h-[50px]">
            Xuất Excel
          </Button>
          <Button icon={<FileExcelOutlined />} className="h-[50px]">
            Nhập Excel
          </Button>
        </div>
      </div>

      {/* Danh sách tài khoản */}
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="username"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default Accounts;
