import { useState, useEffect, useRef } from "react";
import { Button, Input, Select, Table, message, Modal } from "antd";
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExportOutlined,
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
  const [receiptCode, setReceiptCode] = useState(""); // Mã phiếu xuất do người dùng nhập
  const [creator, setCreator] = useState("admin");
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
        console.log("Dữ liệu từ API /api/inventory:", response.data); // Kiểm tra dữ liệu từ API

        const formattedInventory = response.data.map((item) => ({
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuongTonKho || 0, // Sửa ánh xạ từ soLuong thành soLuongTonKho
          gia: item.gia,
          loaiSanPham: item.loaiSanPham,
        }));
        if (formattedInventory.length === 0) {
          message.warning(
            "Không có hàng hóa nào trong kho! Vui lòng nhập hàng trước."
          );
        }
        setInventory(formattedInventory);
        console.log("Dữ liệu kho sau khi ánh xạ:", formattedInventory); // Kiểm tra dữ liệu sau ánh xạ
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

    if (!receiptCode || isNaN(receiptCode) || Number(receiptCode) <= 0) {
      message.error("Mã phiếu xuất phải là một số lớn hơn 0!");
      return;
    }

    const totalAmount = selectedProducts.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const receiptData = {
      maPhieuXuat: Number(receiptCode), // Chuyển receiptCode thành số
      ngayXuat: moment().format("YYYY-MM-DDTHH:mm:ss"),
      tongTien: totalAmount,
      nguoiTao: { userName: creator },
      chiTietPhieuXuats: selectedProducts.map((product) => ({
        id: {
          maPhieuXuat: Number(receiptCode), // Chuyển thành số
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
      setReceiptCode(""); // Reset mã phiếu xuất sau khi xuất hàng
      navigate("/phieu-xuat");
    } catch (error) {
      message.error(
        "Xuất hàng thất bại: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleExportExcel = (event) => {
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
    event.target.value = null;
  };

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const columns = [
    { title: "Mã sản phẩm", dataIndex: "maSanPham", key: "maSanPham" },
    { title: "Tên sản phẩm", dataIndex: "tenSanPham", key: "tenSanPham" },
    { title: "Số lượng tồn kho", dataIndex: "soLuong", key: "soLuong" },
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
      <h2 className="text-2xl font-bold mb-4">Xuất hàng</h2>
      <div className="grid grid-cols-2 gap-4 flex-grow min-h-[500px]">
        <div className="bg-white p-4 shadow rounded flex flex-col flex-grow overflow-y-auto">
          <h3 className="font-bold mb-2 text-black">Chọn sản phẩm từ kho</h3>
          <div className="flex gap-2 w-full">
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
              <Option value="maSanPham">Mã sản phẩm</Option>
              <Option value="tenSanPham">Tên sản phẩm</Option>
              <Option value="soLuong">Số lượng tồn kho</Option>
              <Option value="gia">Đơn giá</Option>
            </Select>
            <Select
              value={productType}
              onChange={setProductType}
              className="w-40 h-[50px] rounded-lg"
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
            pagination={{ pageSize: 5 }}
            className="mt-2"
            loading={loadingInventory}
          />
        </div>

        <div className="bg-white p-4 shadow rounded flex flex-col flex-grow overflow-y-auto">
          <h3 className="font-bold mb-2 text-black">Thông tin xuất hàng</h3>
          <div className="flex flex-col gap-2 flex-grow overflow-hidden">
            <div className="flex flex-col gap-1">
              <label className="text-black font-medium">Mã phiếu xuất</label>
              <Input
                placeholder="Nhập mã phiếu xuất"
                value={receiptCode}
                onChange={(e) => setReceiptCode(e.target.value)}
                className="border h-[50px] p-2 rounded-lg"
              />
            </div>
            <Input
              placeholder="Người tạo phiếu"
              value={creator}
              disabled
              className="border h-[50px] p-2 rounded-lg bg-gray-100"
            />
            <div className="flex-grow overflow-hidden">
              {selectedProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleExportExcel}
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
              icon={<ExportOutlined />}
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleExportGoods}
            >
              Xuất hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportGoods;
