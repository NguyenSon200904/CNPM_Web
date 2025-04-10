import { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Input,
  DatePicker,
  message,
  Modal,
  Form,
  Select,
  InputNumber,
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

const ExportReceipts = () => {
  const fileInputRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(1000000000);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editForm] = Form.useForm();
  const [_products, setProducts] = useState([]);
  const [editDetails, setEditDetails] = useState([]);
  const [roleToUserNameMap, setRoleToUserNameMap] = useState({}); // Ánh xạ role -> userName
  const [userNameToRoleMap, setUserNameToRoleMap] = useState({}); // Ánh xạ userName -> role

  // Lấy danh sách tài khoản và tạo ánh xạ role -> userName và userName -> role
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/users/list");
        const accounts = response.data;

        // Tạo ánh xạ role -> userName (chọn userName đầu tiên cho mỗi role)
        const roleMap = {};
        // Tạo ánh xạ userName -> role
        const userNameMap = {};
        accounts.forEach((account) => {
          if (!roleMap[account.role]) {
            roleMap[account.role] = account.userName;
          }
          userNameMap[account.userName] = account.role;
        });
        setRoleToUserNameMap(roleMap);
        setUserNameToRoleMap(userNameMap);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tài khoản:", error);
        message.error("Không thể tải danh sách tài khoản!");
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/inventory");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        message.error("Không thể tải danh sách sản phẩm!");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          "http://localhost:8080/api/export-receipts"
        );
        console.log("Dữ liệu phiếu xuất từ backend:", response.data);
        const formattedReceipts = response.data.map((receipt) => ({
          key: receipt.maPhieuXuat,
          id: receipt.maPhieuXuat,
          creator:
            userNameToRoleMap[receipt.nguoiTao?.userName] || "Không xác định", // Hiển thị role thay vì userName
          total: receipt.tongTien,
          date: moment(receipt.ngayXuat).format("YYYY-MM-DD HH:mm"),
          details: (receipt.chiTietPhieuXuats || []).map((detail) => ({
            maSanPham: detail.id?.maSanPham || "Không xác định",
            tenSanPham: detail.sanPham?.tenSanPham || "Không xác định",
            soLuong: detail.soLuong || 0,
            donGia: detail.donGia || 0,
          })),
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
  }, [userNameToRoleMap]); // Thêm userNameToRoleMap vào dependency để cập nhật lại khi ánh xạ thay đổi

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

  const editDetailColumns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "maSanPham",
      key: "maSanPham",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      render: (text, record) => (
        <InputNumber
          min={1}
          value={record.soLuong}
          disabled
          style={{ width: 100 }}
        />
      ),
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
              creator:
                userNameToRoleMap[receipt.nguoiTao?.userName] ||
                "Không xác định",
              total: receipt.tongTien,
              date: moment(receipt.ngayXuat).format("YYYY-MM-DD HH:mm"),
              details: (receipt.chiTietPhieuXuats || []).map((detail) => ({
                maSanPham: detail.id?.maSanPham || "Không xác định",
                tenSanPham: detail.sanPham?.tenSanPham || "Không xác định",
                soLuong: detail.soLuong || 0,
                donGia: detail.donGia || 0,
              })),
            }))
          );
          setSelectedRowKeys([]);
        } catch (error) {
          console.error("Lỗi khi xóa phiếu xuất:", error);
          message.error(
            "Xóa phiếu xuất thất bại: " +
              (error.response?.data?.error || error.message)
          );
        }
      },
    });
  };

  const handleViewDetail = async () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Vui lòng chọn đúng 1 phiếu xuất để xem chi tiết!");
      return;
    }

    const receiptId = selectedRowKeys[0];
    try {
      const response = await api.get(
        `http://localhost:8080/api/export-receipts/${receiptId}`
      );
      const receipt = response.data;
      console.log("Dữ liệu chi tiết phiếu xuất từ API:", receipt);
      setSelectedReceipt({
        key: receipt.maPhieuXuat,
        id: receipt.maPhieuXuat,
        creator:
          userNameToRoleMap[receipt.nguoiTao?.userName] || "Không xác định",
        total: receipt.tongTien,
        date: moment(receipt.ngayXuat).format("YYYY-MM-DD HH:mm"),
        details: (receipt.chiTietPhieuXuats || []).map((detail) => {
          console.log("Chi tiết sản phẩm:", detail);
          return {
            maSanPham: detail.id?.maSanPham || "Không xác định",
            tenSanPham: detail.sanPham?.tenSanPham || "Không xác định",
            soLuong: detail.soLuong || 0,
            donGia: detail.donGia || 0,
          };
        }),
      });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phiếu xuất:", error);
      message.error("Không thể tải chi tiết phiếu xuất!");
    }
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Vui lòng chọn đúng 1 phiếu xuất để chỉnh sửa!");
      return;
    }
    const selected = receipts.find((item) => item.key === selectedRowKeys[0]);
    setSelectedReceipt(selected);

    editForm.setFieldsValue({
      ngayXuat: moment(selected.date, "YYYY-MM-DD HH:mm"),
      nguoiTao: selected.creator, // Hiển thị role trong dropdown
    });

    const details = (selected.details || []).map((detail) => ({
      maSanPham: detail.maSanPham || "Không xác định",
      tenSanPham: detail.tenSanPham || "Không xác định",
      soLuong: detail.soLuong || 0,
      donGia: detail.donGia || 0,
      thanhTien: detail.soLuong * detail.donGia || 0,
    }));
    setEditDetails(details);

    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();

      if (editDetails.length === 0) {
        message.error("Danh sách chi tiết phiếu xuất không được rỗng!");
        return;
      }

      const invalidDetails = editDetails.filter(
        (detail) =>
          !detail.maSanPham ||
          !detail.soLuong ||
          detail.soLuong <= 0 ||
          !detail.donGia
      );
      if (invalidDetails.length > 0) {
        message.error(
          "Vui lòng điền đầy đủ thông tin cho tất cả chi tiết phiếu xuất!"
        );
        return;
      }

      const inventoryResponse = await api.get(
        "http://localhost:8080/api/inventory"
      );
      const inventory = inventoryResponse.data;

      for (const detail of editDetails) {
        const product = inventory.find((p) => p.maSanPham === detail.maSanPham);
        if (!product) {
          message.error(`Sản phẩm ${detail.maSanPham} không tồn tại!`);
          return;
        }
      }

      // Lấy userName tương ứng với role được chọn
      const selectedRole = values.nguoiTao;
      const selectedUserName = roleToUserNameMap[selectedRole];

      if (!selectedUserName) {
        message.error("Không tìm thấy tài khoản phù hợp cho vai trò đã chọn!");
        return;
      }

      const updatedReceipt = {
        ngayXuat: values.ngayXuat.format("YYYY-MM-DDTHH:mm:ss"),
        nguoiTao: { userName: selectedUserName },
        tongTien: editDetails.reduce(
          (total, detail) => total + detail.soLuong * detail.donGia,
          0
        ),
        chiTietPhieuXuats: editDetails.map((detail) => ({
          id: {
            maPhieuXuat: selectedReceipt.id,
            maSanPham: detail.maSanPham,
          },
          soLuong: detail.soLuong,
          donGia: detail.donGia,
        })),
      };

      console.log("Dữ liệu gửi lên:", updatedReceipt);
      await api.put(
        `http://localhost:8080/api/export-receipts/${selectedReceipt.id}`,
        updatedReceipt
      );

      message.success("Cập nhật phiếu xuất thành công!");

      const response = await api.get(
        "http://localhost:8080/api/export-receipts"
      );
      setReceipts(
        response.data.map((receipt) => ({
          key: receipt.maPhieuXuat,
          id: receipt.maPhieuXuat,
          creator:
            userNameToRoleMap[receipt.nguoiTao?.userName] || "Không xác định",
          total: receipt.tongTien,
          date: moment(receipt.ngayXuat).format("YYYY-MM-DD HH:mm"),
          details: (receipt.chiTietPhieuXuats || []).map((detail) => ({
            maSanPham: detail.id?.maSanPham || "Không xác định",
            tenSanPham: detail.sanPham?.tenSanPham || "Không xác định",
            soLuong: detail.soLuong || 0,
            donGia: detail.donGia || 0,
          })),
        }))
      );

      setIsEditModalOpen(false);
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi khi cập nhật phiếu xuất:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      message.error("Cập nhật phiếu xuất thất bại: " + errorMessage);
    }
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

        const inventoryResponse = await api.get(
          "http://localhost:8080/api/inventory"
        );
        const inventory = inventoryResponse.data.reduce((acc, item) => {
          acc[item.maSanPham] = item.soLuongTonKho;
          return acc;
        }, {});

        const errors = [];
        const receiptsToImport = [];

        const groupedData = jsonData.reduce((acc, row, index) => {
          const maPhieuXuat = row["Mã phiếu xuất"];
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

          acc[maPhieuXuat].tongTien =
            (acc[maPhieuXuat].tongTien || 0) + soLuong * donGia;

          return acc;
        }, {});

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

          // Kiểm tra xem nguoiTao có tồn tại trong bảng account không
          const userExists = Object.values(roleToUserNameMap).includes(
            receipt.nguoiTao
          );
          if (!userExists) {
            errors.push(
              `Phiếu xuất ${maPhieuXuat}: Người tạo "${receipt.nguoiTao}" không tồn tại.`
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

        const response = await api.get(
          "http://localhost:8080/api/export-receipts"
        );
        setReceipts(
          response.data.map((receipt) => ({
            key: receipt.maPhieuXuat,
            id: receipt.maPhieuXuat,
            creator:
              userNameToRoleMap[receipt.nguoiTao?.userName] || "Không xác định",
            total: receipt.tongTien,
            date: moment(receipt.ngayXuat).format("YYYY-MM-DD HH:mm"),
            details: (receipt.chiTietPhieuXuats || []).map((detail) => ({
              maSanPham: detail.id?.maSanPham || "Không xác định",
              tenSanPham: detail.sanPham?.tenSanPham || "Không xác định",
              soLuong: detail.soLuong || 0,
              donGia: detail.donGia || 0,
            })),
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

      <Modal
        title={`Chỉnh sửa phiếu xuất #${selectedReceipt?.id}`}
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={1000}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="ngayXuat"
            label="Thời gian tạo"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian tạo!" },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="nguoiTao"
            label="Người tạo"
            rules={[{ required: true, message: "Vui lòng chọn người tạo!" }]}
          >
            <Select placeholder="Chọn người tạo">
              {Object.keys(roleToUserNameMap).map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <Table
          dataSource={editDetails}
          columns={editDetailColumns}
          rowKey={(record) => record.maSanPham || Math.random().toString()}
          pagination={false}
        />
      </Modal>

      <Modal
        title={`Chi tiết phiếu xuất #${selectedReceipt?.id}`}
        open={isDetailModalOpen}
        onOk={() => setIsDetailModalOpen(false)}
        onCancel={() => setIsDetailModalOpen(false)}
        okText="OK"
        cancelText="Hủy"
        width={800}
      >
        {selectedReceipt && (
          <div>
            <p>
              <strong>Người tạo:</strong> {selectedReceipt.creator}
            </p>
            <p>
              <strong>Thời gian tạo:</strong> {selectedReceipt.date}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {selectedReceipt.total.toLocaleString()}đ
            </p>
            <h4 className="font-bold mt-2">Danh sách sản phẩm:</h4>
            {selectedReceipt.details.length > 0 ? (
              <Table
                dataSource={selectedReceipt.details.map((item, index) => ({
                  key: index,
                  maSanPham: item.maSanPham || "Không xác định",
                  tenSanPham: item.tenSanPham || "Không xác định",
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
                ]}
                pagination={false}
              />
            ) : (
              <p>Không có sản phẩm nào trong phiếu xuất này.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExportReceipts;
