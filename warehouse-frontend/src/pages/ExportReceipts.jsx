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
  const [roleToUserNameMap, setRoleToUserNameMap] = useState({});
  const [userNameToRoleMap, setUserNameToRoleMap] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

        const roleMap = {};
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
        const response = await api.get("http://localhost:8080/api/inventory", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
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
          "http://localhost:8080/api/export-receipts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log("Dữ liệu phiếu xuất từ backend:", response.data);
        const formattedReceipts = response.data.map((receipt) => ({
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
  }, [userNameToRoleMap]);

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

  const detailColumns = [
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
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "donGia",
      render: (value) => `${value.toLocaleString()}đ`,
      responsive: ["sm"],
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      key: "thanhTien",
      render: (_, record) =>
        `${(record.soLuong * record.donGia).toLocaleString()}đ`,
      responsive: ["sm"],
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
      ellipsis: true,
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
          style={{ width: "100%" }}
          className="h-12 text-base rounded-lg"
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "donGia",
      render: (value) => `${value.toLocaleString()}đ`,
      responsive: ["sm"],
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      key: "thanhTien",
      render: (_, record) =>
        `${(record.soLuong * record.donGia).toLocaleString()}đ`,
      responsive: ["sm"],
    },
  ];

  const expandedRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Mã phiếu xuất:</strong> {record.id}
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

  const expandedDetailRowRender = (record) => (
    <div className="p-2">
      <p>
        <strong>Mã sản phẩm:</strong> {record.maSanPham}
      </p>
      <p>
        <strong>Tên sản phẩm:</strong> {record.tenSanPham}
      </p>
      <p>
        <strong>Số lượng:</strong> {record.soLuong}
      </p>
      <p>
        <strong>Đơn giá:</strong> {record.donGia.toLocaleString()}đ
      </p>
      <p>
        <strong>Thành tiền:</strong>{" "}
        {(record.soLuong * record.donGia).toLocaleString()}đ
      </p>
    </div>
  );

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
              api.delete(`http://localhost:8080/api/export-receipts/${key}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              })
            )
          );
          message.success("Xóa phiếu xuất thành công!");
          const response = await api.get(
            "http://localhost:8080/api/export-receipts",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
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
        `http://localhost:8080/api/export-receipts/${receiptId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
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
      nguoiTao: selected.creator,
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
        "http://localhost:8080/api/inventory",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const inventory = inventoryResponse.data;

      for (const detail of editDetails) {
        const product = inventory.find((p) => p.maSanPham === detail.maSanPham);
        if (!product) {
          message.error(`Sản phẩm ${detail.maSanPham} không tồn tại!`);
          return;
        }
      }

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
        updatedReceipt,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      message.success("Cập nhật phiếu xuất thành công!");

      const response = await api.get(
        "http://localhost:8080/api/export-receipts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
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
    if (filteredReceipts.length === 0) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }

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
          "http://localhost:8080/api/inventory",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
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
              receiptData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
          })
        );

        message.success(
          `Nhập thành công ${receiptsToImport.length} phiếu xuất từ Excel!`
        );

        const response = await api.get(
          "http://localhost:8080/api/export-receipts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
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
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="delete" onClick={handleDelete}>
        <DeleteOutlined /> Xóa
      </Menu.Item>
      <Menu.Item key="edit" onClick={handleEdit}>
        <EditOutlined /> Sửa
      </Menu.Item>
      <Menu.Item key="view" onClick={handleViewDetail}>
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
          PHIẾU XUẤT
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
                onClick={handleViewDetail}
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
          title={`Chỉnh sửa phiếu xuất #${selectedReceipt?.id}`}
          open={isEditModalOpen}
          onOk={handleSaveEdit}
          onCancel={() => setIsEditModalOpen(false)}
          okText="Lưu"
          cancelText="Hủy"
          width={isMobile ? "90%" : 1000}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
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
                className="w-full h-12 text-base rounded-lg"
              />
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
            scroll={{ x: isMobile ? 300 : "max-content" }}
            expandable={{
              expandedRowRender: expandedDetailRowRender,
              expandRowByClick: true,
            }}
            className="custom-table"
          />
        </Modal>

        <Modal
          title={`Chi tiết phiếu xuất #${selectedReceipt?.id}`}
          open={isDetailModalOpen}
          onOk={() => setIsDetailModalOpen(false)}
          onCancel={() => setIsDetailModalOpen(false)}
          okText="OK"
          cancelText="Hủy"
          width={isMobile ? "90%" : 800}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
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
                  columns={detailColumns}
                  pagination={false}
                  scroll={{ x: isMobile ? 300 : "max-content" }}
                  expandable={{
                    expandedRowRender: expandedDetailRowRender,
                    expandRowByClick: true,
                  }}
                  className="custom-table"
                />
              ) : (
                <p>Không có sản phẩm nào trong phiếu xuất này.</p>
              )}
            </div>
          )}
        </Modal>
      </div>

      <style jsx>{`
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

export default ExportReceipts;
