import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Table,
  Input,
  Select,
  DatePicker,
  Tabs,
  Drawer,
  Menu,
  Button,
  Modal,
} from "antd";
import {
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import api from "../api";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Statistics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKey, setFilterKey] = useState("code");
  const [dateRange, setDateRange] = useState([]);
  const [data, setData] = useState({
    products: [],
    invoices: [],
    accounts: [],
  });
  const [stats, setStats] = useState({
    productCount: 0,
    supplierCount: 0,
    accountCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cập nhật trạng thái isMobile khi thay đổi kích thước màn hình
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

  // Đặt lại các bộ lọc khi chuyển tab
  useEffect(() => {
    setSearchTerm("");
    setDateRange([]);
    setCurrentPage(1);
    const defaultFilter = {
      products: "code",
      invoices: "key",
      accounts: "username",
    };
    setFilterKey(defaultFilter[activeTab]);
  }, [activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const inventoryResponse = await api.get("/inventory", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const receiptsResponse = await api.get("/receipts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const exportReceiptsResponse = await api.get("/export-receipts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const importQuantities = {};
        const exportQuantities = {};

        console.log("Dữ liệu từ /receipts:", receiptsResponse.data);
        if (receiptsResponse?.data && Array.isArray(receiptsResponse.data)) {
          receiptsResponse.data.forEach((receipt) => {
            if (receipt?.details && Array.isArray(receipt.details)) {
              receipt.details.forEach((detail) => {
                const maSanPham = detail?.maSanPham;
                if (maSanPham) {
                  importQuantities[maSanPham] =
                    (importQuantities[maSanPham] || 0) + (detail.soLuong || 0);
                }
              });
            }
          });
        } else {
          console.warn("Dữ liệu từ /receipts không hợp lệ:", receiptsResponse);
        }

        console.log(
          "Dữ liệu từ /export-receipts:",
          exportReceiptsResponse.data
        );
        if (
          exportReceiptsResponse?.data &&
          Array.isArray(exportReceiptsResponse.data)
        ) {
          exportReceiptsResponse.data.forEach((exportReceipt) => {
            if (
              exportReceipt?.chiTietPhieuXuats &&
              Array.isArray(exportReceipt.chiTietPhieuXuats)
            ) {
              exportReceipt.chiTietPhieuXuats.forEach((detail) => {
                const maSanPham = detail?.id?.maSanPham;
                if (maSanPham) {
                  exportQuantities[maSanPham] =
                    (exportQuantities[maSanPham] || 0) + (detail.soLuong || 0);
                }
              });
            }
          });
        } else {
          console.warn(
            "Dữ liệu từ /export-receipts không hợp lệ:",
            exportReceiptsResponse
          );
        }

        const productsData =
          inventoryResponse?.data && Array.isArray(inventoryResponse.data)
            ? inventoryResponse.data.map((item, index) => {
                console.log(
                  "Sản phẩm:",
                  item.maSanPham,
                  "Nhập:",
                  importQuantities[item.maSanPham],
                  "Xuất:",
                  exportQuantities[item.maSanPham]
                );
                return {
                  key: index + 1,
                  code: item.maSanPham || "N/A",
                  name: item.tenSanPham || "N/A",
                  imported: importQuantities[item.maSanPham] || 0,
                  exported: exportQuantities[item.maSanPham] || 0,
                };
              })
            : [];

        const invoicesData = [
          ...(receiptsResponse?.data && Array.isArray(receiptsResponse.data)
            ? receiptsResponse.data
                .filter((receipt) => receipt.maPhieu)
                .map((receipt) => ({
                  key: `PN-${receipt.maPhieu}`,
                  type: "Phiếu nhập",
                  creator: receipt.nguoiTao || "Không xác định",
                  total: receipt.tongTien || 0,
                  date: receipt.thoiGianTao
                    ? moment(receipt.thoiGianTao).format("DD/MM/YYYY HH:mm")
                    : "N/A",
                }))
            : []),
          ...(exportReceiptsResponse?.data &&
          Array.isArray(exportReceiptsResponse.data)
            ? exportReceiptsResponse.data
                .filter((exportReceipt) => exportReceipt.maPhieuXuat)
                .map((exportReceipt) => ({
                  key: `PX-${exportReceipt.maPhieuXuat}`,
                  type: "Phiếu xuất",
                  creator: exportReceipt.nguoiTao?.userName || "Không xác định",
                  total: exportReceipt.tongTien || 0,
                  date: exportReceipt.ngayXuat
                    ? moment(exportReceipt.ngayXuat).format("DD/MM/YYYY HH:mm")
                    : "N/A",
                }))
            : []),
        ].sort(
          (a, b) =>
            moment(a.date, "DD/MM/YYYY HH:mm").unix() -
            moment(b.date, "DD/MM/YYYY HH:mm").unix()
        );

        const accountsResponse = await api.get("/accounts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log("Dữ liệu từ /accounts:", accountsResponse.data);
        const accountsData =
          accountsResponse?.data && Array.isArray(accountsResponse.data)
            ? accountsResponse.data.map((account, index) => ({
                key: index + 1,
                username: account.userName || "N/A",
                fullname: account.fullName || "N/A",
                email: account.email || "N/A",
                role: account.role || "Không xác định",
                status: account.status === 1 ? "Active" : "Inactive",
              }))
            : [];

        const suppliersResponse = await api.get("/suppliers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setData({
          products: productsData,
          invoices: invoicesData,
          accounts: accountsData,
        });

        setStats({
          productCount: inventoryResponse?.data
            ? inventoryResponse.data.filter((item) => item.soLuongTonKho > 0)
                .length
            : 0,
          supplierCount: suppliersResponse?.data?.length || 0,
          accountCount: accountsResponse?.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching statistics data:", error);
        Modal.error({
          title: "Lỗi",
          content:
            "Lỗi khi tải dữ liệu thống kê: " +
            (error.response?.data?.error || error.message),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cấu hình cột cho từng tab
  const columns = {
    products: [
      { title: "STT", dataIndex: "key", key: "key", responsive: ["sm"] },
      { title: "Mã máy", dataIndex: "code", key: "code" },
      { title: "Tên máy", dataIndex: "name", key: "name", ellipsis: true },
      {
        title: "Số lượng nhập",
        dataIndex: "imported",
        key: "imported",
        responsive: ["md"],
      },
      {
        title: "Số lượng xuất",
        dataIndex: "exported",
        key: "exported",
        responsive: ["md"],
      },
    ],
    invoices: [
      { title: "Mã phiếu", dataIndex: "key", key: "key" },
      { title: "Loại phiếu", dataIndex: "type", key: "type" },
      {
        title: "Người tạo",
        dataIndex: "creator",
        key: "creator",
        responsive: ["sm"],
      },
      {
        title: "Thời gian tạo",
        dataIndex: "date",
        key: "date",
        responsive: ["md"],
      },
      {
        title: "Tổng tiền",
        dataIndex: "total",
        key: "total",
        render: (total) => `${total.toLocaleString()}đ`,
      },
    ],
    accounts: [
      { title: "Họ và tên", dataIndex: "fullname", key: "fullname" },
      { title: "Email", dataIndex: "email", key: "email", responsive: ["md"] },
      {
        title: "Tên người dùng",
        dataIndex: "username",
        key: "username",
        responsive: ["sm"],
      },
      { title: "Vai trò", dataIndex: "role", key: "role", responsive: ["md"] },
      {
        title: "Tình trạng",
        dataIndex: "status",
        key: "status",
        responsive: ["md"],
      },
    ],
  };

  // Dữ liệu mở rộng cho mỗi dòng trong bảng
  const expandedRowRender = (record) => {
    if (activeTab === "products") {
      return (
        <div className="p-2">
          <p>
            <strong>STT:</strong> {record.key}
          </p>
          <p>
            <strong>Mã máy:</strong> {record.code}
          </p>
          <p>
            <strong>Tên máy:</strong> {record.name}
          </p>
          <p>
            <strong>Số lượng nhập:</strong> {record.imported}
          </p>
          <p>
            <strong>Số lượng xuất:</strong> {record.exported}
          </p>
        </div>
      );
    } else if (activeTab === "invoices") {
      return (
        <div className="p-2">
          <p>
            <strong>Mã phiếu:</strong> {record.key}
          </p>
          <p>
            <strong>Loại phiếu:</strong> {record.type}
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
    } else if (activeTab === "accounts") {
      return (
        <div className="p-2">
          <p>
            <strong>Họ và tên:</strong> {record.fullname}
          </p>
          <p>
            <strong>Email:</strong> {record.email}
          </p>
          <p>
            <strong>Tên người dùng:</strong> {record.username}
          </p>
          <p>
            <strong>Vai trò:</strong> {record.role}
          </p>
          <p>
            <strong>Tình trạng:</strong> {record.status}
          </p>
        </div>
      );
    }
    return null;
  };

  // Cấu hình tiêu chí lọc cho từng tab
  const filterOptions = {
    products: [
      { label: "Mã máy", value: "code" },
      { label: "Tên máy", value: "name" },
      { label: "Số lượng nhập", value: "imported" },
      { label: "Số lượng xuất", value: "exported" },
    ],
    invoices: [
      { label: "Mã phiếu", value: "key" },
      { label: "Loại phiếu", value: "type" },
      { label: "Người tạo", value: "creator" },
      { label: "Thời gian tạo", value: "date" },
    ],
    accounts: [
      { label: "Tên người dùng", value: "username" },
      { label: "Email", value: "email" },
      { label: "Vai trò", value: "role" },
      { label: "Tình trạng", value: "status" },
    ],
  };

  // Lọc dữ liệu theo tiêu chí đã chọn và khoảng thời gian (nếu có)
  const filteredData = useMemo(() => {
    let filtered =
      data[activeTab] && Array.isArray(data[activeTab])
        ? data[activeTab].filter((item) => {
            const value = item[filterKey]
              ? item[filterKey].toString().toLowerCase()
              : "";
            return value.includes(searchTerm.toLowerCase());
          })
        : [];

    if (activeTab === "invoices" && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter((item) => {
        const itemDate = moment(item.date, "DD/MM/YYYY HH:mm");
        return itemDate.isBetween(start, end, null, "[]");
      });
    }

    return filtered;
  }, [searchTerm, activeTab, filterKey, dateRange, data]);

  return (
    <div className="relative">
      {/* Nút mở sidebar trên mobile */}
      {isMobile && (
        <Button
          icon={<MenuOutlined />}
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-10 h-12 w-12 text-base bg-blue-500 text-white rounded-lg"
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
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-left">
          THỐNG KÊ
        </h2>

        <div className="flex flex-col gap-4 mb-4 sm:mb-6">
          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "grid-cols-3"
            } gap-3 sm:gap-4 mb-3 sm:mb-4`}
          >
            <Card className="p-3 sm:p-4 flex items-center bg-yellow-400 text-white h-24 sm:h-28">
              <div className="text-4xl sm:text-5xl flex-shrink-0 mr-3 sm:mr-4">
                <ShoppingOutlined />
              </div>
              <div className="flex flex-col items-start text-sm sm:text-base font-bold">
                <div className="text-xl sm:text-2xl">{stats.productCount}</div>
                <div>Sản phẩm trong kho</div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4 flex items-center bg-orange-500 text-white h-24 sm:h-28">
              <div className="text-4xl sm:text-5xl flex-shrink-0 mr-3 sm:mr-4">
                <TeamOutlined />
              </div>
              <div className="flex flex-col items-start text-sm sm:text-base font-bold">
                <div className="text-xl sm:text-2xl">{stats.supplierCount}</div>
                <div>Nhà cung cấp</div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4 flex items-center bg-teal-500 text-white h-24 sm:h-28">
              <div className="text-4xl sm:text-5xl flex-shrink-0 mr-3 sm:mr-4">
                <UserOutlined />
              </div>
              <div className="flex flex-col items-start text-sm sm:text-base font-bold">
                <div className="text-xl sm:text-2xl">{stats.accountCount}</div>
                <div>Tài khoản người dùng</div>
              </div>
            </Card>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="mb-3 sm:mb-4 custom-tabs"
          >
            <TabPane tab="Sản phẩm" key="products" />
            <TabPane tab="Phiếu" key="invoices" />
            <TabPane tab="Tài khoản" key="accounts" />
          </Tabs>

          <div className="flex flex-col gap-2 sm:gap-3">
            <Input
              placeholder="Nhập từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 text-base rounded-lg"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select
                value={filterKey}
                onChange={setFilterKey}
                className="w-full sm:w-40 h-12 text-base rounded-lg"
              >
                {filterOptions[activeTab].map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              {activeTab === "invoices" && (
                <div className="flex flex-col sm:flex-row sm:ml-auto items-start sm:items-center gap-2 sm:gap-3 text-black w-full sm:w-auto">
                  <span className="w-full sm:w-auto">Lọc theo ngày:</span>
                  <RangePicker
                    onChange={(dates) => setDateRange(dates)}
                    format="DD/MM/YYYY"
                    className="w-full sm:w-auto h-12 text-base rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns[activeTab]}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{
            pageSize: 2,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
          }}
          bordered
          loading={loading}
          scroll={{
            x: isMobile ? 300 : "max-content",
            y: isMobile ? 300 : 400,
          }}
          className="custom-table"
        />
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

        /* Điều chỉnh tabs */
        .custom-tabs .ant-tabs-tab {
          font-size: 14px;
          padding: 8px 16px;
        }
        @media (max-width: 640px) {
          .custom-tabs .ant-tabs-tab {
            font-size: 12px;
            padding: 6px 12px;
          }
        }
        @media (min-width: 1024px) {
          .custom-tabs .ant-tabs-tab {
            font-size: 16px;
            padding: 10px 20px;
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

export default Statistics;
