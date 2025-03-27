import { useState, useEffect } from "react";
import { Button, Input, Select, Table, message, Modal, Form } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import api from "../api";
import * as XLSX from "xlsx";

const { Option } = Select;

const Supplier = () => {
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

  // Lấy dữ liệu từ backend
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
        message.error("Không thể tải danh sách nhà cung cấp!");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    { title: "Tên nhà cung cấp", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
  ];

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
      message.success("Thêm nhà cung cấp thành công!");
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
      message.error("Thêm nhà cung cấp thất bại!");
    }
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Vui lòng chọn đúng 1 nhà cung cấp để sửa!");
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
      message.success("Sửa nhà cung cấp thành công!");
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
      message.error("Sửa nhà cung cấp thất bại!");
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 nhà cung cấp để xóa!");
      return;
    }

    try {
      await Promise.all(
        selectedRowKeys.map((key) =>
          api.delete(`http://localhost:8080/api/suppliers/${key}`)
        )
      );
      message.success("Xóa nhà cung cấp thành công!");

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
      message.error("Xóa nhà cung cấp thất bại!");
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
    message.success("Xuất Excel thành công!");
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        await Promise.all(
          jsonData.map(async (item) => {
            const newSupplier = {
              maNhaCungCap: item["Mã NCC"],
              tenNhaCungCap: item["Tên nhà cung cấp"],
              soDienThoai: item["Số điện thoại"],
              diaChi: item["Địa chỉ"],
            };
            await api.post(
              "http://localhost:8080/api/suppliers",
              newSupplier
            );
          })
        );
        message.success("Nhập Excel thành công!");

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
        console.error("Lỗi khi nhập Excel:", error);
        message.error("Nhập Excel thất bại!");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý nhà cung cấp</h2>

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
            <Option value="id">Mã NCC</Option>
            <Option value="name">Tên nhà cung cấp</Option>
            <Option value="phone">Số điện thoại</Option>
            <Option value="address">Địa chỉ</Option>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="min-w-[100px] h-[50px]"
            onClick={handleAdd}
          >
            Thêm
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="min-w-[100px] h-[50px]"
            onClick={handleEdit}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            className="min-w-[100px] h-[50px]"
            onClick={handleDelete}
          >
            Xóa
          </Button>
          {!isMobile && (
            <>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                className="min-w-[120px] h-[50px]"
                onClick={handleExportExcel}
              >
                Xuất Excel
              </Button>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImportExcel}
                style={{ display: "none" }}
                id="import-excel"
              />
              <label htmlFor="import-excel">
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  className="min-w-[120px] h-[50px]"
                >
                  Nhập Excel
                </Button>
              </label>
            </>
          )}
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 7 }}
        rowKey="id"
        bordered
        loading={loading}
      />

      <Modal
        title="Thêm nhà cung cấp mới"
        open={isAddModalOpen}
        onOk={handleAddOk}
        onCancel={() => setIsAddModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label="Mã nhà cung cấp"
            rules={[
              { required: true, message: "Vui lòng nhập mã nhà cung cấp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên nhà cung cấp"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sửa nhà cung cấp"
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên nhà cung cấp"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Supplier;
