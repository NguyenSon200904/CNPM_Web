import { useState, useEffect, useRef } from "react";
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
import api from "../api";
import * as XLSX from "xlsx";

const { Option } = Select;

const Product = () => {
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("maSanPham");
  const [loaiSanPham, setLoaiSanPham] = useState("TẤT_CẢ"); // Mặc định là "TẤT_CẢ"
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]); // Mảng các chuỗi (key)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { loaiSanPham };
        const response = await api.get("http://localhost:8080/api/products", {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (Array.isArray(response.data)) {
          // Sửa response.products thành response.data
          const formattedProducts = response.data.map((item, index) => ({
            key: item.maSanPham || index,
            maSanPham: item.maSanPham,
            tenSanPham: item.tenSanPham,
            soLuong: item.soLuong,
            gia: item.gia,
            loaiSanPham: item.loaiSanPham,
            tenCpu: item.tenCpu || "N/A",
            heDieuHanh: item.heDieuHanh || "N/A",
            doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
            ram: item.ram || "N/A",
            rom: item.rom || "N/A",
          }));
          setProducts(formattedProducts);
        } else {
          throw new Error("Dữ liệu trả về không phải là mảng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        } else {
          message.error("Không thể tải danh sách sản phẩm!");
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loaiSanPham]);

  const filteredProducts = products.filter((item) =>
    item[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys: selectedProducts, // Sửa selectedProducts thành selectedRowKeys
    onChange: (newSelectedRowKeys) => {
      setSelectedProducts(newSelectedRowKeys);
    },
  };

  // Định nghĩa các cột cơ bản (không bao gồm cột "Loại sản phẩm")
  const baseColumns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "maSanPham", // Sửa productsIndex thành dataIndex
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
    { title: "Bộ nhớ", dataIndex: "rom", key: "rom", responsive: ["lg"] },
  ];

  // Định nghĩa cột "Loại sản phẩm" (luôn ở cuối)
  const loaiSanPhamColumn = {
    title: "Loại sản phẩm",
    dataIndex: "loaiSanPham",
    key: "loaiSanPham",
    responsive: ["lg"],
  };

  // Định nghĩa cột bổ sung dựa trên loaiSanPham
  const additionalColumns = {
    MAY_TINH: [
      { title: "RAM", dataIndex: "ram", key: "ram", responsive: ["lg"] },
    ],
    DIEN_THOAI: [
      {
        title: "Hệ điều hành",
        dataIndex: "heDieuHanh",
        key: "heDieuHanh",
        responsive: ["md"],
        render: (text) => text || "N/A",
      },
    ],
    TẤT_CẢ: [
      { title: "RAM", dataIndex: "ram", key: "ram", responsive: ["lg"] },
      {
        title: "Hệ điều hành",
        dataIndex: "heDieuHanh",
        key: "heDieuHanh",
        responsive: ["md"],
        render: (text) => text || "N/A",
      },
    ],
  };

  // Tạo danh sách cột động, đảm bảo "Loại sản phẩm" luôn ở cuối
  const columns = [
    ...baseColumns,
    ...(additionalColumns[loaiSanPham] || []),
    loaiSanPhamColumn,
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
        loaiSanPham: values.loaiSanPham || "Computer",
      };

      await api.post("http://localhost:8080/api/products", newProduct);
      message.success("Thêm sản phẩm thành công!");
      setIsAddModalOpen(false);
      form.resetFields();

      const params = { loaiSanPham };
      const response = await api.get("http://localhost:8080/api/products", {
        params,
      });
      setProducts(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuong,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          tenCpu: item.tenCpu || "N/A",
          heDieuHanh: item.heDieuHanh || "N/A",
          doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
          ram: item.ram || "N/A",
          rom: item.rom || "N/A",
        }))
      );
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      message.error("Thêm sản phẩm thất bại!");
    }
  };

  const handleEdit = () => {
    if (selectedProducts.length !== 1) {
      message.warning("Vui lòng chọn đúng 1 sản phẩm để sửa!");
      return;
    }
    const selected = products.find((item) => item.key === selectedProducts[0]);
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
        loaiSanPham: selectedProduct.loaiSanPham,
      };

      await api.put(
        `http://localhost:8080/api/products/${selectedProduct.maSanPham}`,
        updatedProduct
      );
      message.success("Sửa sản phẩm thành công!");
      setIsEditModalOpen(false);
      form.resetFields();

      const params = { loaiSanPham };
      const response = await api.get("http://localhost:8080/api/products", {
        params,
      });
      setProducts(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuong,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          tenCpu: item.tenCpu || "N/A",
          heDieuHanh: item.heDieuHanh || "N/A",
          doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
          ram: item.ram || "N/A",
          rom: item.rom || "N/A",
        }))
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Lỗi khi sửa sản phẩm:", error);
      message.error("Sửa sản phẩm thất bại!");
    }
  };

  const handleDelete = async () => {
    if (selectedProducts.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm để xóa!");
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map((key) =>
          api.delete(`http://localhost:8080/api/products/${key}`)
        )
      );
      message.success("Xóa sản phẩm thành công!");

      const params = { loaiSanPham };
      const response = await api.get("http://localhost:8080/api/products", {
        params,
      });
      setProducts(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuong,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          tenCpu: item.tenCpu || "N/A",
          heDieuHanh: item.heDieuHanh || "N/A",
          doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
          ram: item.ram || "N/A",
          rom: item.rom || "N/A",
        }))
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Xóa sản phẩm thất bại!");
    }
  };

  const handleViewDetail = () => {
    if (selectedProducts.length !== 1) {
      message.warning("Vui lòng chọn đúng 1 sản phẩm để xem chi tiết!");
      return;
    }
    const selected = products.find((item) => item.key === selectedProducts[0]);
    setSelectedProduct(selected);
    setIsViewModalOpen(true);
  };

  const handleExportExcel = () => {
    const exportProducts = filteredProducts.map((item) => {
      const baseProducts = {
        "Mã sản phẩm": item.maSanPham,
        "Tên sản phẩm": item.tenSanPham,
        "Số lượng": item.soLuong,
        "Đơn giá": item.gia,
        "Bộ nhớ": item.rom,
      };

      if (loaiSanPham === "MAY_TINH" || loaiSanPham === "TẤT_CẢ") {
        baseProducts["RAM"] =
          item.loaiSanPham === "Computer" ? item.ram : "N/A";
      }
      if (loaiSanPham === "DIEN_THOAI" || loaiSanPham === "TẤT_CẢ") {
        baseProducts["Hệ điều hành"] =
          item.loaiSanPham === "Phone" ? item.heDieuHanh : "N/A";
      }

      baseProducts["Loại sản phẩm"] = item.loaiSanPham;

      return baseProducts;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
    message.success("Xuất Excel thành công!");
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) {
      message.error("Vui lòng chọn file Excel!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          message.error("File Excel trống!");
          return;
        }

        const errors = [];
        const newSelectedProducts = [...selectedProducts];

        jsonData.forEach((row, index) => {
          const maSanPham = row["Mã sản phẩm"]?.toString();
          const tenSanPham = row["Tên sản phẩm"]?.toString();
          const soLuong = Number(row["Số lượng"]);
          const gia = Number(row["Đơn giá"]);
          const loaiSanPham = row["Loại sản phẩm"]?.toString();

          // Kiểm tra các trường bắt buộc
          if (
            !maSanPham ||
            !tenSanPham ||
            isNaN(soLuong) ||
            isNaN(gia) ||
            !loaiSanPham
          ) {
            errors.push(
              `Dòng ${
                index + 2
              }: Dữ liệu không hợp lệ (thiếu hoặc sai định dạng).`
            );
            return;
          }

          // Kiểm tra số lượng
          if (soLuong < 1) {
            errors.push(
              `Dòng ${
                index + 2
              }: Số lượng phải lớn hơn 0 (maSanPham: ${maSanPham}).`
            );
            return;
          }

          const product = products.find((p) => p.maSanPham === maSanPham);
          if (!product) {
            errors.push(
              `Dòng ${
                index + 2
              }: Sản phẩm không tồn tại (maSanPham: ${maSanPham}).`
            );
            return;
          }

          // Chỉ thêm maSanPham (key) vào newSelectedProducts
          if (!newSelectedProducts.includes(maSanPham)) {
            newSelectedProducts.push(maSanPham);
          }
        });

        // Cập nhật danh sách sản phẩm được chọn
        setSelectedProducts(newSelectedProducts);

        if (errors.length > 0) {
          message.warning(
            `Đã chọn thành công ${
              newSelectedProducts.length - selectedProducts.length
            } sản phẩm. Có ${errors.length} lỗi:\n${errors.join("\n")}`
          );
        } else {
          message.success(
            `Đã chọn thành công ${
              newSelectedProducts.length - selectedProducts.length
            } sản phẩm từ Excel!`
          );
        }
      } catch (error) {
        message.error("Lỗi khi đọc file Excel: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = null;
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
            <Option value="ram">RAM</Option>
            <Option value="rom">Bộ nhớ</Option>
            <Option value="heDieuHanh">Hệ điều hành</Option>
          </Select>
          <Select
            value={loaiSanPham}
            onChange={setLoaiSanPham}
            className="w-40 h-[50px]"
          >
            <Option value="TẤT_CẢ">Tất cả</Option>
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
                ref={fileInputRef}
              />
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                className="min-w-[100px] h-[50px]"
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
        dataSource={filteredProducts} // Sửa productsSource thành dataSource
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
          <Form.Item
            name="loaiSanPham"
            label="Loại sản phẩm"
            rules={[
              { required: true, message: "Vui lòng chọn loại sản phẩm!" },
            ]}
          >
            <Select>
              <Option value="Computer">Computer</Option>
              <Option value="Phone">Phone</Option>
            </Select>
          </Form.Item>
          <Form.Item name="tenCpu" label="CPU">
            <Input />
          </Form.Item>
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
          {selectedProduct?.loaiSanPham === "Computer" ? (
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
          const { OkBtn } = modalProps;
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
            {selectedProduct.loaiSanPham === "Computer" ? (
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
