import { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Select,
  Table,
  message,
  Modal,
  Drawer,
  Menu,
  Dropdown,
} from "antd";
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExportOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";
import api from "../api";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const ExportGoods = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("maSanPham");
  const [productType, setProductType] = useState("all");
  const [quantities, setQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [_, setAutoReceiptCode] = useState("");
  const [creator, setCreator] = useState("admin");
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const generateReceiptCode = () => {
      const timestamp = Date.now();
      return `PX-${timestamp}`;
    };
    setAutoReceiptCode(generateReceiptCode());
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("username") || "admin";
    setCreator(user);

    const fetchInventory = async () => {
      setLoadingInventory(true);
      try {
        const response = await api.get("http://localhost:8080/api/inventory", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log("Dữ liệu từ API /api/inventory:", response.data);

        const formattedInventory = response.data.map((item) => ({
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuongTonKho || 0,
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
        }));
        if (formattedInventory.length === 0) {
          message.warning(
            "Không có hàng hóa nào trong kho! Vui lòng nhập hàng trước."
          );
        }
        setInventory(formattedInventory);
        console.log("Dữ liệu kho sau khi ánh xạ:", formattedInventory);
      } catch (error) {
        message.error(
          "Không thể tải danh sách hàng hóa trong kho: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoadingInventory(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredData = inventory.filter((item) => {
    const value = item[filterBy]?.toString().toLowerCase();
    const matchesSearch = value?.includes(searchTerm.toLowerCase());
    const matchesType =
      productType === "all" ||
      (productType === "computer" && item.loaiSanPham === "Computer") ||
      (productType === "phone" && item.loaiSanPham === "Phone");
    return matchesSearch && matchesType;
  });

  const handleQuantityChange = (id, value) => {
    const quantity = Number(value);
    if (quantity < 1) {
      message.error("Số lượng phải lớn hơn 0");
      return;
    }
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const handleAddProduct = (record) => {
    const quantity = quantities[record.maSanPham] || 1;
    const itemInInventory = inventory.find(
      (p) => p.maSanPham === record.maSanPham
    );
    if (quantity > itemInInventory.soLuong) {
      message.error(
        `Số lượng xuất (${quantity}) vượt quá số lượng tồn kho (${itemInInventory.soLuong}) cho sản phẩm ${record.tenSanPham}!`
      );
      return;
    }

    setSelectedProducts((prev) => {
      const existingProduct = prev.find(
        (item) => item.maSanPham === record.maSanPham
      );
      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;
        if (newQuantity > itemInInventory.soLuong) {
          message.error(
            `Tổng số lượng xuất (${newQuantity}) vượt quá số lượng tồn kho (${itemInInventory.soLuong}) cho sản phẩm ${record.tenSanPham}!`
          );
          return prev;
        }
        return prev.map((item) =>
          item.maSanPham === record.maSanPham
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      message.success(`Đã thêm ${record.tenSanPham} vào phiếu xuất`);
      return [
        ...prev,
        {
          ...record,
          quantity,
          id: record.maSanPham,
          name: record.tenSanPham,
          price: record.gia,
        },
      ];
    });
    setQuantities((prev) => ({ ...prev, [record.maSanPham]: 1 }));
  };

  const handleEditQuantity = (id, newQuantity) => {
    const quantity = Number(newQuantity);
    if (quantity < 1) {
      message.error("Số lượng phải lớn hơn 0");
      return;
    }
    const itemInInventory = inventory.find((p) => p.maSanPham === id);
    if (quantity > itemInInventory.soLuong) {
      message.error(
        `Số lượng xuất (${quantity}) vượt quá số lượng tồn kho (${itemInInventory.soLuong}) cho sản phẩm ${itemInInventory.tenSanPham}!`
      );
      return;
    }
    setSelectedProducts((prev) =>
      prev.map((item) => (item.maSanPham === id ? { ...item, quantity } : item))
    );
    message.success("Cập nhật số lượng thành công");
  };

  const handleDeleteProduct = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setSelectedProducts((prev) =>
          prev.filter((item) => item.maSanPham !== id)
        );
        message.success("Xóa sản phẩm thành công");
      },
    });
  };

  const handleExportGoods = async () => {
    if (selectedProducts.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để xuất!");
      return;
    }

    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const receiptData = {
      ngayXuat: moment().format("YYYY-MM-DDTHH:mm:ss"),
      tongTien: totalAmount,
      nguoiTao: { userName: creator },
      chiTietPhieuXuats: selectedProducts.map((product) => ({
        id: {
          maSanPham: product.maSanPham,
        },
        soLuong: product.quantity,
        donGia: product.price,
      })),
    };

    try {
      await api.post("http://localhost:8080/api/export-receipts", receiptData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      message.success("Xuất hàng thành công!");
      setSelectedProducts([]);
      setQuantities({});
      const generateReceiptCode = () => {
        const timestamp = Date.now();
        return `PX-${timestamp}`;
      };
      setAutoReceiptCode(generateReceiptCode());
      navigate("/phieu-xuat");
    } catch (error) {
      message.error(
        "Xuất hàng thất bại: " +
          (error.response?.data?.message || error.message)
      );
    }
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
          const maSanPham = row.maSanPham?.toString();
          const tenSanPham = row.tenSanPham?.toString();
          const soLuong = Number(row.soLuong);
          const gia = Number(row.gia);

          if (!maSanPham || !tenSanPham || isNaN(soLuong) || isNaN(gia)) {
            errors.push(
              `Dòng ${
                index + 2
              }: Dữ liệu không hợp lệ (thiếu hoặc sai định dạng).`
            );
            return;
          }

          if (soLuong < 1) {
            errors.push(
              `Dòng ${
                index + 2
              }: Số lượng phải lớn hơn 0 (maSanPham: ${maSanPham}).`
            );
            return;
          }

          const itemInInventory = inventory.find(
            (p) => p.maSanPham === maSanPham
          );
          if (!itemInInventory) {
            errors.push(
              `Dòng ${
                index + 2
              }: Sản phẩm không tồn tại trong kho (maSanPham: ${maSanPham}).`
            );
            return;
          }

          if (soLuong > itemInInventory.soLuong) {
            errors.push(
              `Dòng ${
                index + 2
              }: Số lượng xuất (${soLuong}) vượt quá số lượng tồn kho (${
                itemInInventory.soLuong
              }) cho sản phẩm ${itemInInventory.tenSanPham}.`
            );
            return;
          }

          const existingProduct = newSelectedProducts.find(
            (item) => item.maSanPham === maSanPham
          );
          if (existingProduct) {
            const newQuantity = existingProduct.quantity + soLuong;
            if (newQuantity > itemInInventory.soLuong) {
              errors.push(
                `Dòng ${
                  index + 2
                }: Tổng số lượng xuất (${newQuantity}) vượt quá số lượng tồn kho (${
                  itemInInventory.soLuong
                }) cho sản phẩm ${itemInInventory.tenSanPham}.`
              );
              return;
            }
            existingProduct.quantity = newQuantity;
          } else {
            newSelectedProducts.push({
              ...itemInInventory,
              quantity: soLuong,
              id: maSanPham,
              name: tenSanPham,
              price: gia,
            });
          }
        });

        setSelectedProducts(newSelectedProducts);

        if (errors.length > 0) {
          message.warning(
            `Đã nhập thành công ${
              newSelectedProducts.length - selectedProducts.length
            } sản phẩm. Có ${errors.length} lỗi:\n${errors.join("\n")}`
          );
        } else {
          message.success(
            `Đã nhập thành công ${
              newSelectedProducts.length - selectedProducts.length
            } sản phẩm từ Excel!`
          );
        }
      } catch (error) {
        message.error("Lỗi khi đọc file Excel: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const columns = [
    { title: "Mã sản phẩm", dataIndex: "maSanPham", key: "maSanPham" },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
      ellipsis: true,
    },
    {
      title: "Số lượng tồn kho",
      dataIndex: "soLuong",
      key: "soLuong",
      responsive: ["sm"],
    },
    {
      title: "Đơn giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia) => gia.toLocaleString() + " VND",
      responsive: ["md"],
    },
    {
      title: "Thêm",
      key: "add",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            value={quantities[record.maSanPham] || 1}
            onChange={(e) =>
              handleQuantityChange(record.maSanPham, e.target.value)
            }
            className="w-24 h-12 text-base rounded-lg"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="w-20 h-12 text-base"
            onClick={() => handleAddProduct(record)}
          >
            Thêm
          </Button>
        </div>
      ),
    },
  ];

  const selectedColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    { title: "Mã sản phẩm", dataIndex: "maSanPham", key: "maSanPham" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", ellipsis: true },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString() + " VND",
      responsive: ["sm"],
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            className="h-10 text-base"
            onClick={() =>
              handleEditQuantity(
                record.maSanPham,
                prompt("Nhập số lượng mới:", record.quantity)
              )
            }
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            className="h-10 text-base"
            onClick={() => handleDeleteProduct(record.maSanPham)}
          />
        </div>
      ),
    },
  ];

  const expandedRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Mã sản phẩm:</strong> {record.maSanPham}
      </p>
      <p>
        <strong>Tên sản phẩm:</strong> {record.tenSanPham}
      </p>
      <p>
        <strong>Số lượng tồn kho:</strong> {record.soLuong}
      </p>
      <p>
        <strong>Đơn giá:</strong> {record.gia.toLocaleString()} VND
      </p>
    </div>
  );

  const selectedExpandedRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Mã sản phẩm:</strong> {record.maSanPham}
      </p>
      <p>
        <strong>Tên sản phẩm:</strong> {record.name}
      </p>
      <p>
        <strong>Số lượng:</strong> {record.quantity}
      </p>
      <p>
        <strong>Đơn giá:</strong> {record.price.toLocaleString()} VND
      </p>
    </div>
  );

  const menu = (
    <Menu>
      <Menu.Item key="import" onClick={() => fileInputRef.current.click()}>
        <FileExcelOutlined /> Nhập Excel
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="relative">
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
          XUẤT HÀNG
        </h2>

        <div
          className={`grid ${
            isMobile ? "grid-cols-1" : "grid-cols-2"
          } gap-6 mb-6 sm:mb-8`}
        >
          <div className="bg-white p-4 shadow rounded flex flex-col flex-grow">
            <h3 className="font-bold mb-2 text-black text-base sm:text-lg">
              Chọn sản phẩm từ kho
            </h3>
            <div
              className={`flex ${
                isMobile ? "flex-col" : "flex-row"
              } gap-3 mb-6 sm:mb-8`}
            >
              <Input
                placeholder="Nhập từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 text-base rounded-lg"
              />
              <Select
                value={filterBy}
                onChange={setFilterBy}
                className="w-full sm:w-40 h-12 text-base rounded-lg"
              >
                <Option value="maSanPham">Mã sản phẩm</Option>
                <Option value="tenSanPham">Tên sản phẩm</Option>
                <Option value="soLuong">Số lượng tồn kho</Option>
                <Option value="gia">Đơn giá</Option>
              </Select>
              <Select
                value={productType}
                onChange={setProductType}
                className="w-full sm:w-40 h-12 text-base rounded-lg"
              >
                <Option value="all">Tất cả</Option>
                <Option value="computer">Máy tính</Option>
                <Option value="phone">Điện thoại</Option>
              </Select>
            </div>
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="maSanPham"
              expandable={{
                expandedRowRender,
                expandRowByClick: true,
              }}
              pagination={{ pageSize: 5 }}
              className="custom-table mt-2"
              loading={loadingInventory}
              scroll={{ x: isMobile ? 300 : "max-content" }}
            />
          </div>

          <div className="bg-white p-4 shadow rounded flex flex-col flex-grow">
            <h3 className="font-bold mb-2 text-black text-base sm:text-lg">
              Thông tin xuất hàng
            </h3>
            <div className="flex flex-col gap-3 flex-grow overflow-hidden">
              <div className="flex flex-col gap-1">
                <div className="border h-12 p-2 rounded-lg bg-gray-100 flex items-center">
                  <span className="text-gray-500 text-base">
                    {"Mã phiếu xuất (tự động sinh)"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  value={creator}
                  disabled
                  className="h-12 text-base rounded-lg bg-gray-100"
                />
              </div>
              <div className="flex-grow overflow-hidden">
                {selectedProducts.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
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
                      className="h-12 text-base"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Nhập Excel
                    </Button>
                  </div>
                ) : (
                  <Table
                    dataSource={selectedProducts}
                    columns={selectedColumns}
                    rowKey="maSanPham"
                    expandable={{
                      expandedRowRender: selectedExpandedRowRender,
                      expandRowByClick: true,
                    }}
                    pagination={false}
                    scroll={{
                      y: isMobile ? 240 : 300,
                      x: isMobile ? 300 : "max-content",
                    }}
                    className="custom-table"
                  />
                )}
              </div>
            </div>
            <div className="border-t mt-4 pt-2 flex flex-col sm:flex-row gap-3 justify-between items-center font-bold bg-white p-4 shadow-md sticky bottom-0 w-full">
              <p className="text-base sm:text-lg text-red-500">
                Tổng tiền: {totalAmount.toLocaleString()} VND
              </p>
              <div className="flex gap-3">
                {isMobile && selectedProducts.length > 0 && (
                  <Dropdown overlay={menu}>
                    <Button className="min-w-[100px] h-12 text-base">
                      Thêm <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  className="min-w-[120px] h-12 text-base bg-blue-500 hover:bg-blue-600"
                  onClick={handleExportGoods}
                >
                  Xuất hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
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

export default ExportGoods;
