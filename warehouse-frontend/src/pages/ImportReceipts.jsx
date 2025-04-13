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
  Drawer,
  Menu,
  Dropdown,
} from "antd";
import {
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MenuOutlined,
  DownOutlined,
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
  const [suppliers, setSuppliers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [form] = Form.useForm();
  const [userNameToRoleMap, setUserNameToRoleMap] = useState({});
  const [roleToUserNameMap, setRoleToUserNameMap] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

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
        const response = await api.get("http://localhost:8080/api/users/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const accounts = response.data;
        console.log("Dữ liệu từ API /api/accounts:", accounts);

        const userNameMap = {};
        const roleMap = {};
        accounts.forEach((account) => {
          if (!roleMap[account.role]) {
            roleMap[account.role] = account.userName;
          }
          userNameMap[account.userName] = account.role;
        });
        setUserNameToRoleMap(userNameMap);
        setRoleToUserNameMap(roleMap);
      } catch (error) {
        message.error("Không thể tải danh sách tài khoản: " + error.message);
      }
    };

    fetchAccounts();
  }, [message]);

  useEffect(() => {
    fetchReceipts();
  }, [userNameToRoleMap]);

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
      console.log("Dữ liệu từ API /api/receipts:", response.data);

      const formattedReceipts = response.data.map((receipt) => {
        console.log("Dữ liệu nguoiTao:", receipt.nguoiTao);
        console.log("Chi tiết phiếu nhập:", receipt.details);

        return {
          key: receipt.maPhieu,
          id: receipt.maPhieu,
          supplier: receipt.maNhaCungCap || "Không có thông tin",
          creator: userNameToRoleMap[receipt.nguoiTao] || "Không có thông tin",
          total: receipt.tongTien,
          date: moment(receipt.thoiGianTao).format("YYYY-MM-DD HH:mm"),
          chiTietPhieuNhaps: (receipt.details || []).map((detail) => ({
            maSanPham: detail.maSanPham || "Không có thông tin",
            tenSanPham: detail.sanPham?.tenSanPham || "Không có thông tin",
            loaiSanPham: detail.loaiSanPham || "Không có thông tin",
            soLuongCoTheNhap: detail.soLuong || 0,
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
    console.log("Dữ liệu phiếu nhập được chọn:", receiptToEdit);
    console.log(
      "Chi tiết phiếu nhập trong handleEdit:",
      receiptToEdit.chiTietPhieuNhaps
    );

    setSelectedReceipt(receiptToEdit);
    form.setFieldsValue({
      maNhaCungCap: receiptToEdit.supplier,
      nguoiTao: receiptToEdit.creator,
      chiTietPhieuNhaps: receiptToEdit.chiTietPhieuNhaps.map((item) => ({
        maSanPham: item.maSanPham,
        tenSanPham: item.tenSanPham || "Không có thông tin",
        soLuongCoTheNhap: item.soLuongCoTheNhap,
        donGia: item.donGia,
      })),
    });
    fetchSuppliers();
    setIsEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();

      const selectedRole = values.nguoiTao;
      const selectedUserName = roleToUserNameMap[selectedRole];
      if (!selectedUserName) {
        message.error("Không tìm thấy tài khoản phù hợp cho vai trò đã chọn!");
        return;
      }

      const updatedReceipt = {
        maPhieu: selectedReceipt.id,
        maNhaCungCap: values.maNhaCungCap,
        nguoiTao: selectedUserName,
      };

      console.log("Dữ liệu gửi lên server:", updatedReceipt);

      await api.put(
        `http://localhost:8080/api/receipts/${selectedReceipt.id}`,
        updatedReceipt,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      message.success("Cập nhật phiếu nhập thành công!");
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
      title: `Chi tiết phiếu nhập #${receipt.id}`,
      content: (
        <div className="max-h-[60vh] overflow-y-auto">
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
                  ellipsis: true,
                },
                {
                  title: "Loại sản phẩm",
                  dataIndex: "loaiSanPham",
                  key: "loaiSanPham",
                  responsive: ["sm"],
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
                  responsive: ["sm"],
                },
              ]}
              pagination={false}
              scroll={{ x: isMobile ? 300 : "max-content" }}
              className="custom-table"
            />
          ) : (
            <p>Không có sản phẩm nào trong phiếu nhập này.</p>
          )}
        </div>
      ),
      width: isMobile ? "90%" : 800,
      onOk() {},
    });
  };

  const handleExportExcel = () => {
    if (filteredReceipts.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }

    const exportData = filteredReceipts.map((receipt) => ({
      "Mã phiếu nhập": receipt.id,
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
            nguoiTao: userName,
            maNhaCungCap,
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
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
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
      responsive: ["sm"],
    },
    {
      title: "Thời gian tạo",
      dataIndex: "date",
      key: "date",
      align: "center",
      responsive: ["md"],
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (value) => `${value.toLocaleString()}đ`,
    },
  ];

  const expandedRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Mã phiếu nhập:</strong> {record.id}
      </p>
      <p>
        <strong>Nhà cung cấp:</strong> {record.supplier}
      </p>
      <p>
        <strong>Người tạo:</strong> {record.creator}
      </p>
      <p>
        <strong>Thời gian tạo:</strong> {record.date}
      </p>
      <p>
        <strong>Tổng tiền:</strong> {record.total.toLocaleString()}đ
      </p>
    </div>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  const menu = (
    <Menu>
      <Menu.Item key="delete" onClick={handleDelete}>
        <DeleteOutlined /> Xóa
      </Menu.Item>
      <Menu.Item key="edit" onClick={handleEdit}>
        <EditOutlined /> Sửa
      </Menu.Item>
      <Menu.Item key="view" onClick={handleViewDetails}>
        <EyeOutlined /> Xem chi tiết
      </Menu.Item>
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
          PHIẾU NHẬP
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
          {isMobile ? (
            <Dropdown overlay={menu}>
              <Button className="min-w-[100px] h-12 text-base">
                Thao tác <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                className="min-w-[100px] h-12 text-base"
                onClick={handleDelete}
              >
                Xóa
              </Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="min-w-[100px] h-12 text-base"
                onClick={handleEdit}
              >
                Sửa
              </Button>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                className="min-w-[100px] h-12 text-base"
                onClick={handleViewDetails}
              >
                Xem chi tiết
              </Button>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                className="min-w-[100px] h-12 text-base"
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
                className="min-w-[100px] h-12 text-base"
                onClick={() => fileInputRef.current.click()}
              >
                Nhập Excel
              </Button>
            </>
          )}
        </div>

        <div
          className={`grid ${
            isMobile ? "grid-cols-1" : "grid-cols-2"
          } gap-6 mb-6 sm:mb-8`}
        >
          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-bold mb-2 text-black text-base sm:text-lg">
              Lọc theo ngày
            </h3>
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              className="w-full h-12 text-base rounded-lg"
            />
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-bold mb-2 text-black text-base sm:text-lg">
              Lọc theo giá
            </h3>
            <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-3`}>
              <Input
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(Number(e.target.value))}
                placeholder="Giá từ"
                className="w-full h-12 text-base rounded-lg"
              />
              <Input
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(Number(e.target.value))}
                placeholder="Giá đến"
                className="w-full h-12 text-base rounded-lg"
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
            expandable={{
              expandedRowRender,
              expandRowByClick: true,
            }}
            pagination={{ pageSize: 4 }}
            bordered
            loading={loading}
            scroll={{ x: isMobile ? 300 : "max-content" }}
            className="custom-table"
          />
        </div>

        <Modal
          title={`Sửa phiếu nhập ${selectedReceipt?.id}`}
          open={isEditModalOpen}
          onOk={handleEditOk}
          onCancel={() => setIsEditModalOpen(false)}
          width={isMobile ? "90%" : 800}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="maNhaCungCap"
              label="Nhà cung cấp"
              rules={[
                { required: true, message: "Vui lòng chọn nhà cung cấp!" },
              ]}
            >
              <Select
                placeholder="Chọn nhà cung cấp"
                className="h-12 text-base rounded-lg"
              >
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

            <Form.Item
              name="nguoiTao"
              label="Người tạo"
              rules={[{ required: true, message: "Vui lòng chọn người tạo!" }]}
            >
              <Select
                placeholder="Chọn người tạo"
                className="h-12 text-base rounded-lg"
              >
                {Object.keys(roleToUserNameMap).length > 0 ? (
                  Object.keys(roleToUserNameMap).map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))
                ) : (
                  <Option disabled value="">
                    Không có vai trò nào
                  </Option>
                )}
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
                        <Input disabled className="h-12 text-base rounded-lg" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "tenSanPham"]}
                        label="Tên sản phẩm"
                      >
                        <Input disabled className="h-12 text-base rounded-lg" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "soLuongCoTheNhap"]}
                        label="Số lượng"
                      >
                        <InputNumber
                          disabled
                          style={{ width: "100%" }}
                          className="h-12 text-base rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "donGia"]}
                        label="Đơn giá"
                      >
                        <InputNumber
                          disabled
                          style={{ width: "100%" }}
                          className="h-12 text-base rounded-lg"
                        />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
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

export default ImportReceipts;
