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
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";
import api from "../api";
import * as XLSX from "xlsx";

const { Option } = Select;

const Product = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("maSanPham");
  const [loaiSanPham, setLoaiSanPham] = useState(null); // Mặc định là null (Tất cả)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Thêm state cho sidebar

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (loaiSanPham) {
          params.loai_san_pham = loaiSanPham;
        }
        const response = await api.get("http://localhost:8080/api/products", {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (Array.isArray(response.data)) {
          const formattedProducts = response.data.map((item, index) => ({
            key: item.maSanPham || index,
            maSanPham: item.maSanPham,
            tenSanPham: item.tenSanPham,
            soLuongCoTheNhap: item.soLuongCoTheNhap,
            gia: item.gia,
            loaiSanPham: item.loaiSanPham,
            xuatXu: item.xuatXu || "N/A",
            tenCpu: item.tenCpu || "N/A",
            heDieuHanh: item.heDieuHanh || "N/A",
            doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
            ram: item.ram || "N/A",
            rom: item.rom || "N/A",
            dungLuongPin: item.dungLuongPin || "N/A",
            kichThuocMan: item.kichThuocMan || "N/A",
            congSuatNguon: item.congSuatNguon || "N/A",
            maBoard: item.maBoard || "N/A",
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
        } else if (error.response && error.response.status === 500) {
          messageApi.error(
            "Lỗi server: Không thể tải danh sách sản phẩm. Vui lòng kiểm tra backend!"
          );
        } else {
          messageApi.error("Không thể tải danh sách sản phẩm!");
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const handleStorageChange = () => {
      const refreshTimestamp = localStorage.getItem("refreshProducts");
      if (refreshTimestamp) {
        fetchProducts();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Xử lý responsive
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("resize", handleResize);
    };
  }, [loaiSanPham, messageApi]);

  // Lọc dữ liệu dựa trên searchTerm và loaiSanPham
  const filteredProducts = products.filter((item) => {
    const matchesSearchTerm = item[filterBy]
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLoaiSanPham = !loaiSanPham || item.loaiSanPham === loaiSanPham;
    return matchesSearchTerm && matchesLoaiSanPham;
  });

  const rowSelection = {
    selectedRowKeys: selectedProducts,
    onChange: (newSelectedRowKeys) => {
      setSelectedProducts(newSelectedRowKeys);
    },
  };

  // Cột của bảng
  const baseColumns = [
    { title: "Mã sản phẩm", dataIndex: "maSanPham", key: "maSanPham" },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
      ellipsis: true,
    },
    {
      title: "Số lượng có thể nhập",
      dataIndex: "soLuongCoTheNhap",
      key: "soLuongCoTheNhap",
      responsive: ["sm"],
    },
    {
      title: "Đơn giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia) => `${gia?.toLocaleString() || 0}đ`,
      responsive: ["sm"],
    },
    {
      title: "Xuất xứ",
      dataIndex: "xuatXu",
      key: "xuatXu",
      responsive: ["md"],
    },
  ];

  const loaiSanPhamColumn = {
    title: "Loại sản phẩm",
    dataIndex: "loaiSanPham",
    key: "loaiSanPham",
    responsive: ["md"],
    render: (text) =>
      text === "MAYTINH"
        ? "Máy tính"
        : text === "DIENTHOAI"
        ? "Điện thoại"
        : text,
  };

  const additionalColumns = {
    MAYTINH: [
      { title: "RAM", dataIndex: "ram", key: "ram", responsive: ["lg"] },
      { title: "CPU", dataIndex: "tenCpu", key: "tenCpu", responsive: ["lg"] },
    ],
    DIENTHOAI: [
      {
        title: "Hệ điều hành",
        dataIndex: "heDieuHanh",
        key: "heDieuHanh",
        responsive: ["md"],
        render: (text) => text || "N/A",
      },
    ],
  };

  const columns = [
    ...baseColumns,
    ...(additionalColumns[loaiSanPham] || []),
    loaiSanPhamColumn,
  ];

  // Expanded row render (hiển thị chi tiết khi click trên mobile)
  const expandedRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Mã sản phẩm:</strong> {record.maSanPham}
      </p>
      <p>
        <strong>Tên sản phẩm:</strong> {record.tenSanPham}
      </p>
      <p>
        <strong>Số lượng có thể nhập:</strong> {record.soLuongCoTheNhap}
      </p>
      <p>
        <strong>Đơn giá:</strong> {record.gia?.toLocaleString() || 0}đ
      </p>
      <p>
        <strong>Loại sản phẩm:</strong>{" "}
        {record.loaiSanPham === "MAYTINH"
          ? "Máy tính"
          : record.loaiSanPham === "DIENTHOAI"
          ? "Điện thoại"
          : record.loaiSanPham}
      </p>
      <p>
        <strong>Xuất xứ:</strong> {record.xuatXu}
      </p>
      {record.loaiSanPham === "MAYTINH" && (
        <>
          <p>
            <strong>RAM:</strong> {record.ram}
          </p>
          <p>
            <strong>CPU:</strong> {record.tenCpu}
          </p>
        </>
      )}
      {record.loaiSanPham === "DIENTHOAI" && (
        <p>
          <strong>Hệ điều hành:</strong> {record.heDieuHanh || "N/A"}
        </p>
      )}
    </div>
  );

  const handleAdd = () => {
    form.resetFields();
    setSelectedProductType(null);
    setIsTypeModalOpen(true);
  };

  const handleTypeOk = () => {
    if (!selectedProductType) {
      messageApi.error("Vui lòng chọn loại sản phẩm!");
      return;
    }
    setIsTypeModalOpen(false);
    setIsAddModalOpen(true);
    form.setFieldsValue({
      loaiSanPham: selectedProductType,
    });
  };

  const handleTypeCancel = () => {
    setIsTypeModalOpen(false);
    setSelectedProductType(null);
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      const newProduct = {
        ...values,
        loaiSanPham: selectedProductType,
        gia:
          values.gia === "N/A" || !values.gia || isNaN(parseFloat(values.gia))
            ? 0
            : parseFloat(values.gia),
        trangThai:
          values.trangThai === "N/A" ||
          !values.trangThai ||
          isNaN(parseInt(values.trangThai))
            ? 1
            : parseInt(values.trangThai),
        soLuongCoTheNhap:
          values.soLuongCoTheNhap === "N/A" ||
          !values.soLuongCoTheNhap ||
          isNaN(parseInt(values.soLuongCoTheNhap))
            ? 0
            : parseInt(values.soLuongCoTheNhap),
        xuatXu: values.xuatXu || "N/A",
      };

      await api.post("http://localhost:8080/api/products", newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      messageApi.success("Thêm sản phẩm thành công!");
      setIsAddModalOpen(false);
      setSelectedProductType(null);
      form.resetFields();

      const params = {};
      if (loaiSanPham) {
        params.loai_san_pham = loaiSanPham;
      }
      const response = await api.get("http://localhost:8080/api/products", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProducts(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuongCoTheNhap: item.soLuongCoTheNhap,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          xuatXu: item.xuatXu || "N/A",
          tenCpu: item.tenCpu || "N/A",
          heDieuHanh: item.heDieuHanh || "N/A",
          doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
          ram: item.ram || "N/A",
          rom: item.rom || "N/A",
          dungLuongPin: item.dungLuongPin || "N/A",
          kichThuocMan: item.kichThuocMan || "N/A",
          congSuatNguon: item.congSuatNguon || "N/A",
          maBoard: item.maBoard || "N/A",
        }))
      );
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("accessToken");
        messageApi.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
      } else if (error.response && error.response.status === 403) {
        messageApi.error(
          "Bạn không có quyền thêm sản phẩm! Vui lòng kiểm tra quyền truy cập."
        );
      } else {
        messageApi.error("Thêm sản phẩm thất bại!");
      }
    }
  };

  const handleEdit = () => {
    if (selectedProducts.length !== 1) {
      messageApi.warning("Vui lòng chọn đúng 1 sản phẩm để sửa!");
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
        gia:
          values.gia === "N/A" || !values.gia || isNaN(parseFloat(values.gia))
            ? 0
            : parseFloat(values.gia),
        trangThai:
          values.trangThai === "N/A" ||
          !values.trangThai ||
          isNaN(parseInt(values.trangThai))
            ? 1
            : parseInt(values.trangThai),
        soLuongCoTheNhap:
          values.soLuongCoTheNhap === "N/A" ||
          !values.soLuongCoTheNhap ||
          isNaN(parseInt(values.soLuongCoTheNhap))
            ? 0
            : parseInt(values.soLuongCoTheNhap),
        xuatXu: values.xuatXu || "N/A",
      };

      await api.put(
        `http://localhost:8080/api/products/${selectedProduct.maSanPham}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      messageApi.success("Sửa sản phẩm thành công!");
      setIsEditModalOpen(false);
      form.resetFields();

      const params = {};
      if (loaiSanPham) {
        params.loai_san_pham = loaiSanPham;
      }
      const response = await api.get("http://localhost:8080/api/products", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProducts(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuongCoTheNhap: item.soLuongCoTheNhap,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          xuatXu: item.xuatXu || "N/A",
          tenCpu: item.tenCpu || "N/A",
          heDieuHanh: item.heDieuHanh || "N/A",
          doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
          ram: item.ram || "N/A",
          rom: item.rom || "N/A",
          dungLuongPin: item.dungLuongPin || "N/A",
          kichThuocMan: item.kichThuocMan || "N/A",
          congSuatNguon: item.congSuatNguon || "N/A",
          maBoard: item.maBoard || "N/A",
        }))
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Lỗi khi sửa sản phẩm:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("accessTokenSignature");
        messageApi.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
      } else if (error.response && error.response.status === 403) {
        messageApi.error(
          "Bạn không có quyền sửa sản phẩm! Vui lòng kiểm tra quyền truy cập."
        );
      } else if (error.response && error.response.status === 500) {
        messageApi.error(
          "Lỗi server: Không thể sửa sản phẩm. Vui lòng kiểm tra backend!"
        );
      } else if (error.response && error.response.data) {
        messageApi.error("Sửa sản phẩm thất bại: " + error.response.data.error);
      } else {
        messageApi.error("Sửa sản phẩm thất bại!");
      }
    }
  };

  const handleDelete = () => {
    if (selectedProducts.length === 0) {
      messageApi.warning("Vui lòng chọn ít nhất 1 sản phẩm để xóa!");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(
        selectedProducts.map((key) =>
          api.delete(`http://localhost:8080/api/products/${key}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
        )
      );
      messageApi.success("Xóa sản phẩm thành công!");

      const params = {};
      if (loaiSanPham) {
        params.loai_san_pham = loaiSanPham;
      }
      const response = await api.get("http://localhost:8080/api/products", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProducts(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuongCoTheNhap: item.soLuongCoTheNhap,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
          xuatXu: item.xuatXu || "N/A",
          tenCpu: item.tenCpu || "N/A",
          heDieuHanh: item.heDieuHanh || "N/A",
          doPhanGiaiCamera: item.doPhanGiaiCamera || "N/A",
          ram: item.ram || "N/A",
          rom: item.rom || "N/A",
          dungLuongPin: item.dungLuongPin || "N/A",
          kichThuocMan: item.kichThuocMan || "N/A",
          congSuatNguon: item.congSuatNguon || "N/A",
          maBoard: item.maBoard || "N/A",
        }))
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("accessToken");
        messageApi.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
      } else if (error.response && error.response.status === 403) {
        messageApi.error(
          "Bạn không có quyền xóa sản phẩm! Vui lòng kiểm tra quyền truy cập."
        );
      } else {
        messageApi.error("Xóa sản phẩm thất bại!");
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleViewDetail = () => {
    if (selectedProducts.length !== 1) {
      messageApi.warning("Vui lòng chọn đúng 1 sản phẩm để xem chi tiết!");
      return;
    }
    const selected = products.find((item) => item.key === selectedProducts[0]);
    if (!selected) {
      messageApi.error("Không tìm thấy sản phẩm được chọn!");
      return;
    }
    setSelectedProduct(selected);
    setIsViewModalOpen(true);
  };

  // Cột cho modal chi tiết
  const commonColumns = [
    { title: "Mã sản phẩm", dataIndex: "maSanPham", key: "maSanPham" },
    { title: "Tên sản phẩm", dataIndex: "tenSanPham", key: "tenSanPham" },
    {
      title: "Đơn giá",
      dataIndex: "gia",
      key: "gia",
      render: (value) => `${value?.toLocaleString() || 0}đ`,
    },
    {
      title: "Số lượng có thể nhập",
      dataIndex: "soLuongCoTheNhap",
      key: "soLuongCoTheNhap",
    },
    { title: "Loại sản phẩm", dataIndex: "loaiSanPham", key: "loaiSanPham" },
    { title: "Xuất xứ", dataIndex: "xuatXu", key: "xuatXu" },
  ];

  const DIENTHOAIColumns = [
    ...commonColumns,
    { title: "Hệ điều hành", dataIndex: "heDieuHanh", key: "heDieuHanh" },
    {
      title: "Độ phân giải camera",
      dataIndex: "doPhanGiaiCamera",
      key: "doPhanGiaiCamera",
    },
  ];

  const MAYTINHColumns = [
    ...commonColumns,
    { title: "CPU", dataIndex: "tenCpu", key: "tenCpu" },
    {
      title: "Công suất nguồn",
      dataIndex: "congSuatNguon",
      key: "congSuatNguon",
    },
    { title: "Mã board", dataIndex: "maBoard", key: "maBoard" },
  ];

  const handleExportExcel = () => {
    const exportProducts = filteredProducts.map((item) => ({
      "Mã sản phẩm": item.maSanPham,
      "Tên sản phẩm": item.tenSanPham,
      "Số lượng có thể nhập": item.soLuongCoTheNhap,
      "Đơn giá": item.gia,
      "Loại sản phẩm": item.loaiSanPham,
      "Xuất xứ": item.xuatXu,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
    messageApi.success("Xuất Excel thành công!");
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) {
      messageApi.error("Vui lòng chọn file Excel!");
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
          messageApi.error("File Excel trống!");
          return;
        }

        const errors = [];
        const newSelectedProducts = [...selectedProducts];

        jsonData.forEach((row, index) => {
          const maSanPham = row["Mã sản phẩm"]?.toString();
          const tenSanPham = row["Tên sản phẩm"]?.toString();
          const soLuongCoTheNhap = Number(row["Số lượng có thể nhập"]);
          const gia = Number(row["Đơn giá"]);
          const loaiSanPham = row["Loại sản phẩm"]?.toString();

          if (
            !maSanPham ||
            !tenSanPham ||
            isNaN(soLuongCoTheNhap) ||
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

          if (soLuongCoTheNhap < 1) {
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

          if (!newSelectedProducts.includes(maSanPham)) {
            newSelectedProducts.push(maSanPham);
          }
        });

        setSelectedProducts(newSelectedProducts);

        if (errors.length > 0) {
          messageApi.warning(
            `Đã chọn thành công ${
              newSelectedProducts.length - selectedProducts.length
            } sản phẩm. Có ${errors.length} lỗi:\n${errors.join("\n")}`
          );
        } else {
          messageApi.success(
            `Đã chọn thành công ${
              newSelectedProducts.length - selectedProducts.length
            } sản phẩm từ Excel!`
          );
        }
      } catch (error) {
        messageApi.error("Lỗi khi đọc file Excel: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Dropdown menu cho mobile
  const menu = (
    <Menu>
      <Menu.Item key="export" onClick={handleExportExcel}>
        <FileExcelOutlined /> Xuất Excel
      </Menu.Item>
      <Menu.Item key="import" onClick={() => fileInputRef.current.click()}>
        <FileExcelOutlined /> Nhập Excel
      </Menu.Item>
      <Menu.Item key="view" onClick={handleViewDetail}>
        <EyeOutlined /> Xem chi tiết
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
          QUẢN LÝ SẢN PHẨM
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
              <Option value="maSanPham">Mã sản phẩm</Option>
              <Option value="tenSanPham">Tên sản phẩm</Option>
              <Option value="soLuongCoTheNhap">Số lượng có thể nhập</Option>
              <Option value="gia">Đơn giá</Option>
              <Option value="xuatXu">Xuất xứ</Option>
            </Select>
            <Select
              value={loaiSanPham || "TẤT_CẢ"}
              onChange={(value) =>
                setLoaiSanPham(value === "TẤT_CẢ" ? null : value)
              }
              className="w-full sm:w-40 h-12 text-base"
            >
              <Option value="TẤT_CẢ">Tất cả</Option>
              <Option value="MAYTINH">Máy tính</Option>
              <Option value="DIENTHOAI">Điện thoại</Option>
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
                  icon={<EyeOutlined />}
                  className="min-w-[120px] h-12 text-base"
                  onClick={handleViewDetail}
                >
                  Xem chi tiết
                </Button>
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
          dataSource={filteredProducts}
          columns={columns}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{ pageSize: 6 }}
          rowKey="key"
          bordered
          loading={loading}
          scroll={{ x: isMobile ? 300 : "max-content" }}
          className="custom-table"
        />

        {/* Modal chọn loại sản phẩm */}
        <Modal
          title="Chọn loại sản phẩm"
          open={isTypeModalOpen}
          onOk={handleTypeOk}
          onCancel={handleTypeCancel}
          okButtonProps={{ className: "h-12 text-base" }}
          cancelButtonProps={{ className: "h-12 text-base" }}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn loại sản phẩm"
            onChange={(value) => setSelectedProductType(value)}
            value={selectedProductType}
            className="h-12 text-base"
          >
            <Option value="DIENTHOAI">Điện thoại</Option>
            <Option value="MAYTINH">Máy tính</Option>
          </Select>
        </Modal>

        {/* Modal thêm sản phẩm */}
        <Modal
          title="Thêm sản phẩm mới"
          open={isAddModalOpen}
          onOk={handleAddOk}
          onCancel={() => {
            setIsAddModalOpen(false);
            setSelectedProductType(null);
            form.resetFields();
          }}
          okButtonProps={{ className: "h-12 text-base" }}
          cancelButtonProps={{ className: "h-12 text-base" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="maSanPham"
              label="Mã sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập mã sản phẩm!" },
              ]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
            <Form.Item
              name="tenSanPham"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
            <Form.Item
              name="gia"
              label="Đơn giá"
              rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                className="h-12 text-base"
              />
            </Form.Item>
            <Form.Item
              name="soLuongCoTheNhap"
              label="Số lượng có thể nhập"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                className="h-12 text-base"
              />
            </Form.Item>
            <Form.Item
              name="loaiSanPham"
              label="Loại sản phẩm"
              initialValue={selectedProductType}
            >
              <Input disabled className="h-12 text-base" />
            </Form.Item>
            <Form.Item name="xuatXu" label="Xuất xứ">
              <Input className="h-12 text-base" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal sửa sản phẩm */}
        <Modal
          title="Sửa sản phẩm"
          open={isEditModalOpen}
          onOk={handleEditOk}
          onCancel={() => setIsEditModalOpen(false)}
          okButtonProps={{ className: "h-12 text-base" }}
          cancelButtonProps={{ className: "h-12 text-base" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="tenSanPham"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input className="h-12 text-base" />
            </Form.Item>
            <Form.Item
              name="gia"
              label="Đơn giá"
              rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                className="h-12 text-base"
              />
            </Form.Item>
            <Form.Item
              name="soLuongCoTheNhap"
              label="Số lượng có thể nhập"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                className="h-12 text-base"
              />
            </Form.Item>
            <Form.Item name="xuatXu" label="Xuất xứ">
              <Input className="h-12 text-base" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal xem chi tiết sản phẩm */}
        <Modal
          title="Chi tiết sản phẩm"
          open={isViewModalOpen}
          onOk={() => setIsViewModalOpen(false)}
          onCancel={() => setIsViewModalOpen(false)}
          footer={[
            <Button
              key="ok"
              type="primary"
              onClick={() => setIsViewModalOpen(false)}
              className="h-12 text-base"
            >
              OK
            </Button>,
          ]}
          width={1200}
        >
          {selectedProduct ? (
            <Table
              dataSource={[selectedProduct]}
              columns={
                selectedProduct.loaiSanPham === "MAYTINH"
                  ? MAYTINHColumns
                  : DIENTHOAIColumns
              }
              pagination={false}
              bordered
            />
          ) : (
            <p>Không có dữ liệu để hiển thị</p>
          )}
        </Modal>

        {/* Modal xác nhận xóa sản phẩm */}
        <Modal
          title="Xác nhận xóa sản phẩm"
          open={isDeleteModalOpen}
          onOk={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true, className: "h-12 text-base" }}
          cancelButtonProps={{ className: "h-12 text-base" }}
        >
          <p>
            Bạn có chắc chắn muốn xóa <strong>{selectedProducts.length}</strong>{" "}
            sản phẩm đã chọn không?
          </p>
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
      `}</style>
    </div>
  );
};

export default Product;
