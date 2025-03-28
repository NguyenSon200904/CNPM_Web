import { useState, useEffect, useRef } from "react";
import { Table, Button, Input, DatePicker, message, Modal } from "antd";
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../api";
import * as XLSX from "xlsx";
import moment from "moment";

const { RangePicker } = DatePicker;

const ExportReceipts = () => {
  const fileInputRef = useRef(null);
  const [dateRange, setDateRange] = useState([]);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(1000000000);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          "http://localhost:8080/api/export-receipts"
        );
        const formattedReceipts = response.data.map((receipt) => ({
          key: receipt.maPhieuXuat,
          id: receipt.maPhieuXuat,
          creator: receipt.nguoiTao?.userName || "Không xác định",
          total: receipt.tongTien,
          date: moment(receipt.ngayXuat).format("YYYY-MM-DD HH:mm"),
          details: receipt.chiTietPhieuXuats,
        }));
        setReceipts(formattedReceipts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu xuất:", error);
        message.error("Không thể tải danh sách phiếu xuất!");
        setReceipts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  // Lọc dữ liệu theo khoảng ngày & giá tiền
  const filteredReceipts = receipts.filter((r) => {
    const receiptDate = new Date(r.date);
    const startDate = dateRange[0] ? new Date(dateRange[0]) : null;
    const endDate = dateRange[1] ? new Date(dateRange[1]) : null;

    return (
      (!startDate || receiptDate >= startDate) &&
      (!endDate || receiptDate <= endDate) &&
      r.total >= priceFrom &&
      r.total <= priceTo
    );
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "Mã phiếu xuất",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      key: "creator",
      align: "center",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (value) => `${value.toLocaleString()}đ`,
    },
  ];

  // Cột cho bảng chi tiết phiếu xuất
  const detailColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "maSanPham",
      key: "maSanPham",
      render: (_, record) => record.id.maSanPham,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
      render: (_, record) => record.sanPham?.tenSanPham || "Không xác định",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "donGia",
      render: (value) => `${value.toLocaleString()}đ`,
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      key: "thanhTien",
      render: (_, record) =>
        `${(record.soLuong * record.donGia).toLocaleString()}đ`,
    },
  ];

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 phiếu xuất để xóa!");
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa các phiếu xuất đã chọn không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map((key) =>
              api.delete(`http://localhost:8080/api/export-receipts/${key}`)
            )
          );
          message.success("Xóa phiếu xuất thành công!");
          const response = await api.get(
            "http://localhost:8080/api/export-receipts"
          );
          setReceipts(
            response.data.map((receipt) => ({
              key: receipt.maPhieuXuat,
              id: receipt.maPhieuXuat,
              creator: receipt.nguoiTao?.userName || "Không xác định",
              total: receipt.tongTien,
              date: moment(receipt.ngayXuat).format("YYYY-MM-DD HH:mm"),
              details: receipt.chiTietPhieuXuats,
            }))
          );
          setSelectedRowKeys([]);
        } catch (error) {
          console.error("Lỗi khi xóa phiếu xuất:", error);
          message.error("Xóa phiếu xuất thất bại!");
        }
      },
    });
  };

  const handleViewDetail = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Vui lòng chọn đúng 1 phiếu xuất để xem chi tiết!");
      return;
    }
    const selected = receipts.find((item) => item.key === selectedRowKeys[0]);
    setSelectedReceipt(selected);
    setIsDetailModalOpen(true);
  };

  const handleExportExcel = () => {
    const exportData = filteredReceipts.map((receipt) => ({
      "Mã phiếu xuất": receipt.id,
      "Người tạo": receipt.creator,
      "Thời gian tạo": receipt.date,
      "Tổng tiền": receipt.total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExportReceipts");
    XLSX.writeFile(workbook, "export-receipts.xlsx");
    message.success("Xuất Excel thành công!");
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      message.error("Vui lòng chọn file Excel!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
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

        // Lấy danh sách tồn kho để kiểm tra số lượng
        const inventoryResponse = await api.get(
          "http://localhost:8080/api/inventory"
        );
        const inventory = inventoryResponse.data.reduce((acc, item) => {
          acc[item.maSanPham] = item.soLuongTonKho;
          return acc;
        }, {});

        const errors = [];
        const receiptsToImport = [];

        // Nhóm dữ liệu theo mã phiếu xuất
        const groupedData = jsonData.reduce((acc, row, index) => {
          const maPhieuXuat = row["Mã phiếu xuất"]?.toString();
          if (!maPhieuXuat) {
            errors.push(`Dòng ${index + 2}: Thiếu mã phiếu xuất.`);
            return acc;
          }

          if (!acc[maPhieuXuat]) {
            acc[maPhieuXuat] = {
              ngayXuat: row["Thời gian tạo"],
              tongTien: Number(row["Tổng tiền"]),
              nguoiTao: row["Người tạo"]?.toString(),
              chiTietPhieuXuats: [],
            };
          }

          const maSanPham = row["Mã sản phẩm"]?.toString();
          const soLuong = Number(row["Số lượng"]);
          const donGia = Number(row["Đơn giá"]);

          if (!maSanPham || isNaN(soLuong) || isNaN(donGia)) {
            errors.push(
              `Dòng ${
                index + 2
              }: Dữ liệu không hợp lệ (thiếu hoặc sai định dạng).`
            );
            return acc;
          }

          if (soLuong < 1) {
            errors.push(
              `Dòng ${
                index + 2
              }: Số lượng phải lớn hơn 0 (Mã sản phẩm: ${maSanPham}).`
            );
            return acc;
          }

          const soLuongTonKho = inventory[maSanPham] || 0;
          if (soLuong > soLuongTonKho) {
            errors.push(
              `Dòng ${
                index + 2
              }: Số lượng xuất (${soLuong}) vượt quá số lượng tồn kho (${soLuongTonKho}) cho sản phẩm ${maSanPham}.`
            );
            return acc;
          }

          acc[maPhieuXuat].chiTietPhieuXuats.push({
            id: {
              maPhieuXuat: null,
              maSanPham: maSanPham,
            },
            soLuong: soLuong,
            donGia: donGia,
          });

          // Cập nhật tổng tiền
          acc[maPhieuXuat].tongTien =
            (acc[maPhieuXuat].tongTien || 0) + soLuong * donGia;

          return acc;
        }, {});

        // Chuyển groupedData thành mảng receiptsToImport
        for (const maPhieuXuat in groupedData) {
          const receipt = groupedData[maPhieuXuat];
          if (
            !receipt.ngayXuat ||
            !moment(receipt.ngayXuat, "YYYY-MM-DD HH:mm", true).isValid()
          ) {
            errors.push(
              `Phiếu xuất ${maPhieuXuat}: Thời gian tạo không hợp lệ.`
            );
            continue;
          }
          if (!receipt.nguoiTao) {
            errors.push(`Phiếu xuất ${maPhieuXuat}: Thiếu người tạo.`);
            continue;
          }
          if (receipt.chiTietPhieuXuats.length === 0) {
            errors.push(
              `Phiếu xuất ${maPhieuXuat}: Không có chi tiết phiếu xuất.`
            );
            continue;
          }

          receiptsToImport.push({
            ngayXuat: moment(receipt.ngayXuat).format("YYYY-MM-DDTHH:mm:ss"),
            tongTien: receipt.tongTien,
            nguoiTao: { userName: receipt.nguoiTao },
            chiTietPhieuXuats: receipt.chiTietPhieuXuats,
          });
        }

        if (errors.length > 0) {
          message.error(`Có ${errors.length} lỗi:\n${errors.join("\n")}`);
          return;
        }

        if (receiptsToImport.length === 0) {
          message.error("Không có phiếu xuất hợp lệ để nhập!");
          return;
        }

        // Gửi từng phiếu xuất lên backend
        await Promise.all(
          receiptsToImport.map(async (receiptData) => {
            await api.post(
              "http://localhost:8080/api/export-receipts",
              receiptData
            );
          })
        );

        message.success(
          `Nhập thành công ${receiptsToImport.length} phiếu xuất từ Excel!`
        );

        // Cập nhật lại danh sách phiếu xuất
        const response = await api.get(
          "http://localhost:8080/api/export-receipts"
        );
        setReceipts(
          response.data.map((receipt) => ({
            key: receipt.maPhieuXuat,
            id: receipt.maPhieuXuat,
            creator: receipt.nguoiTao?.userName || "Không xác định",
            total: receipt.tongTien,
            date: moment(receipt.ngayXuat).format("YYYY-MM-DD HH:mm"),
            details: receipt.chiTietPhieuXuats,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi nhập Excel:", error);
        message.error(
          "Nhập Excel thất bại: " +
            (error.response?.data?.error || error.message)
        );
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = null;
  };

  return (
    <div className="p-4">
      {/* Thanh công cụ */}
      <div className="flex gap-2 mb-4">
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          className="min-w-[100px] h-[50px]"
          onClick={handleDelete}
        >
          Xóa
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          className="min-w-[100px] h-[50px]"
          disabled // Chưa triển khai chức năng sửa
        >
          Sửa
        </Button>
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
      </div>

      {/* Bộ lọc */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2 text-black">Lọc theo ngày</h3>
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            className="w-full"
          />
        </div>
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2 text-black">Lọc theo giá</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              value={priceFrom}
              onChange={(e) => setPriceFrom(Number(e.target.value))}
              placeholder="Giá từ"
            />
            <Input
              type="number"
              value={priceTo}
              onChange={(e) => setPriceTo(Number(e.target.value))}
              placeholder="Giá đến"
            />
          </div>
        </div>
      </div>

      {/* Danh sách phiếu xuất */}
      <div className="bg-white p-4 shadow rounded">
        <Table
          rowSelection={rowSelection}
          dataSource={filteredReceipts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
          loading={loading}
        />
      </div>

      {/* Modal xem chi tiết */}
      <Modal
        title={`Chi tiết phiếu xuất #${selectedReceipt?.id}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={selectedReceipt?.details}
          columns={detailColumns}
          rowKey={(record) => record.id.maSanPham}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default ExportReceipts;
