/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Input, Select, Table, Modal, Form, Button, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import ActionButtons from "../components/ActionButtons";
import api from "../api";

const { Option } = Select;

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("username");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Đảm bảo selectedRows được sử dụng
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [form] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

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

  const mapRoleFromNumber = (role) => {
    if (typeof role === "number" || !isNaN(parseInt(role))) {
      switch (parseInt(role)) {
        case 0:
          return "Admin";
        case 1:
          return "Importer";
        case 2:
          return "Nhân viên xuất kho";
        case 3:
          return "Manager";
        default:
          return role;
      }
    }
    return role;
  };

  const fetchCurrentUser = async () => {
    try {
      setIsFetchingUser(true);
      const response = await api.get("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const role = mapRoleFromNumber(response.data.role);
      setCurrentUserRole(role);
      console.log("Current user role:", role);
    } catch (error) {
      console.error("Error fetching current user:", error);
      Modal.error({
        title: "Lỗi",
        content: "Không thể lấy thông tin người dùng!",
      });
    } finally {
      setIsFetchingUser(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await api.get("http://localhost:8080/api/accounts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const accounts = response.data;
      console.log("Dữ liệu từ /accounts:", accounts);
      const formattedData = accounts.map((account, index) => ({
        id: index + 1,
        username: account.userName,
        fullname: account.fullName,
        email: account.email,
        role: account.role,
        status: mapStatus(account.status),
        rawRole: account.role,
        rawStatus: account.status,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      Modal.error({
        title: "Lỗi",
        content:
          "Lỗi khi tải danh sách tài khoản: " +
          (error.response?.data?.error || error.message),
      });
    } finally {
      setLoading(false);
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
    type: "checkbox",
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
        role: values.role,
        status: values.status === "Active" ? 1 : 0,
      };

      await api.post("http://localhost:8080/api/accounts", newAccount, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      Modal.success({
        title: "Thành công",
        content: "Thêm tài khoản thành công!",
      });
      setIsAddModalVisible(false);
      fetchAccounts();
    } catch (error) {
      console.error("Error adding account:", error);
      Modal.error({
        title: "Lỗi",
        content:
          "Đã có lỗi xảy ra khi thêm tài khoản: " +
          (error.response?.data?.error || error.message),
      });
    }
  };

  const handleEdit = () => {
    if (selectedRows.length !== 1) {
      Modal.warning({
        title: "Cảnh báo",
        content: "Vui lòng chọn đúng 1 tài khoản để sửa!",
      });
      return;
    }
    const record = selectedRows[0];
    form.setFieldsValue({
      username: record.username,
      fullname: record.fullname,
      email: record.email,
      role: record.rawRole,
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
        role: values.role,
        status: values.status === "Active" ? 1 : 0,
      };

      await api.put(
        `http://localhost:8080/api/accounts/${values.username}`,
        updatedAccount,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      Modal.success({
        title: "Thành công",
        content: "Sửa tài khoản thành công!",
      });
      setIsEditModalVisible(false);
      fetchAccounts();
      setSelectedRowKeys([]);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error updating account:", error);
      Modal.error({
        title: "Lỗi",
        content:
          "Đã có lỗi xảy ra khi sửa tài khoản: " +
          (error.response?.data?.error || error.message),
      });
    }
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      Modal.warning({
        title: "Cảnh báo",
        content: "Vui lòng chọn ít nhất 1 tài khoản để xóa!",
      });
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa ${selectedRows.length} tài khoản đã chọn không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await Promise.all(
            selectedRows.map((record) =>
              api.delete(
                `http://localhost:8080/api/accounts/${record.username}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              )
            )
          );
          Modal.success({
            title: "Thành công",
            content: `Xóa ${selectedRows.length} tài khoản thành công!`,
          });
          fetchAccounts();
          setSelectedRowKeys([]);
          setSelectedRows([]);
        } catch (error) {
          console.error("Error deleting accounts:", error);
          Modal.error({
            title: "Lỗi",
            content:
              "Đã có lỗi xảy ra khi xóa tài khoản: " +
              (error.response?.data?.error || error.message),
          });
        }
      },
    });
  };

  const handleReset = () => {
    console.log("Current user role in handleReset:", currentUserRole);
    if (isFetchingUser) {
      Modal.warning({
        title: "Cảnh báo",
        content: "Đang tải thông tin người dùng, vui lòng chờ!",
      });
      return;
    }
    if (currentUserRole !== "Admin") {
      Modal.error({
        title: "Lỗi",
        content: "Chỉ admin mới có thể đặt lại mật khẩu!",
      });
      return;
    }
    if (selectedRows.length !== 1) {
      Modal.warning({
        title: "Cảnh báo",
        content: "Vui lòng chọn đúng 1 tài khoản để đặt lại mật khẩu!",
      });
      return;
    }
    resetPasswordForm.resetFields();
    setIsResetPasswordModalVisible(true);
  };

  const handleResetPasswordOk = async () => {
    try {
      const values = await resetPasswordForm.validateFields();
      const { newPassword, confirmPassword } = values;

      if (newPassword !== confirmPassword) {
        Modal.error({
          title: "Lỗi",
          content: "Mật khẩu xác nhận không khớp!",
        });
        return;
      }

      const username = selectedRows[0].username;
      await api.put(
        `http://localhost:8080/api/accounts/${username}/reset-password`,
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      Modal.success({
        title: "Thành công",
        content: `Đặt lại mật khẩu cho tài khoản ${username} thành công!`,
      });
      setIsResetPasswordModalVisible(false);
      setSelectedRowKeys([]);
      setSelectedRows([]);
    } catch (error) {
      console.error("Error resetting password:", error);
      Modal.error({
        title: "Lỗi",
        content:
          "Đã có lỗi xảy ra khi đặt lại mật khẩu: " +
          (error.response?.data?.error || error.message),
      });
    }
  };

  const handleImportExcel = async (importedData) => {
    const newAccounts = importedData.map((item) => ({
      userName: item["Tên đăng nhập"],
      fullName: item["Tên tài khoản"],
      email: item["Email"],
      role: item["Vai trò"],
      status: item["Trạng thái"] === "Active" ? 1 : 0,
      password: "default123",
    }));

    try {
      for (const account of newAccounts) {
        await api.post("http://localhost:8080/api/accounts", account, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      }
      Modal.success({
        title: "Thành công",
        content: "Nhập dữ liệu từ Excel thành công!",
      });
      fetchAccounts();
    } catch (error) {
      console.error("Error importing accounts:", error);
      Modal.error({
        title: "Lỗi",
        content:
          "Đã có lỗi xảy ra khi nhập dữ liệu từ Excel: " +
          (error.response?.data?.error || error.message),
      });
    }
  };

  const columns = [
    {
      title: "Tên tài khoản",
      dataIndex: "fullname",
      key: "fullname",
      responsive: ["sm"],
      ellipsis: true,
    },
    { title: "Tên đăng nhập", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      responsive: ["md"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      responsive: ["md"],
    },
  ];

  const expandedRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Tên tài khoản:</strong> {record.fullname}
      </p>
      <p>
        <strong>Tên đăng nhập:</strong> {record.username}
      </p>
      <p>
        <strong>Email:</strong> {record.email}
      </p>
      <p>
        <strong>Vai trò:</strong> {record.role}
      </p>
      <p>
        <strong>Trạng thái:</strong> {record.status}
      </p>
    </div>
  );

  const exportData = filteredData.map((item) => ({
    "Tên tài khoản": item.fullname,
    "Tên đăng nhập": item.username,
    Email: item.email,
    "Vai trò": item.role,
    "Trạng thái": item.status,
  }));

  return (
    <div className="relative">
      {/* Nút mở sidebar trên mobile */}
      {isMobile && (
        <Button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-10 h-12 w-12 text-base bg-blue-500 text-white rounded-lg flex items-center justify-center"
        >
          <MenuOutlined />
        </Button>
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
          TÀI KHOẢN
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
            className="w-full sm:w-60 md:w-80 h-12 text-base rounded-lg"
          />
          <Select
            value={filterBy}
            onChange={setFilterBy}
            className="w-full sm:w-40 h-12 text-base rounded-lg"
          >
            <Option value="username">Tên đăng nhập</Option>
            <Option value="fullname">Tên tài khoản</Option>
            <Option value="email">Email</Option>
            <Option value="role">Vai trò</Option>
            <Option value="status">Trạng thái</Option>
          </Select>
          <div className="w-full sm:w-auto">
            <ActionButtons
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReset={handleReset}
              onImport={handleImportExcel}
              isMobile={isMobile}
              selectedRows={selectedRows} // Đảm bảo selectedRows được truyền vào
              exportData={exportData}
              isResetDisabled={isFetchingUser}
            />
          </div>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="id"
          bordered
          loading={loading}
          rowSelection={rowSelection}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          scroll={{ x: isMobile ? 300 : "max-content" }}
          className="custom-table"
        />

        <Modal
          title="Thêm tài khoản"
          open={isAddModalVisible}
          onOk={handleAddOk}
          onCancel={() => setIsAddModalVisible(false)}
          okText="Thêm"
          cancelText="Hủy"
          width={isMobile ? "90%" : 600}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input className="h-12 text-base rounded-lg" />
            </Form.Item>
            <Form.Item
              name="fullname"
              label="Tên tài khoản"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
              ]}
            >
              <Input className="h-12 text-base rounded-lg" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input className="h-12 text-base rounded-lg" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select className="h-12 text-base rounded-lg">
                <Option value="Admin">Admin</Option>
                <Option value="Manager">Quản lý kho</Option>
                <Option value="Importer">Importer</Option>
                <Option value="Nhân viên xuất kho">Nhân viên xuất kho</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select className="h-12 text-base rounded-lg">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Sửa tài khoản"
          open={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={() => setIsEditModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          width={isMobile ? "90%" : 600}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input disabled className="h-12 text-base rounded-lg" />
            </Form.Item>
            <Form.Item
              name="fullname"
              label="Tên tài khoản"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
              ]}
            >
              <Input className="h-12 text-base rounded-lg" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input className="h-12 text-base rounded-lg" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select className="h-12 text-base rounded-lg">
                <Option value="Admin">Admin</Option>
                <Option value="Manager">Quản lý kho</Option>
                <Option value="Importer">Importer</Option>
                <Option value="Nhân viên xuất kho">Nhân viên xuất kho</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select className="h-12 text-base rounded-lg">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={`Đặt lại mật khẩu cho tài khoản ${
            selectedRows[0]?.username || ""
          }`}
          open={isResetPasswordModalVisible}
          onOk={handleResetPasswordOk}
          onCancel={() => setIsResetPasswordModalVisible(false)}
          okText="Xác nhận"
          cancelText="Hủy"
          width={isMobile ? "90%" : 500}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <Form form={resetPasswordForm} layout="vertical">
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password className="h-12 text-base rounded-lg" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password className="h-12 text-base rounded-lg" />
            </Form.Item>
          </Form>
        </Modal>
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

export default Accounts;
