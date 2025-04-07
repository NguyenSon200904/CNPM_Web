import { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Input,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  Select,
  App,
} from "antd";
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
const { Option } = Select;

const ImportReceipts = () => {
  const { message } = App.useApp();
  const [dateRange, setDateRange] = useState([]);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(100000000000);
  const [receipts, setReceipts] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // Thêm state để lưu danh sách nhà cung cấp
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  // Lấy danh sách nhà cung cấp khi mở modal chỉnh sửa
  const fetchSuppliers = async () => {
    try {
      const response = await api.get("http://localhost:8080/api/suppliers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSuppliers(response.data);
    } catch (error) {
      message.error(
        "Không thể tải danh sách nhà cung cấp: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await api.get("http://localhost:8080/api/receipts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Dữ liệu từ API /api/receipts:", response.data); // Kiểm tra dữ liệu trả về

      const formattedReceipts = response.data.map((receipt) => {
        // Kiểm tra dữ liệu trong receipt.details
        console.log("Chi tiết phiếu nhập:", receipt.details);

        return {
          id: receipt.maPhieu,
          supplier: receipt.maNhaCungCap || "Không có thông tin",
          creator: receipt.nguoiTao || "Không có thông tin",
          total: receipt.tongTien,
          date: moment(receipt.thoiGianTao).format("YYYY-MM-DD HH:mm"),
          chiTietPhieuNhaps: (receipt.details || []).map((detail) => ({
            maSanPham: detail.maSanPham || "Không có thông tin",
            tenSanPham: detail.sanPham?.tenSanPham || "Không có thông tin",
            loaiSanPham: detail.loaiSanPham || "Không có thông tin",
            soLuongCoTheNhap: detail.soLuong || 0, // Ánh xạ đúng trường số lượng từ API
            donGia: detail.donGia || 0,
          })),
        };
      });
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
              api.delete(`http://localhost:8080/api/receipts/${id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              })
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
    console.log("Dữ liệu phiếu nhập được chọn:", receiptToEdit); // Kiểm tra dữ liệu phiếu nhập
    console.log(
      "Chi tiết phiếu nhập trong handleEdit:",
      receiptToEdit.chiTietPhieuNhaps
    ); // Kiểm tra chi tiết phiếu nhập

    setSelectedReceipt(receiptToEdit);
    form.setFieldsValue({
      maNhaCungCap: receiptToEdit.supplier,
      chiTietPhieuNhaps: receiptToEdit.chiTietPhieuNhaps.map((item) => ({
        maSanPham: item.maSanPham,
        tenSanPham: item.tenSanPham || "Không có thông tin",
        soLuongCoTheNhap: item.soLuongCoTheNhap,
        donGia: item.donGia,
      })),
    });
    fetchSuppliers(); // Lấy danh sách nhà cung cấp khi mở modal
    setIsEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();

      // Lấy danh sách sản phẩm từ API để kiểm tra số lượng
      const productsResponse = await api.get(
        "http://localhost:8080/api/products",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const products = productsResponse.data;

      // Kiểm tra số lượng trước khi gửi yêu cầu
      for (let i = 0; i < values.chiTietPhieuNhaps.length; i++) {
        const item = values.chiTietPhieuNhaps[i];
        const oldItem = selectedReceipt.chiTietPhieuNhaps[i];
        const delta = item.soLuongCoTheNhap - oldItem.soLuongCoTheNhap;

        // Tìm sản phẩm trong danh sách
        const product = products.find((p) => p.maSanPham === item.maSanPham);
        if (!product) {
          message.error(`Sản phẩm ${item.maSanPham} không tồn tại!`);
          return;
        }

        // Kiểm tra số lượng trong kho
        const currentSoLuongCoTheNhap = product.soLuongCoTheNhap;
        if (currentSoLuongCoTheNhap + delta < 0) {
          message.error(
            `Số lượng trong kho không đủ! Sản phẩm ${item.maSanPham} chỉ còn ${currentSoLuongCoTheNhap} đơn vị.`
          );
          return;
        }
      }

      // Nếu kiểm tra hợp lệ, gửi yêu cầu cập nhật
      const updatedReceipt = {
        maPhieu: selectedReceipt.id,
        maNhaCungCap: values.maNhaCungCap,
        details: values.chiTietPhieuNhaps.map((item, index) => ({
          maSanPham: selectedReceipt.chiTietPhieuNhaps[index].maSanPham,
          soLuongCoTheNhap: item.soLuongCoTheNhap,
          donGia: selectedReceipt.chiTietPhieuNhaps[index].donGia,
        })),
      };

      await api.put(
        `http://localhost:8080/api/receipts/${selectedReceipt.id}`,
        updatedReceipt,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      message.success(
        "Cập nhật phiếu nhập thành công! Vui lòng làm mới trang sản phẩm để thấy thay đổi."
      );
      setIsEditModalOpen(false);
      fetchReceipts();
      setSelectedRowKeys([]);
    } catch (error) {
      message.error(
        "Cập nhật phiếu nhập thất bại: " +
          (error.response?.data?.error || error.message)
      );
    }
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
                maSanPham: item.maSanPham || "Không có thông tin",
                tenSanPham: item.tenSanPham || "Không có thông tin",
                loaiSanPham: item.loaiSanPham || "Không có thông tin",
                soLuongCoTheNhap: item.soLuongCoTheNhap,
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
                {
                  title: "Số lượng",
                  dataIndex: "soLuongCoTheNhap",
                  key: "soLuongCoTheNhap",
                },
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
            chiTietPhieuNhaps: [],
          };

          try {
            await api.post("http://localhost:8080/api/receipts", receiptData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            });
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

      {/* Modal chỉnh sửa phiếu nhập */}
      <Modal
        title={`Sửa phiếu nhập PN${selectedReceipt?.id}`}
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalOpen(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="maNhaCungCap"
            label="Nhà cung cấp"
            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
          >
            <Select placeholder="Chọn nhà cung cấp">
              {suppliers.map((supplier) => (
                <Option
                  key={supplier.maNhaCungCap}
                  value={supplier.maNhaCungCap}
                >
                  {`${supplier.maNhaCungCap} - ${supplier.tenNhaCungCap}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <h4 className="font-bold mt-4">Danh sách sản phẩm</h4>
          <Form.List name="chiTietPhieuNhaps">
            {(fields) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border p-2 mb-2 rounded">
                    <Form.Item
                      {...restField}
                      name={[name, "maSanPham"]}
                      label="Mã sản phẩm"
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "tenSanPham"]}
                      label="Tên sản phẩm"
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "soLuongCoTheNhap"]}
                      label="Số lượng"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng!" },
                      ]}
                    >
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "donGia"]}
                      label="Đơn giá"
                    >
                      <InputNumber disabled style={{ width: "100%" }} />
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ImportReceipts;
