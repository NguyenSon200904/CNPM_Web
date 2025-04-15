# Quản lý kho hàng - Dự án Web CNPM

Dự án này là một hệ thống quản lý kho hàng được xây dựng bằng Spring Boot cho backend và ReactJS với Vite cho frontend. Hệ thống hỗ trợ quản lý sản phẩm, nhà cung cấp, phiếu nhập, phiếu xuất và các chức năng liên quan.

## Mục lục

- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

---

## Cấu trúc dự án

├── backend/

# Backend (Spring Boot) │├── src/ # Mã nguồn backend │ ├── pom.xml # File cấu hình Maven │ └── Dockerfile # Dockerfile cho backend ├── frontend/ # Frontend (ReactJS + Vite) │ ├── src/ # Mã nguồn frontend │ ├── package.json # File cấu hình npm │ └── Dockerfile # Dockerfile cho frontend ├── docker-compose.yml # File cấu hình Docker Compose └── README.md # Tài liệu dự án

---

## Yêu cầu hệ thống

- **Java**: Phiên bản 17 trở lên
- **Node.js**: Phiên bản 16 trở lên
- **MySQL**: Phiên bản 8.0 trở lên
- **Docker**: Phiên bản mới nhất (nếu sử dụng Docker)
- **Maven**: Phiên bản 3.8 trở lên

---

## Hướng dẫn cài đặt

### 1. Cài đặt thủ công

#### Backend

1. Cài đặt MySQL và tạo cơ sở dữ liệu:
   CREATE DATABASE warehouse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
2. Cấu hình thông tin kết nối cơ sở dữ liệu trong file backend/src/main/resources/application.properties.
3. Chạy lệnh sau để build và chạy backend:
   cd backend
   mvn clean install
   mvn spring-boot:run

#### Frontend

1. Cài đặt các package cần thiết:
   cd frontend
   npm install
2. Chạy ứng dụng frontend:
   npm run dev

### 2. Cài đặt bằng Docker

1. Tải Docker tại link: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-win-amd64

2. Chạy lệnh sau để khởi động toàn bộ hệ thống:
   docker-compose up --build
3. Truy cập ứng dụng tại:
   Backend: http://localhost:8080
   Frontend: http://localhost:5173

## Hướng dẫn sử dụng

# Đăng nhập

Tài khoản mặc định:
Admin: admin / password123
Nhân viên nhập hàng: importer / password123
Nhân viên xuất hàng: exporter / password123

# Các chức năng chính

1. Quản lý sản phẩm:
   Thêm, sửa, xóa sản phẩm.
   Nhập và xuất dữ liệu sản phẩm qua file Excel.
2. Quản lý nhà cung cấp:
   Thêm, sửa, xóa nhà cung cấp.
   Tìm kiếm và lọc danh sách nhà cung cấp.
3. Quản lý phiếu nhập:
   Tạo phiếu nhập mới.
   Cập nhật và xóa phiếu nhập.
   Xem chi tiết phiếu nhập.
4. Quản lý phiếu xuất:
   Tạo phiếu xuất mới.
   Cập nhật và xóa phiếu xuất.
   Xem chi tiết phiếu xuất.
5. Thống kê:
   Thống kê sản phẩm, phiếu nhập, phiếu xuất theo thời gian.

## Tính năng chính

Quản lý sản phẩm: Hỗ trợ quản lý thông tin sản phẩm như mã sản phẩm, tên sản phẩm, số lượng tồn kho, giá bán, v.v.
Quản lý nhà cung cấp: Theo dõi thông tin nhà cung cấp và trạng thái hoạt động.
Quản lý phiếu nhập/xuất: Tạo, sửa, xóa và xem chi tiết các phiếu nhập và xuất hàng.
Thống kê: Hiển thị báo cáo chi tiết về sản phẩm, phiếu nhập và phiếu xuất.
Phân quyền người dùng: Hỗ trợ các vai trò như Admin, Nhân viên nhập hàng, Nhân viên xuất hàng.

## Công nghệ sử dụng

# Backend

Spring Boot: Framework chính cho backend.
Hibernate: ORM để làm việc với cơ sở dữ liệu.
MySQL: Cơ sở dữ liệu quan hệ.
JWT: Xác thực và phân quyền.

# Frontend

ReactJS: Framework chính cho frontend.
Vite: Công cụ build nhanh cho React.
Ant Design: Thư viện giao diện người dùng.
Axios: Thư viện gọi API.

# Khác

Docker: Đóng gói và triển khai ứng dụng.
Cypress: Kiểm thử tự động cho frontend.

## Đóng góp

Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng. Vui lòng thực hiện các bước sau để đóng góp:

1. Fork dự án.
2. Tạo nhánh mới:
   git checkout -b feature/ten-tinh-nang
3. Commit thay đổi:
   git commit -m "Thêm tính năng mới"
4. Gửi pull request.

## Giấy phép

Dự án này được cấp phép theo giấy phép MIT. Xem chi tiết trong file LICENSE.
