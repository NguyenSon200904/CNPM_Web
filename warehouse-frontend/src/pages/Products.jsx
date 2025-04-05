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
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("maSanPham");
  const [loaiSanPham, setLoaiSanPham] = useState("TẤT_CẢ");
  const [isMobile, _setIsMobile] = useState(window.innerWidth < 768);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false); // Modal chọn loại sản phẩm
  const [selectedProductType, setSelectedProductType] = useState(null); // Loại sản phẩm được chọn
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
          const formattedProducts = response.data.map((item, index) => ({
            key: item.maSanPham || index,
            maSanPham: item.maSanPham,
            tenSanPham: item.tenSanPham,
            soLuongCoTheNhap: item.soLuongCoTheNhap,
            gia: item.gia,
            loaiSanPham: item.loaiSanPham,
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

    // Lắng nghe sự kiện làm mới từ localStorage
    const handleStorageChange = () => {
      const refreshTimestamp = localStorage.getItem("refreshProducts");
      if (refreshTimestamp) {
        fetchProducts();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loaiSanPham, messageApi]);

  const filteredProducts = products.filter((item) =>
    item[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys: selectedProducts,
    onChange: (newSelectedRowKeys) => {
      setSelectedProducts(newSelectedRowKeys);
    },
  };

  const baseColumns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "maSanPham",
      key: "maSanPham",
      responsive: ["sm"],
    },
    { title: "Tên sản phẩm", dataIndex: "tenSanPham", key: "tenSanPham" },
    {
      title: "Số lượng có thể nhập",
      dataIndex: "soLuongCoTheNhap",
      key: "soLuongCoTheNhap",
    },
    {
      title: "Đơn giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia) => `${gia?.toLocaleString() || 0}đ`,
    },
    { title: "Bộ nhớ", dataIndex: "rom", key: "rom", responsive: ["lg"] },
  ];

  const loaiSanPhamColumn = {
    title: "Loại sản phẩm",
    dataIndex: "loaiSanPham",
    key: "loaiSanPham",
    responsive: ["lg"],
  };

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

  const columns = [
    ...baseColumns,
    ...(additionalColumns[loaiSanPham] || []),
    loaiSanPhamColumn,
  ];

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
    // Đặt lại giá trị loaiSanPham trong form dựa trên selectedProductType
    form.setFieldsValue({
      loaiSanPham: selectedProductType === "MAY_TINH" ? "Computer" : "Phone",
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
        loaiSanPham: selectedProductType === "MAY_TINH" ? "Computer" : "Phone",
        gia:
          values.gia === "N/A" || !values.gia || isNaN(parseFloat(values.gia))
            ? 0
            : parseFloat(values.gia),
        trangThai:
          values.trangThai === "N/A" ||
          !values.trangThai ||
          isNaN(parseInt(values.trangThai))
            ? 0
            : parseInt(values.trangThai),
        dungLuongPin:
          values.dungLuongPin === "N/A" || !values.dungLuongPin
            ? "0"
            : values.dungLuongPin,
        kichThuocMan:
          values.kichThuocMan === "N/A" ||
          !values.kichThuocMan ||
          isNaN(parseFloat(values.kichThuocMan))
            ? 0
            : parseFloat(values.kichThuocMan),
        ram: values.ram === "N/A" || !values.ram ? null : values.ram,
        rom: values.rom === "N/A" || !values.rom ? null : values.rom,
        heDieuHanh:
          values.heDieuHanh === "N/A" || !values.heDieuHanh
            ? null
            : values.heDieuHanh,
        doPhanGiaiCamera:
          values.doPhanGiaiCamera === "N/A" || !values.doPhanGiaiCamera
            ? null
            : values.doPhanGiaiCamera,
        tenCpu:
          values.tenCpu === "N/A" || !values.tenCpu ? null : values.tenCpu,
        congSuatNguon:
          values.congSuatNguon === "N/A" ||
          !values.congSuatNguon ||
          isNaN(parseInt(values.congSuatNguon))
            ? 0
            : parseInt(values.congSuatNguon),
        maBoard:
          values.maBoard === "N/A" || !values.maBoard ? null : values.maBoard,
      };

      console.log("Dữ liệu gửi đi:", newProduct);

      await api.post("http://localhost:8080/api/products", newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      messageApi.success("Thêm sản phẩm thành công!");
      setIsAddModalOpen(false);
      setSelectedProductType(null);
      form.resetFields(); // Đảm bảo reset form sau khi thêm thành công

      const params = { loaiSanPham };
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
            ? 0
            : parseInt(values.trangThai),
        dungLuongPin:
          values.dungLuongPin === "N/A" || !values.dungLuongPin
            ? "0"
            : values.dungLuongPin,
        kichThuocMan:
          values.kichThuocMan === "N/A" ||
          !values.kichThuocMan ||
          isNaN(parseFloat(values.kichThuocMan))
            ? 0
            : parseFloat(values.kichThuocMan),
        ram: values.ram === "N/A" || !values.ram ? null : values.ram,
        rom: values.rom === "N/A" || !values.rom ? null : values.rom,
        heDieuHanh:
          values.heDieuHanh === "N/A" || !values.heDieuHanh
            ? null
            : values.heDieuHanh,
        doPhanGiaiCamera:
          values.doPhanGiaiCamera === "N/A" || !values.doPhanGiaiCamera
            ? null
            : values.doPhanGiaiCamera,
      };

      console.log("Dữ liệu gửi đi:", updatedProduct);

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

      const params = { loaiSanPham };
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
        localStorage.removeItem("accessToken");
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
      } else {
        messageApi.error("Sửa sản phẩm thất bại!");
      }
    }
  };

  const handleDelete = async () => {
    if (selectedProducts.length === 0) {
      messageApi.warning("Vui lòng chọn ít nhất 1 sản phẩm để xóa!");
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map((key) =>
          api.delete(`http://localhost:8080/api/products/${key}`)
        )
      );
      messageApi.success("Xóa sản phẩm thành công!");

      const params = { loaiSanPham };
      const response = await api.get("http://localhost:8080/api/products", {
        params,
      });
      setProducts(
        response.data.map((item, index) => ({
          key: item.maSanPham || index,
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuongCoTheNhap: item.soLuongCoTheNhap,
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
      messageApi.error("Xóa sản phẩm thất bại!");
    }
  };

  const handleViewDetail = () => {
    if (selectedProducts.length !== 1) {
      messageApi.warning("Vui lòng chọn đúng 1 sản phẩm để xem chi tiết!");
      return;
    }
    const selected = products.find((item) => item.key === selectedProducts[0]);
    console.log("Selected product:", selected);
    if (!selected) {
      messageApi.error("Không tìm thấy sản phẩm được chọn!");
      return;
    }
    setSelectedProduct(selected);
    setIsViewModalOpen(true);
  };

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
    { title: "RAM", dataIndex: "ram", key: "ram" },
    { title: "Bộ nhớ", dataIndex: "rom", key: "rom" },
    { title: "Dung lượng pin", dataIndex: "dungLuongPin", key: "dungLuongPin" },
    { title: "Kích thước màn", dataIndex: "kichThuocMan", key: "kichThuocMan" },
  ];

  const phoneColumns = [
    ...commonColumns,
    { title: "Hệ điều hành", dataIndex: "heDieuHanh", key: "heDieuHanh" },
    {
      title: "Độ phân giải camera",
      dataIndex: "doPhanGiaiCamera",
      key: "doPhanGiaiCamera",
    },
  ];

  const computerColumns = [
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
    const exportProducts = filteredProducts.map((item) => {
      const baseProducts = {
        "Mã sản phẩm": item.maSanPham,
        "Tên sản phẩm": item.tenSanPham,
        "Số lượng có thể nhập": item.soLuongCoTheNhap,
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
        messageApi.error("Lỗi khi đọc file Excel: " + error.messageApi);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = null;
  };

  return (
    <div className="p-4">
      {contextHolder}
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
            <Option value="soLuongCoTheNhap">Số lượng có thể nhập</Option>
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
        dataSource={filteredProducts}
        columns={columns}
        pagination={{ pageSize: 7 }}
        rowKey="key"
        bordered
        loading={loading}
      />

      {/* Modal chọn loại sản phẩm */}
      <Modal
        title="Chọn loại sản phẩm"
        open={isTypeModalOpen}
        onOk={handleTypeOk}
        onCancel={handleTypeCancel}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn loại sản phẩm"
          onChange={(value) => setSelectedProductType(value)}
          value={selectedProductType}
        >
          <Option value="DIEN_THOAI">Phone</Option>
          <Option value="MAY_TINH">Computer</Option>
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
          form.resetFields(); // Reset toàn bộ form, bao gồm loaiSanPham
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="maSanPham"
            label="Mã sản phẩm"
            rules={[
              { required: true, messageApi: "Vui lòng nhập mã sản phẩm!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tenSanPham"
            label="Tên sản phẩm"
            rules={[
              { required: true, messageApi: "Vui lòng nhập tên sản phẩm!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gia"
            label="Đơn giá"
            rules={[{ required: true, messageApi: "Vui lòng nhập đơn giá!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="soLuongCoTheNhap"
            label="Số lượng có thể nhập"
            rules={[{ required: true, messageApi: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="loaiSanPham"
            label="Loại sản phẩm"
            initialValue={
              selectedProductType === "MAY_TINH" ? "Computer" : "Phone"
            }
          >
            <Input disabled />
          </Form.Item>
          <Form.Item name="ram" label="RAM">
            <Input />
          </Form.Item>
          <Form.Item name="rom" label="Bộ nhớ">
            <Input />
          </Form.Item>
          <Form.Item name="dungLuongPin" label="Dung lượng pin">
            <Input />
          </Form.Item>
          <Form.Item name="kichThuocMan" label="Kích thước màn hình">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* Các trường dành riêng cho Phone */}
          {selectedProductType === "DIEN_THOAI" && (
            <>
              <Form.Item name="heDieuHanh" label="Hệ điều hành">
                <Input />
              </Form.Item>
              <Form.Item name="doPhanGiaiCamera" label="Độ phân giải camera">
                <Input />
              </Form.Item>
            </>
          )}

          {/* Các trường dành riêng cho Computer */}
          {selectedProductType === "MAY_TINH" && (
            <>
              <Form.Item name="tenCpu" label="CPU">
                <Input />
              </Form.Item>
              <Form.Item name="congSuatNguon" label="Công suất nguồn">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="maBoard" label="Mã board">
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* Modal sửa sản phẩm */}
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
            rules={[
              { required: true, messageApi: "Vui lòng nhập tên sản phẩm!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gia"
            label="Đơn giá"
            rules={[{ required: true, messageApi: "Vui lòng nhập đơn giá!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="soLuongCoTheNhap"
            label="Số lượng có thể nhập"
            rules={[{ required: true, messageApi: "Vui lòng nhập số lượng!" }]}
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
              <Form.Item name="dungLuongPin" label="Dung lượng pin">
                <Input />
              </Form.Item>
              <Form.Item name="kichThuocMan" label="Kích thước màn hình">
                <Input />
              </Form.Item>
              <Form.Item name="congSuatNguon" label="Công suất nguồn">
                <Input />
              </Form.Item>
              <Form.Item name="maBoard" label="Mã board">
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
              <Form.Item name="dungLuongPin" label="Dung lượng pin">
                <Input />
              </Form.Item>
              <Form.Item name="kichThuocMan" label="Kích thước màn hình">
                <Input />
              </Form.Item>
            </>
          )}
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
              selectedProduct.loaiSanPham === "Computer"
                ? computerColumns
                : phoneColumns
            }
            pagination={false}
            bordered
          />
        ) : (
          <p>Không có dữ liệu để hiển thị</p>
        )}
      </Modal>
    </div>
  );
};

export default Product;
