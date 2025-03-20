import { useState, useEffect } from "react";
import { Button, Input, Select, Table } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const Product = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("id");
  const [loaiSanPham, setLoaiSanPham] = useState("MAY_TINH"); // Mặc định là Máy Tính
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu từ backend khi loaiSanPham thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/products", {
          params: { loaiSanPham },
        });
        setData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loaiSanPham]);

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredData = data.filter((item) =>
    item[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cấu hình cột bảng động dựa trên loaiSanPham
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
      render: (gia) => `${gia.toLocaleString()}đ`,
    },
    ...(loaiSanPham === "MAY_TINH"
      ? [
          {
            title: "CPU",
            dataIndex: "tenCpu",
            key: "tenCpu",
            responsive: ["md"],
          },
          {
            title: "Card màn hình",
            dataIndex: "cardManHinh",
            key: "cardManHinh",
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

  // Xử lý hành động (cơ bản, sẽ mở rộng sau)
  const handleAdd = () => {
    console.log("Thêm sản phẩm mới");
    // Logic thêm sản phẩm (hiện tại chỉ log, cần form sau)
  };

  const handleEdit = () => {
    console.log("Sửa sản phẩm");
    // Logic sửa sản phẩm (cần chọn sản phẩm trước)
  };

  const handleDelete = () => {
    console.log("Xóa sản phẩm");
    // Logic xóa sản phẩm (cần chọn sản phẩm trước)
  };

  const handleViewDetail = () => {
    console.log("Xem chi tiết sản phẩm");
    // Logic xem chi tiết (cần chọn sản phẩm trước)
  };

  const handleExportExcel = () => {
    console.log("Xuất Excel");
    // Logic xuất Excel
  };

  const handleImportExcel = () => {
    console.log("Nhập Excel");
    // Logic nhập Excel
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>

      {/* Tìm kiếm, Bộ lọc và Chọn loại sản phẩm */}
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
              <>
                <Option value="tenCpu">CPU</Option>
                <Option value="cardManHinh">Card màn hình</Option>
              </>
            ) : (
              <>
                <Option value="heDieuHanh">Hệ điều hành</Option>
                <Option value="doPhanGiaiCamera">Độ phân giải camera</Option>
              </>
            )}
            <Option value="ram">RAM</Option>
            <Option value="rom">Bộ nhớ</Option>
            <Option value="loaiSanPham">Loại sản phẩm</Option>
          </Select>
          <Select
            value={loaiSanPham}
            onChange={setLoaiSanPham}
            className="w-40 h-[50px]"
          >
            <Option value="MAY_TINH">Máy Tính</Option>
            <Option value="DIEN_THOAI">Điện Thoại</Option>
          </Select>
        </div>

        {/* Nhóm chức năng */}
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
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                className="min-w-[100px] h-[50px]"
                onClick={handleImportExcel}
              >
                Nhập Excel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 7 }}
        rowKey="maSanPham"
        bordered
        loading={loading}
      />
    </div>
  );
};

export default Product;
