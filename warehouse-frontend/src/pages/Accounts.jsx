import { useState, useEffect } from "react";
import { Input, Select, Table, Modal, Form, message } from "antd";
import ActionButtons from "../components/ActionButtons";

const { Option } = Select;

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("username");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/accounts");
      const accounts = await response.json();
      const formattedData = accounts.map((account, index) => ({
        id: index + 1,
        username: account.userName,
        fullname: account.fullName,
        email: account.email,
        role: mapRole(account.role),
        status: mapStatus(account.status),
        rawRole: account.role,
        rawStatus: account.status,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      message.error("Lỗi khi tải danh sách tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
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

  const mapStatus = (status) => {
    return status === 1 ? "Active" : "Inactive";
  };

  const filteredData = data.filter((item) =>
    item[filterBy].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, newSelectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedRows(newSelectedRows);
    },
    type: "radio",
  };

  const handleAdd = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      const newAccount = {
        userName: values.username,
        password: values.password || "default123",
        fullName: values.fullname,
        email: values.email,
        role: parseInt(values.role),
        status: values.status === "Active" ? 1 : 0,
      };

      const response = await fetch("http://localhost:8080/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });

      if (response.ok) {
        message.success("Thêm tài khoản thành công!");
        setIsAddModalVisible(false);
        fetchAccounts();
      } else {
        message.error("Thêm tài khoản thất bại!");
      }
    } catch (error) {
      console.error("Error adding account:", error);
      message.error("Đã có lỗi xảy ra khi thêm tài khoản!");
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      username: record.username,
      fullname: record.fullname,
      email: record.email,
      role: record.rawRole.toString(),
      status: record.status,
    });
    setIsEditModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedAccount = {
        userName: values.username,
        fullName: values.fullname,
        email: values.email,
        role: parseInt(values.role),
        status: values.status === "Active" ? 1 : 0,
      };

      const response = await fetch(
        `http://localhost:8080/api/accounts/${values.username}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAccount),
        }
      );

      if (response.ok) {
        message.success("Sửa tài khoản thành công!");
        setIsEditModalVisible(false);
        fetchAccounts();
        setSelectedRowKeys([]);
        setSelectedRows([]);
      } else {
        message.error("Sửa tài khoản thất bại!");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      message.error("Đã có lỗi xảy ra khi sửa tài khoản!");
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/accounts/${record.username}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        message.success("Xóa tài khoản thành công!");
        fetchAccounts();
        setSelectedRowKeys([]);
        setSelectedRows([]);
      } else {
        message.error("Xóa tài khoản thất bại!");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      message.error("Đã có lỗi xảy ra khi xóa tài khoản!");
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterBy("username");
    fetchAccounts();
    setSelectedRowKeys([]);
    setSelectedRows([]);
    message.success("Đã đặt lại danh sách!");
  };

  const handleImportExcel = async (importedData) => {
    const newAccounts = importedData.map((item) => ({
      userName: item["Tên đăng nhập"],
      fullName: item["Tên tài khoản"],
      email: item["Email"],
      role: mapRoleToNumber(item["Vai trò"]),
      status: item["Trạng thái"] === "Active" ? 1 : 0,
      password: "default123",
    }));

    try {
      for (const account of newAccounts) {
        await fetch("http://localhost:8080/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(account),
        });
      }
      message.success("Nhập dữ liệu từ Excel thành công!");
      fetchAccounts();
    } catch (error) {
      console.error("Error importing accounts:", error);
      message.error("Đã có lỗi xảy ra khi nhập dữ liệu từ Excel!");
    }
  };

  const mapRoleToNumber = (role) => {
    switch (role) {
      case "Nhân viên nhập":
        return 1;
      case "Nhân viên xuất":
        return 2;
      case "Quản lý kho":
        return 3;
      default:
        return 0;
    }
  };

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

  const exportData = filteredData.map((item) => ({
    "Tên tài khoản": item.fullname,
    "Tên đăng nhập": item.username,
    Email: item.email,
    "Vai trò": item.role,
    "Trạng thái": item.status,
  }));

  return (
    <div className="p-4">
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
            className="w-40 h-[50px]"
          >
            <Option value="username">Tên đăng nhập</Option>
            <Option value="fullname">Tên tài khoản</Option>
            <Option value="email">Email</Option>
            <Option value="role">Vai trò</Option>
            <Option value="status">Trạng thái</Option>
          </Select>
        </div>

        <ActionButtons
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReset={handleReset}
          onImport={handleImportExcel}
          isMobile={isMobile}
          selectedRows={selectedRows}
          exportData={exportData}
        />
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 7 }}
        rowKey="id"
        bordered
        loading={loading}
        rowSelection={rowSelection}
      />

      <Modal
        title="Thêm tài khoản"
        visible={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={() => setIsAddModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="Tên tài khoản"
            rules={[
              { required: true, message: "Vui lòng nhập tên tài khoản!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Option value="0">Admin</Option>
              <Option value="1">Nhân viên nhập</Option>
              <Option value="2">Nhân viên xuất</Option>
              <Option value="3">Quản lý kho</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sửa tài khoản"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="Tên tài khoản"
            rules={[
              { required: true, message: "Vui lòng nhập tên tài khoản!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Option value="0">Admin</Option>
              <Option value="1">Nhân viên nhập</Option>
              <Option value="2">Nhân viên xuất</Option>
              <Option value="3">Quản lý kho</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Accounts;
