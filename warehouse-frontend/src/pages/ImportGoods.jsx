import { useState, useEffect, useRef } from "react";
import { Button, Input, Select, Table, message, Modal } from "antd";
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ImportOutlined,
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
  const [creatorRole, setCreatorRole] = useState(""); // Lưu role được chọn
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [roleToUserNameMap, setRoleToUserNameMap] = useState({}); // Ánh xạ role -> userName

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy danh sách tài khoản và tạo ánh xạ role -> userName
    const fetchAccounts = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/users/list");
        const accounts = response.data;

        // Nhóm tài khoản theo role và chọn userName đầu tiên cho mỗi role
        const roleMap = {};
        accounts.forEach((account) => {
          if (!roleMap[account.role]) {
            roleMap[account.role] = account.userName;
          }
        });
        setRoleToUserNameMap(roleMap);

        // Lấy userName từ localStorage và tìm role tương ứng
        const userName = localStorage.getItem("username") || "admin";
        const userRole = Object.keys(roleMap).find(
          (role) => roleMap[role] === userName
        );
        setCreatorRole(userRole || ""); // Đặt role mặc định
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
  }, []);

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

    // Lấy userName tương ứng với role được chọn
    const selectedUserName = roleToUserNameMap[creatorRole];
    if (!selectedUserName) {
      messageApi.error("Không tìm thấy tài khoản phù hợp cho vai trò đã chọn!");
      return;
    }

    const receiptData = {
      ngayNhap: moment().format("YYYY-MM-DDTHH:mm:ss"),
      tongTien: totalAmount,
      nguoiTao: { userName: selectedUserName }, // Gửi userName lên backend
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

      // Thông báo cho trang "Quản lý sản phẩm" làm mới dữ liệu
      localStorage.setItem("refreshProducts", Date.now().toString());

      setReceiptCode("");
      setSelectedSupplier(null);
      setSelectedProducts([]);
      setQuantities({});
      setCreatorRole(""); // Reset role sau khi nhập hàng thành công
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
    event.target.value = null;
  };

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const columns = [
    { title: "Mã sản phẩm", dataIndex: "maSanPham", key: "maSanPham" },
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
      render: (gia) => gia.toLocaleString() + " VND",
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
            className="w-24 rounded-lg"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="w-20"
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
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString() + " VND",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
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
            onClick={() => handleDeleteProduct(record.maSanPham)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Nhập hàng</h2>
      <div className="grid grid-cols-2 gap-4 flex-grow min-h-[500px]">
        <div className="bg-white p-4 shadow rounded flex flex-col flex-grow overflow-y-auto">
          <h3 className="font-bold mb-2 text-black">Chọn sản phẩm</h3>
          <div className="flex gap-2 w-full mb-4">
            <Input
              placeholder="Nhập từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-[50px] rounded-lg"
            />
            <Select
              value={filterBy}
              onChange={setFilterBy}
              className="w-40 h-[50px] rounded-lg"
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
              className="w-40 h-[50px] rounded-lg"
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
            pagination={{ pageSize: 5 }}
            className="mt-2"
            loading={loadingProducts}
          />
        </div>

        <div className="bg-white p-4 shadow rounded flex flex-col flex-grow overflow-y-auto">
          <h3 className="font-bold mb-2 text-black">Thông tin nhập hàng</h3>
          <div className="flex flex-col gap-2 flex-grow overflow-hidden">
            <Input
              placeholder="Mã phiếu nhập (tự động sinh)"
              value={receiptCode}
              onChange={(e) => setReceiptCode(e.target.value)}
              className="border h-[50px] p-2 rounded-lg"
              disabled
            />
            <Select
              value={creatorRole}
              onChange={setCreatorRole}
              className="border h-[50px] rounded-lg"
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
              className="border h-[50px] rounded-lg"
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
                  pagination={false}
                  scroll={{ y: 240 }}
                />
              )}
            </div>
          </div>
          <div className="border-t mt-4 pt-2 flex justify-between items-center font-bold bg-white p-4 shadow-md sticky bottom-0 w-full">
            <p className="text-lg text-red-500">
              Tổng tiền: {totalAmount.toLocaleString()} VND
            </p>
            <Button
              type="primary"
              icon={<ImportOutlined />}
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleImportGoods}
            >
              Nhập hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportGoods;
