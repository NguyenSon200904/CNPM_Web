import { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Select,
  Table,
  message,
  Modal,
  Form,
  Drawer,
  Menu,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";
import api from "../api";
import * as XLSX from "xlsx";

const { Option } = Select;

const Supplier = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("id");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("http://localhost:8080/api/suppliers");
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map((item) => ({
            key: item.maNhaCungCap,
            id: item.maNhaCungCap,
            name: item.tenNhaCungCap,
            phone: item.soDienThoai,
            address: item.diaChi,
          }));
          setData(formattedData);
        } else {
          throw new Error("Dữ liệu trả về không phải là mảng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhà cung cấp:", error);
        messageApi.error("Không thể tải danh sách nhà cung cấp!");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [messageApi]);

  const filteredData = data.filter((item) =>
    item[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns = [
    { title: "Mã NCC", dataIndex: "id", key: "id" },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      responsive: ["sm"],
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
    },
  ];

  const expandedRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Mã NCC:</strong> {record.id}
      </p>
      <p>
        <strong>Tên nhà cung cấp:</strong> {record.name}
      </p>
      <p>
        <strong>Số điện thoại:</strong> {record.phone}
      </p>
      <p>
        <strong>Địa chỉ:</strong> {record.address}
      </p>
    </div>
  );

  const handleAdd = () => {
    form.resetFields();
    setIsAddModalOpen(true);
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      const newSupplier = {
        maNhaCungCap: values.id,
        tenNhaCungCap: values.name,
        soDienThoai: values.phone,
        diaChi: values.address,
      };

      await api.post("http://localhost:8080/api/suppliers", newSupplier);
      messageApi.success("Thêm nhà cung cấp thành công!");
      setIsAddModalOpen(false);
      form.resetFields();

      const response = await api.get("http://localhost:8080/api/suppliers");
      setData(
        response.data.map((item) => ({
          key: item.maNhaCungCap,
          id: item.maNhaCungCap,
          name: item.tenNhaCungCap,
          phone: item.soDienThoai,
          address: item.diaChi,
        }))
      );
    } catch (error) {
      console.error("Lỗi khi thêm nhà cung cấp:", error);
      messageApi.error("Thêm nhà cung cấp thất bại!");
    }
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) {
      messageApi.warning("Vui lòng chọn đúng 1 nhà cung cấp để sửa!");
      return;
    }
    const selected = data.find((item) => item.key === selectedRowKeys[0]);
    setSelectedSupplier(selected);
    form.setFieldsValue(selected);
    setIsEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedSupplier = {
        maNhaCungCap: selectedSupplier.id,
        tenNhaCungCap: values.name,
        soDienThoai: values.phone,
        diaChi: values.address,
      };

      await api.put(
        `http://localhost:8080/api/suppliers/${selectedSupplier.id}`,
        updatedSupplier
      );
      messageApi.success("Sửa nhà cung cấp thành công!");
      setIsEditModalOpen(false);
      form.resetFields();

      const response = await api.get("http://localhost:8080/api/suppliers");
      setData(
        response.data.map((item) => ({
          key: item.maNhaCungCap,
          id: item.maNhaCungCap,
          name: item.tenNhaCungCap,
          phone: item.soDienThoai,
          address: item.diaChi,
        }))
      );
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi khi sửa nhà cung cấp:", error);
      messageApi.error("Sửa nhà cung cấp thất bại!");
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      messageApi.warning("Vui lòng chọn ít nhất 1 nhà cung cấp để xóa!");
      return;
    }

    try {
      await Promise.all(
        selectedRowKeys.map((key) =>
          api.delete(`http://localhost:8080/api/suppliers/${key}`)
        )
      );
      messageApi.success("Xóa nhà cung cấp thành công!");

      const response = await api.get("http://localhost:8080/api/suppliers");
      setData(
        response.data.map((item) => ({
          key: item.maNhaCungCap,
          id: item.maNhaCungCap,
          name: item.tenNhaCungCap,
          phone: item.soDienThoai,
          address: item.diaChi,
        }))
      );
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi khi xóa nhà cung cấp:", error);
      messageApi.error("Xóa nhà cung cấp thất bại!");
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map((item) => ({
      "Mã NCC": item.id,
      "Tên nhà cung cấp": item.name,
      "Số điện thoại": item.phone,
      "Địa chỉ": item.address,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
    XLSX.writeFile(workbook, "suppliers.xlsx");
    messageApi.success("Xuất Excel thành công!");
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) {
      messageApi.error("Vui lòng chọn file Excel!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          messageApi.error("File Excel trống!");
          return;
        }

        const errors = [];
        let successCount = 0;

        for (let index = 0; index < jsonData.length; index++) {
          const item = jsonData[index];
          const newSupplier = {
            maNhaCungCap: item["Mã NCC"]?.toString(),
            tenNhaCungCap: item["Tên nhà cung cấp"]?.toString(),
            soDienThoai: item["Số điện thoại"]?.toString(),
            diaChi: item["Địa chỉ"]?.toString(),
          };

          if (
            !newSupplier.maNhaCungCap ||
            !newSupplier.tenNhaCungCap ||
            !newSupplier.soDienThoai ||
            !newSupplier.diaChi
          ) {
            errors.push(
              `Dòng ${
                index + 2
              }: Dữ liệu không hợp lệ (thiếu hoặc sai định dạng).`
            );
            continue;
          }

          try {
            await api.post("http://localhost:8080/api/suppliers", newSupplier);
            successCount++;
          } catch (error) {
            errors.push(
              `Dòng ${index + 2}: Lỗi khi thêm nhà cung cấp (maNhaCungCap: ${
                newSupplier.maNhaCungCap
              }) - ${error.response?.data?.message || error.message}`
            );
          }
        }

        const response = await api.get("http://localhost:8080/api/suppliers");
        setData(
          response.data.map((item) => ({
            key: item.maNhaCungCap,
            id: item.maNhaCungCap,
            name: item.tenNhaCungCap,
            phone: item.soDienThoai,
            address: item.diaChi,
          }))
        );

        if (errors.length > 0) {
          messageApi.warning(
            `Đã nhập thành công ${successCount} nhà cung cấp. Có ${
              errors.length
            } lỗi:\n${errors.join("\n")}`
          );
        } else {
          messageApi.success(
            `Đã nhập thành công ${successCount} nhà cung cấp từ Excel!`
          );
        }
      } catch (error) {
        console.error("Lỗi khi đọc file Excel:", error);
        messageApi.error("Lỗi khi đọc file Excel: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="export" onClick={handleExportExcel}>
        <FileExcelOutlined /> Xuất Excel
      </Menu.Item>
      <Menu.Item key="import" onClick={() => fileInputRef.current.click()}>
        <FileExcelOutlined /> Nhập Excel
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="relative">
      {contextHolder}

      {/* Nút mở sidebar trên mobile */}
      {isMobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-10 h-12 w-12 text-base bg-blue-500 text-white"
        />
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
          QUẢN LÝ NHÀ CUNG CẤP
        </h2>

        <div className="flex flex-col gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Nhập từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 text-base"
            />
            <Select
              value={filterBy}
              onChange={setFilterBy}
              className="w-full sm:w-40 h-12 text-base"
            >
              <Option value="id">Mã NCC</Option>
              <Option value="name">Tên nhà cung cấp</Option>
              <Option value="phone">Số điện thoại</Option>
              <Option value="address">Địa chỉ</Option>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="min-w-[100px] h-12 text-base"
              onClick={handleAdd}
            >
              Thêm
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="min-w-[100px] h-12 text-base"
              onClick={handleEdit}
            >
              Sửa
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="min-w-[100px] h-12 text-base"
              onClick={handleDelete}
            >
              Xóa
            </Button>
            {isMobile ? (
              <Dropdown overlay={menu}>
                <Button className="min-w-[100px] h-12 text-base">
                  Thêm <DownOutlined />
                </Button>
              </Dropdown>
            ) : (
              <>
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  className="min-w-[120px] h-12 text-base"
                  onClick={handleExportExcel}
                >
                  Xuất Excel
                </Button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  className="min-w-[120px] h-12 text-base"
                  onClick={() => fileInputRef.current.click()}
                >
                  Nhập Excel
                </Button>
              </>
            )}
          </div>
        </div>

        <Table
          rowSelection={rowSelection}
          dataSource={filteredData}
          columns={columns}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{ pageSize: 6 }}
          rowKey="id"
          bordered
          loading={loading}
          scroll={{ x: isMobile ? 300 : "max-content" }}
          className="custom-table"
        />

        <Modal
          title="Thêm nhà cung cấp mới"
          open={isAddModalOpen}
          onOk={handleAddOk}
          onCancel={() => setIsAddModalOpen(false)}
          okButtonProps={{ className: "h-12 text-base" }}
          cancelButtonProps={{ className: "h-12 text-base" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="id"
              label="Mã nhà cung cấp"
              rules={[
                { required: true, message: "Vui lòng nhập mã nhà cung cấp!" },
              ]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Tên nhà cung cấp"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
              ]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Sửa nhà cung cấp"
          open={isEditModalOpen}
          onOk={handleEditOk}
          onCancel={() => setIsEditModalOpen(false)}
          okButtonProps={{ className: "h-12 text-base" }}
          cancelButtonProps={{ className: "h-12 text-base" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên nhà cung cấp"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
              ]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <style jsx>{`
        /* Điều chỉnh bảng */
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

        /* Ẩn sidebar trên mobile */
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

export default Supplier;
