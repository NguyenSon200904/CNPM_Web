import { useState, useEffect } from "react";
import { Button, Input, Select, Table, message, Modal } from "antd";
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExportOutlined,
} from "@ant-design/icons";

const ExportGoods = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("id");
  const [quantities, setQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [receiptCode, setReceiptCode] = useState("");
  const [creator, setCreator] = useState("admin");

  useEffect(() => {
    const user = localStorage.getItem("username") || "admin";
    setCreator(user);
  }, []);

  const productData = [
    {
      id: "P001",
      name: "Laptop Dell",
      quantity: 50,
      price: 15000000,
    },
    {
      id: "P002",
      name: "Laptop HP",
      quantity: 30,
      price: 12000000,
    },
    {
      id: "P003",
      name: "Laptop Asus",
      quantity: 20,
      price: 14000000,
    },
    {
      id: "P004",
      name: "Laptop Lenovo",
      quantity: 40,
      price: 13000000,
    },
    {
      id: "P005",
      name: "Laptop Acer Nitro 5 Tiger aaaaaaaaaaa",
      quantity: 10,
      price: 11000000,
    },
    {
      id: "P006",
      name: "Laptop MSI",
      quantity: 5,
      price: 20000000,
    },
  ];

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleAddProduct = (record) => {
    const quantity = quantities[record.id] || 1;
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((item) => item.id === record.id);
      if (existingProduct) {
        return prev.map((item) =>
          item.id === record.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...record, quantity }];
    });
    setQuantities((prev) => ({ ...prev, [record.id]: 1 }));
  };

  const handleEditQuantity = (id, newQuantity) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDeleteProduct = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setSelectedProducts((prev) => prev.filter((item) => item.id !== id));
        message.success("Xóa sản phẩm thành công");
      },
    });
  };

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const columns = [
    { title: "Mã máy", dataIndex: "id", key: "id" },
    { title: "Tên máy", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn giá", dataIndex: "price", key: "price" },
    {
      title: "Thêm",
      key: "add",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            value={quantities[record.id] || 1}
            onChange={(e) => handleQuantityChange(record.id, e.target.value)}
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
    { title: "Mã sản phẩm", dataIndex: "id", key: "id" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn giá", dataIndex: "price", key: "price" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              handleEditQuantity(
                record.id,
                prompt("Nhập số lượng mới:", record.quantity)
              )
            }
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteProduct(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="grid grid-cols-2 gap-4 flex-grow min-h-[500px]">
        <div className="bg-white p-4 shadow rounded flex flex-col flex-grow overflow-y-auto">
          <h3 className="font-bold mb-2 text-black">Chọn sản phẩm</h3>
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
              <Select.Option value="id">Mã máy</Select.Option>
              <Select.Option value="name">Tên máy</Select.Option>
              <Select.Option value="quantity">Số lượng</Select.Option>
              <Select.Option value="price">Đơn giá</Select.Option>
            </Select>
          </div>
          <Table
            dataSource={productData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            className="mt-2"
          />
        </div>

        <div className="bg-white p-4 shadow rounded flex flex-col flex-grow overflow-y-auto">
          <h3 className="font-bold mb-2 text-black">Thông tin xuất hàng</h3>
          <div className="flex flex-col gap-2 flex-grow overflow-hidden">
            <Input
              placeholder="Mã phiếu nhập"
              value={receiptCode}
              onChange={(e) => setReceiptCode(e.target.value)}
              className="border h-[50px] p-2 rounded-lg"
            />
            <Input
              placeholder="Người tạo phiếu"
              value={creator}
              disabled
              className="border h-[50px] p-2 rounded-lg bg-gray-100"
            />
            <div className="flex-grow overflow-hidden">
              {selectedProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Button type="primary" icon={<FileExcelOutlined />}>
                    Nhập Excel
                  </Button>
                </div>
              ) : (
                <Table
                  dataSource={selectedProducts}
                  columns={selectedColumns}
                  rowKey="id"
                  pagination={false}
                  scroll={{ y: 240 }}
                />
              )}
            </div>
          </div>
          <div className="border-t mt-4 pt-2 flex justify-between items-center font-bold bg-white p-4 shadow-md sticky bottom-0 w-full">
            <p>Tổng tiền: {totalAmount.toLocaleString()} VND</p>
            <Button type="primary" icon={<ExportOutlined />}>
              Xuất hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportGoods;
