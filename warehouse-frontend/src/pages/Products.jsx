import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Table,
  message,
  Modal,
  Form,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";

const { Option } = Select;

const Product = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("maSanPham");
  const [loaiSanPham, setLoaiSanPham] = useState("MAY_TINH");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/products", {
          params: { loaiSanPham },
        });
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map((item, index) => ({
            key: item.maSanPham || index,
            maSanPham: item.maSanPham,
            tenSanPham: item.tenSanPham,
            soLuong: item.soLuong,
            gia: item.gia,
            loaiSanPham: item.loaiSanPham,
            ...(loaiSanPham === "MAY_TINH"
              ? {
                  tenCpu: item.tenCpu || "N/A",
                  ram: item.ram || "N/A",
                  rom: item.rom || "N/A",
                }
              : {
                  heDieuHanh: item.heDieuHanh || "N/A",
                  doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
                  ram: item.ram || "N/A",
                  rom: item.rom || "N/A",
                }),
          }));
          setData(formattedData);
        } else {
          throw new Error("Dữ liệu trả về không phải là mảng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        message.error("Không thể tải danh sách sản phẩm!");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loaiSanPham]);

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
    {
      title: "Mã sản phẩm",
      dataIndex: "maSanPham",
      key: "maSanPham",
      responsive: ["sm"],
    },
    { title: "Tên sản phẩm", dataIndex: "tenSanPham", key: "tenSanPham" },
    { title: "Số lượng", dataIndex: "soLuong", key: "soLuong" },
    {
      title: "Đơn giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia) => `${gia?.toLocaleString() || 0}đ`,
    },
    ...(loaiSanPham === "MAY_TINH"
      ? [
          {
            title: "CPU",
            dataIndex: "tenCpu",
            key: "tenCpu",
            responsive: ["md"],
          },
        ]
      : [
          {
            title: "Hệ điều hành",
            dataIndex: "heDieuHanh",
            key: "heDieuHanh",
            responsive: ["md"],
          },
          {
            title: "Độ phân giải camera",
            dataIndex: "doPhanGiaiCamera",
            key: "doPhanGiaiCamera",
            responsive: ["md"],
          },
        ]),
    { title: "RAM", dataIndex: "ram", key: "ram", responsive: ["lg"] },
    { title: "Bộ nhớ", dataIndex: "rom", key: "rom", responsive: ["lg"] },
    {
      title: "Loại sản phẩm",
      dataIndex: "loaiSanPham",
      key: "loaiSanPham",
      responsive: ["lg"],
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setIsAddModalOpen(true);
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      const newProduct = {
        ...values,
        loaiSanPham: loaiSanPham === "MAY_TINH" ? "Computer" : "Phone",
      };

      await axios.post("http://localhost:8080/api/products", newProduct);
      message.success("Thêm sản phẩm thành công!");
      setIsAddModalOpen(false);
      form.resetFields();

      const response = await axios.get("http://localhost:8080/api/products", {
        params: { loaiSanPham },
      });
      setData(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuong,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          ...(loaiSanPham === "MAY_TINH"
            ? { tenCpu: item.tenCpu, ram: item.ram, rom: item.rom }
            : {
                heDieuHanh: item.heDieuHanh,
                doPhanGiaiCamera: item.doPhanGiaiCamera,
                ram: item.ram,
                rom: item.rom,
              }),
        }))
      );
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      message.error("Thêm sản phẩm thất bại!");
    }
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Vui lòng chọn đúng 1 sản phẩm để sửa!");
      return;
    }
    const selected = data.find((item) => item.key === selectedRowKeys[0]);
    setSelectedProduct(selected);
    form.setFieldsValue(selected);
    setIsEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedProduct = {
        ...values,
        maSanPham: selectedProduct.maSanPham,
        loaiSanPham: loaiSanPham === "MAY_TINH" ? "Computer" : "Phone",
      };

      await axios.put(
        `http://localhost:8080/api/products/${selectedProduct.maSanPham}`,
        updatedProduct
      );
      message.success("Sửa sản phẩm thành công!");
      setIsEditModalOpen(false);
      form.resetFields();

      const response = await axios.get("http://localhost:8080/api/products", {
        params: { loaiSanPham },
      });
      setData(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuong,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          ...(loaiSanPham === "MAY_TINH"
            ? { tenCpu: item.tenCpu, ram: item.ram, rom: item.rom }
            : {
                heDieuHanh: item.heDieuHanh,
                doPhanGiaiCamera: item.doPhanGiaiCamera,
                ram: item.ram,
                rom: item.rom,
              }),
        }))
      );
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi khi sửa sản phẩm:", error);
      message.error("Sửa sản phẩm thất bại!");
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm để xóa!");
      return;
    }

    try {
      await Promise.all(
        selectedRowKeys.map((key) =>
          axios.delete(`http://localhost:8080/api/products/${key}`)
        )
      );
      message.success("Xóa sản phẩm thành công!");

      const response = await axios.get("http://localhost:8080/api/products", {
        params: { loaiSanPham },
      });
      setData(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuong,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          ...(loaiSanPham === "MAY_TINH"
            ? { tenCpu: item.tenCpu, ram: item.ram, rom: item.rom }
            : {
                heDieuHanh: item.heDieuHanh,
                doPhanGiaiCamera: item.doPhanGiaiCamera,
                ram: item.ram,
                rom: item.rom,
              }),
        }))
      );
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Xóa sản phẩm thất bại!");
    }
  };

  const handleViewDetail = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Vui lòng chọn đúng 1 sản phẩm để xem chi tiết!");
      return;
    }
    const selected = data.find((item) => item.key === selectedRowKeys[0]);
    setSelectedProduct(selected);
    setIsViewModalOpen(true);
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map((item) => ({
      "Mã sản phẩm": item.maSanPham,
      "Tên sản phẩm": item.tenSanPham,
      "Số lượng": item.soLuong,
      "Đơn giá": item.gia,
      ...(loaiSanPham === "MAY_TINH"
        ? { CPU: item.tenCpu, RAM: item.ram, "Bộ nhớ": item.rom }
        : {
            "Hệ điều hành": item.heDieuHanh,
            "Độ phân giải camera": item.doPhanGiaiCamera,
            RAM: item.ram,
            "Bộ nhớ": item.rom,
          }),
      "Loại sản phẩm": item.loaiSanPham,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
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
            const newProduct = {
              maSanPham: item["Mã sản phẩm"],
              tenSanPham: item["Tên sản phẩm"],
              soLuong: item["Số lượng"],
              gia: item["Đơn giá"],
              loaiSanPham: loaiSanPham === "MAY_TINH" ? "Computer" : "Phone",
              ...(loaiSanPham === "MAY_TINH"
                ? { tenCpu: item["CPU"], ram: item["RAM"], rom: item["Bộ nhớ"] }
                : {
                    heDieuHanh: item["Hệ điều hành"],
                    doPhanGiaiCamera: item["Độ phân giải camera"],
                    ram: item["RAM"],
                    rom: item["Bộ nhớ"],
                  }),
            };
            await axios.post("http://localhost:8080/api/products", newProduct);
          })
        );
        message.success("Nhập Excel thành công!");

        const response = await axios.get("http://localhost:8080/api/products", {
          params: { loaiSanPham },
        });
        setData(
          response.data.map((item, index) => ({
            key: item.maSanPham || index,
            maSanPham: item.maSanPham,
            tenSanPham: item.tenSanPham,
            soLuong: item.soLuong,
            gia: item.gia,
            loaiSanPham: item.loaiSanPham,
            ...(loaiSanPham === "MAY_TINH"
              ? { tenCpu: item.tenCpu, ram: item.ram, rom: item.rom }
              : {
                  heDieuHanh: item.heDieuHanh,
                  doPhanGiaiCamera: item.doPhanGiaiCamera,
                  ram: item.ram,
                  rom: item.rom,
                }),
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
      <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>

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
            <Option value="maSanPham">Mã sản phẩm</Option>
            <Option value="tenSanPham">Tên sản phẩm</Option>
            <Option value="soLuong">Số lượng</Option>
            <Option value="gia">Đơn giá</Option>
            {loaiSanPham === "MAY_TINH" ? (
              <Option value="tenCpu">CPU</Option>
            ) : (
              <>
                <Option value="heDieuHanh">Hệ điều hành</Option>
                <Option value="doPhanGiaiCamera">Độ phân giải camera</Option>
              </>
            )}
            <Option value="ram">RAM</Option>
            <Option value="rom">Bộ nhớ</Option>
            {/* <Option value="loaiSanPham">Loại sản phẩm</Option> */}
          </Select>
          <Select
            value={loaiSanPham}
            onChange={setLoaiSanPham}
            className="w-40 h-[50px]"
          >
            <Option value="MAY_TINH">Computer</Option>
            <Option value="DIEN_THOAI">Phone</Option>
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
                icon={<EyeOutlined />}
                className="min-w-[100px] h-[50px]"
                onClick={handleViewDetail}
              >
                Xem chi tiết
              </Button>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                className="min-w-[100px] h-[50px]"
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
                  className="min-w-[100px] h-[50px]"
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
        rowKey="key"
        bordered
        loading={loading}
      />

      <Modal
        title="Thêm sản phẩm mới"
        open={isAddModalOpen}
        onOk={handleAddOk}
        onCancel={() => setIsAddModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="maSanPham"
            label="Mã sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tenSanPham"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gia"
            label="Đơn giá"
            rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="soLuong"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          {loaiSanPham === "MAY_TINH" ? (
            <>
              <Form.Item name="tenCpu" label="CPU">
                <Input />
              </Form.Item>
              <Form.Item name="ram" label="RAM">
                <Input />
              </Form.Item>
              <Form.Item name="rom" label="Bộ nhớ">
                <Input />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="heDieuHanh" label="Hệ điều hành">
                <Input />
              </Form.Item>
              <Form.Item name="doPhanGiaiCamera" label="Độ phân giải camera">
                <Input />
              </Form.Item>
              <Form.Item name="ram" label="RAM">
                <Input />
              </Form.Item>
              <Form.Item name="rom" label="Bộ nhớ">
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        title="Sửa sản phẩm"
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="tenSanPham"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gia"
            label="Đơn giá"
            rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="soLuong"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          {loaiSanPham === "MAY_TINH" ? (
            <>
              <Form.Item name="tenCpu" label="CPU">
                <Input />
              </Form.Item>
              <Form.Item name="ram" label="RAM">
                <Input />
              </Form.Item>
              <Form.Item name="rom" label="Bộ nhớ">
                <Input />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="heDieuHanh" label="Hệ điều hành">
                <Input />
              </Form.Item>
              <Form.Item name="doPhanGiaiCamera" label="Độ phân giải camera">
                <Input />
              </Form.Item>
              <Form.Item name="ram" label="RAM">
                <Input />
              </Form.Item>
              <Form.Item name="rom" label="Bộ nhớ">
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        title="Chi tiết sản phẩm"
        open={isViewModalOpen}
        onOk={() => setIsViewModalOpen(false)}
        onCancel={() => setIsViewModalOpen(false)}
        footer={(modalProps) => {
          const { OkBtn } = modalProps; // Sử dụng OkBtn
          return <OkBtn />;
        }}
      >
        {selectedProduct && (
          <div>
            <p>
              <strong>Mã sản phẩm:</strong> {selectedProduct.maSanPham}
            </p>
            <p>
              <strong>Tên sản phẩm:</strong> {selectedProduct.tenSanPham}
            </p>
            <p>
              <strong>Đơn giá:</strong> {selectedProduct.gia?.toLocaleString()}đ
            </p>
            <p>
              <strong>Số lượng:</strong> {selectedProduct.soLuong}
            </p>
            {loaiSanPham === "MAY_TINH" ? (
              <>
                <p>
                  <strong>CPU:</strong> {selectedProduct.tenCpu}
                </p>
                <p>
                  <strong>RAM:</strong> {selectedProduct.ram}
                </p>
                <p>
                  <strong>Bộ nhớ:</strong> {selectedProduct.rom}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Hệ điều hành:</strong> {selectedProduct.heDieuHanh}
                </p>
                <p>
                  <strong>Độ phân giải camera:</strong>{" "}
                  {selectedProduct.doPhanGiaiCamera}
                </p>
                <p>
                  <strong>RAM:</strong> {selectedProduct.ram}
                </p>
                <p>
                  <strong>Bộ nhớ:</strong> {selectedProduct.rom}
                </p>
              </>
            )}
            <p>
              <strong>Loại sản phẩm:</strong> {selectedProduct.loaiSanPham}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Product;
