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
  ImportOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";
import api from "../api";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const ImportGoods = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("maSanPham");
  const [productType, setProductType] = useState("all");
  const [quantities, setQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [receiptCode, setReceiptCode] = useState("");
  const [creatorRole, setCreatorRole] = useState("");
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [roleToUserNameMap, setRoleToUserNameMap] = useState({});
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
    const fetchAccounts = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/users/list");
        const accounts = response.data;
        const roleMap = {};
        accounts.forEach((account) => {
          if (!roleMap[account.role]) {
            roleMap[account.role] = account.userName;
          }
        });
        setRoleToUserNameMap(roleMap);
        const userName = localStorage.getItem("username") || "admin";
        const userRole = Object.keys(roleMap).find(
          (role) => roleMap[role] === userName
        );
        setCreatorRole(userRole || "");
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tài khoản:", error);
        messageApi.error("Không thể tải danh sách tài khoản!");
      }
    };

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await api.get("http://localhost:8080/api/products");
        const allProducts = response.data;
        if (allProducts.length === 0) {
          messageApi.warning(
            "Không có sản phẩm nào trong kho! Vui lòng kiểm tra database."
          );
        } else {
          setProducts(allProducts);
        }
      } catch (error) {
        messageApi.error(
          "Không thể tải danh sách sản phẩm: " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        const response = await api.get("http://localhost:8080/api/suppliers");
        if (response.data.length === 0) {
          messageApi.warning(
            "Không có nhà cung cấp nào! Vui lòng kiểm tra database."
          );
        } else {
          setSuppliers(response.data);
        }
      } catch (error) {
        messageApi.error(
          "Không thể tải danh sách nhà cung cấp: " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        setLoadingSuppliers(false);
      }
    };

    fetchAccounts();
    fetchProducts();
    fetchSuppliers();
  }, [messageApi]);

  const filteredData = products.filter((product) => {
    const value = product[filterBy]?.toString().toLowerCase();
    const matchesSearch = value?.includes(searchTerm.toLowerCase());
    const matchesType =
      productType === "all" ||
      (productType === "computer" && product.loaiSanPham === "Computer") ||
      (productType === "phone" && product.loaiSanPham === "Phone");
    return matchesSearch && matchesType;
  });

  const handleQuantityChange = (id, value) => {
    const quantity = Number(value);
    if (quantity < 1) {
      messageApi.error("Số lượng phải lớn hơn 0");
      return;
    }
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const handleAddProduct = (record) => {
    if (
      !record.maSanPham ||
      !record.tenSanPham ||
      !record.gia ||
      !record.loaiSanPham
    ) {
      messageApi.error("Sản phẩm không hợp lệ, thiếu thông tin bắt buộc!");
      return;
    }

    const quantity = quantities[record.maSanPham] || 1;
    setSelectedProducts((prev) => {
      const existingProduct = prev.find(
        (item) => item.maSanPham === record.maSanPham
      );
      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;
        return prev.map((item) =>
          item.maSanPham === record.maSanPham
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      messageApi.success(`Đã thêm ${record.tenSanPham} vào phiếu nhập`);
      return [
        ...prev,
        {
          ...record,
          quantity,
          id: record.maSanPham,
          name: record.tenSanPham,
          price: record.gia,
          loaiSanPham: record.loaiSanPham,
        },
      ];
    });
    setQuantities((prev) => ({ ...prev, [record.maSanPham]: 1 }));
  };

  const handleEditQuantity = (id, newQuantity) => {
    const quantity = Number(newQuantity);
    if (quantity < 1) {
      messageApi.error("Số lượng phải lớn hơn 0");
      return;
    }
    setSelectedProducts((prev) =>
      prev.map((item) => (item.maSanPham === id ? { ...item, quantity } : item))
    );
    messageApi.success("Cập nhật số lượng thành công");
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
        messageApi.success("Xóa sản phẩm thành công");
      },
    });
  };

  const handleImportGoods = async () => {
    if (!selectedSupplier) {
      messageApi.error("Vui lòng chọn nhà cung cấp!");
      return;
    }
    if (selectedProducts.length === 0) {
      messageApi.error("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }
    if (!creatorRole) {
      messageApi.error("Vui lòng chọn người tạo!");
      return;
    }

    const invalidProducts = selectedProducts.filter(
      (product) =>
        !product.maSanPham ||
        !product.quantity ||
        !product.price ||
        !product.loaiSanPham
    );
    if (invalidProducts.length > 0) {
      messageApi.error(
        "Một số sản phẩm thiếu thông tin bắt buộc (mã, số lượng, giá, loại sản phẩm)!"
      );
      console.log("Sản phẩm không hợp lệ:", invalidProducts);
      return;
    }

    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const selectedUserName = roleToUserNameMap[creatorRole];
    if (!selectedUserName) {
      messageApi.error("Không tìm thấy tài khoản phù hợp cho vai trò đã chọn!");
      return;
    }

    const receiptData = {
      ngayNhap: moment().format("YYYY-MM-DDTHH:mm:ss"),
      tongTien: totalAmount,
      nguoiTao: { userName: selectedUserName },
      nhaCungCap: { maNhaCungCap: selectedSupplier },
      chiTietPhieuNhaps: selectedProducts.map((product) => ({
        id: {
          maPhieuNhap: null,
          maSanPham: product.maSanPham,
        },
        loaiSanPham: product.loaiSanPham,
        soLuong: product.quantity,
        donGia: product.price,
        sanPham: {
          maSanPham: product.maSanPham,
          tenSanPham: product.name,
          gia: product.price,
          loaiSanPham: product.loaiSanPham,
        },
      })),
    };

    console.log("selectedProducts:", selectedProducts);
    console.log("Dữ liệu gửi lên server:", receiptData);

    if (
      !receiptData.chiTietPhieuNhaps ||
      receiptData.chiTietPhieuNhaps.length === 0
    ) {
      messageApi.error("Không có chi tiết phiếu nhập nào được tạo!");
      return;
    }

    try {
      const response = await api.post(
        "http://localhost:8080/api/receipts",
        receiptData
      );
      console.log("Response từ server:", response.data);
      messageApi.success("Nhập hàng thành công!");
      localStorage.setItem("refreshProducts", Date.now().toString());
      setReceiptCode("");
      setSelectedSupplier(null);
      setSelectedProducts([]);
      setQuantities({});
      setCreatorRole("");
      navigate("/phieu-nhap");
    } catch (error) {
      console.error("Lỗi từ server:", error.response?.data || error.message);
      messageApi.error(
        "Nhập hàng thất bại: " +
          (error.response?.data?.error || error.response?.data || error.message)
      );
    }
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
          const maSanPham = row.maSanPham?.toString();
          const tenSanPham = row.tenSanPham?.toString();
          const soLuongCoTheNhap = Number(row.soLuongCoTheNhap);
          const gia = Number(row.gia);
          const loaiSanPham = row.loaiSanPham?.toString();

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

          const existingProduct = newSelectedProducts.find(
            (item) => item.maSanPham === maSanPham
          );
          if (existingProduct) {
            existingProduct.quantity += soLuongCoTheNhap;
          } else {
            newSelectedProducts.push({
              ...product,
              quantity: soLuongCoTheNhap,
              id: maSanPham,
              name: tenSanPham,
              price: gia,
              loaiSanPham: loaiSanPham,
            });
          }
        });

        setSelectedProducts(newSelectedProducts);

        if (errors.length > 0) {
          messageApi.warning(
            `Đã nhập thành công ${
              newSelectedProducts.length - selectedProducts.length
            } sản phẩm. Có ${errors.length} lỗi:\n${errors.join("\n")}`
          );
        } else {
          messageApi.success(
            `Đã nhập thành công ${
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
      title: "Số lượng có thể nhập",
      dataIndex: "soLuongCoTheNhap",
      key: "soLuongCoTheNhap",
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
        <strong>Số lượng có thể nhập:</strong> {record.soLuongCoTheNhap}
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
          NHẬP HÀNG
        </h2>

        <div
          className={`grid ${
            isMobile ? "grid-cols-1" : "grid-cols-2"
          } gap-6 mb-6 sm:mb-8`}
        >
          <div className="bg-white p-4 shadow rounded flex flex-col flex-grow">
            <h3 className="font-bold mb-2 text-black text-base sm:text-lg">
              Chọn sản phẩm
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
                <Select.Option value="maSanPham">Mã sản phẩm</Select.Option>
                <Select.Option value="tenSanPham">Tên sản phẩm</Select.Option>
                <Select.Option value="soLuongCoTheNhap">
                  Số lượng có thể nhập
                </Select.Option>
                <Select.Option value="gia">Đơn giá</Select.Option>
              </Select>
              <Select
                value={productType}
                onChange={setProductType}
                className="w-full sm:w-40 h-12 text-base rounded-lg"
              >
                <Select.Option value="all">Tất cả</Select.Option>
                <Select.Option value="computer">Máy tính</Select.Option>
                <Select.Option value="phone">Điện thoại</Select.Option>
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
              loading={loadingProducts}
              scroll={{ x: isMobile ? 300 : "max-content" }}
            />
          </div>

          <div className="bg-white p-4 shadow rounded flex flex-col flex-grow">
            <h3 className="font-bold mb-2 text-black text-base sm:text-lg">
              Thông tin nhập hàng
            </h3>
            <div className="flex flex-col gap-3 flex-grow overflow-hidden">
              <Input
                placeholder="Mã phiếu nhập (tự động sinh)"
                value={receiptCode}
                onChange={(e) => setReceiptCode(e.target.value)}
                className="w-full h-12 text-base rounded-lg"
                disabled
              />
              <Select
                value={creatorRole}
                onChange={setCreatorRole}
                className="w-full h-12 text-base rounded-lg"
                placeholder="Chọn người tạo"
              >
                {Object.keys(roleToUserNameMap).map((role) => (
                  <Option key={role} value={role}>
                    {role}
                  </Option>
                ))}
              </Select>
              <Select
                value={selectedSupplier}
                onChange={setSelectedSupplier}
                className="w-full h-12 text-base rounded-lg"
                loading={loadingSuppliers}
              >
                <Select.Option value={null} disabled>
                  Chọn nhà cung cấp
                </Select.Option>
                {suppliers.map((supplier, index) => (
                  <Select.Option key={index} value={supplier.maNhaCungCap}>
                    {supplier.tenNhaCungCap}
                  </Select.Option>
                ))}
              </Select>
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
                    scroll={{ y: 240, x: isMobile ? 300 : "max-content" }}
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
                  icon={<ImportOutlined />}
                  className="min-w-[120px] h-12 text-base bg-blue-500 hover:bg-blue-600"
                  onClick={handleImportGoods}
                >
                  Nhập hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
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

export default ImportGoods;
