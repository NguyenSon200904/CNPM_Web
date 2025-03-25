import { useState, useEffect, useRef } from "react";
import { Table, Button, Input, DatePicker, message, Modal } from "antd";
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const ImportReceipts = () => {
  const [dateRange, setDateRange] = useState([]);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(1000000000);
  const [receipts, setReceipts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/receipts");
      const formattedReceipts = response.data.map((receipt) => ({
        id: receipt.maPhieuNhap,
        supplier: receipt.nhaCungCap?.tenNhaCungCap || "Không có thông tin",
        creator: receipt.nguoiTao?.userName || "Không có thông tin",
        total: receipt.tongTien,
        date: moment(receipt.ngayNhap).format("YYYY-MM-DD HH:mm"),
        chiTietPhieuNhaps: receipt.chiTietPhieuNhaps || [],
      }));
      setReceipts(formattedReceipts);
    } catch (error) {
      message.error(
        "Không thể tải danh sách phiếu nhập: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một phiếu nhập để xóa!");
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} phiếu nhập?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map((id) =>
              axios.delete(`http://localhost:8080/api/receipts/${id}`)
            )
          );
          message.success("Xóa phiếu nhập thành công!");
          setSelectedRowKeys([]);
          fetchReceipts();
        } catch (error) {
          message.error(
            "Xóa phiếu nhập thất bại: " +
              (error.response?.data?.error || error.message)
          );
        }
      },
    });
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Vui lòng chọn đúng một phiếu nhập để sửa!");
      return;
    }

    const receiptToEdit = receipts.find((r) => r.id === selectedRowKeys[0]);
    navigate(`/edit-receipt/${receiptToEdit.id}`, {
      state: { receipt: receiptToEdit },
    });
  };

  const handleViewDetails = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Vui lòng chọn đúng một phiếu nhập để xem chi tiết!");
      return;
    }

    const receipt = receipts.find((r) => r.id === selectedRowKeys[0]);
    Modal.info({
      title: `Chi tiết phiếu nhập PN${receipt.id}`,
      content: (
        <div>
          <p>
            <strong>Nhà cung cấp:</strong> {receipt.supplier}
          </p>
          <p>
            <strong>Người tạo:</strong> {receipt.creator}
          </p>
          <p>
            <strong>Thời gian tạo:</strong> {receipt.date}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {receipt.total.toLocaleString()}đ
          </p>
          <h4 className="font-bold mt-2">Danh sách sản phẩm:</h4>
          {receipt.chiTietPhieuNhaps.length > 0 ? (
            <Table
              dataSource={receipt.chiTietPhieuNhaps.map((item, index) => ({
                key: index,
                maSanPham: item.id?.maSanPham || "Không có thông tin",
                tenSanPham: item.product?.tenSanPham || "Không có thông tin",
                loaiSanPham: item.loaiSanPham || "Không có thông tin",
                soLuong: item.soLuong,
                donGia: item.donGia,
              }))}
              columns={[
                {
                  title: "Mã sản phẩm",
                  dataIndex: "maSanPham",
                  key: "maSanPham",
                },
                {
                  title: "Tên sản phẩm",
                  dataIndex: "tenSanPham",
                  key: "tenSanPham",
                },
                {
                  title: "Loại sản phẩm",
                  dataIndex: "loaiSanPham",
                  key: "loaiSanPham",
                },
                { title: "Số lượng", dataIndex: "soLuong", key: "soLuong" },
                {
                  title: "Đơn giá",
                  dataIndex: "donGia",
                  key: "donGia",
                  render: (value) => `${value.toLocaleString()}đ`,
                },
              ]}
              pagination={false}
            />
          ) : (
            <p>Không có sản phẩm nào trong phiếu nhập này.</p>
          )}
        </div>
      ),
      width: 800,
      onOk() {},
    });
  };

  const handleExportExcel = () => {
    if (filteredReceipts.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }

    const exportData = filteredReceipts.map((receipt) => ({
      "Mã phiếu nhập": `PN${receipt.id}`,
      "Nhà cung cấp": receipt.supplier,
      "Người tạo": receipt.creator,
      "Thời gian tạo": receipt.date,
      "Tổng tiền": receipt.total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");
    XLSX.writeFile(workbook, "phieu_nhap_export.xlsx");
    message.success("Xuất file Excel thành công!");
  };

  const handleImportExcel = (event) => {
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

        const errors = [];
        const newReceipts = [];

        for (const row of jsonData) {
          const userName = row["Người tạo"]?.toString();
          const ngayNhap = row["Thời gian tạo"]?.toString();
          const tongTien = Number(row["Tổng tiền"]);
          const maNhaCungCap = row["Mã nhà cung cấp"]?.toString();

          if (!userName || !ngayNhap || isNaN(tongTien) || !maNhaCungCap) {
            errors.push(
              `Dòng ${
                jsonData.indexOf(row) + 2
              }: Thiếu thông tin bắt buộc hoặc tổng tiền không hợp lệ.`
            );
            continue;
          }

          const receiptData = {
            ngayNhap: moment(ngayNhap, "YYYY-MM-DD HH:mm").format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
            tongTien,
            nguoiTao: { userName },
            nhaCungCap: { maNhaCungCap },
            chiTietPhieuNhaps: [], // Cần thêm logic để nhập chi tiết từ file Excel
          };

          try {
            await axios.post("http://localhost:8080/api/receipts", receiptData);
            newReceipts.push(receiptData);
          } catch (error) {
            errors.push(
              `Dòng ${jsonData.indexOf(row) + 2}: Lỗi khi thêm phiếu nhập (${
                error.response?.data?.error || error.message
              }).`
            );
          }
        }

        if (newReceipts.length > 0) {
          fetchReceipts();
          message.success(
            `Đã nhập thành công ${newReceipts.length} phiếu nhập!`
          );
        }
        if (errors.length > 0) {
          message.warning(`Có ${errors.length} lỗi:\n${errors.join("\n")}`);
        }
      } catch (error) {
        message.error("Lỗi khi đọc file Excel: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = null;
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "Mã phiếu nhập",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (value) => `PN${value}`,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  return (
    <div className="p-4">
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
          onClick={handleEdit}
        >
          Sửa
        </Button>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          className="min-w-[100px] h-[50px]"
          onClick={handleViewDetails}
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
    </div>
  );
};

export default ImportReceipts;
