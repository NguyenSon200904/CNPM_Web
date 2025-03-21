-- Chèn dữ liệu vào bảng account
INSERT INTO account (user_name, password, full_name, email, role, status) VALUES
('employee1', 'emp123', 'Employee One', 'employee1@example.com', 1, 1),
('employee2', 'emp123', 'Employee Two', 'employee2@example.com', 2, 0);

-- Chèn dữ liệu vào bảng sanpham
INSERT INTO sanpham (ma_san_pham, ten_san_pham, loai_san_pham, gia, so_luong, trang_thai, xuat_xu) VALUES
('SP001', 'Laptop Dell XPS 13', 'Computer', 15000000, 10, 1, 'USA'),
('SP002', 'MacBook Pro 14', 'Computer', 20000000, 5, 1, 'USA'),
('SP003', 'iPhone 14', 'Phone', 8000000, 20, 1, 'China'),
('SP004', 'Samsung Galaxy A54', 'Phone', 6000000, 15, 1, 'Vietnam');

-- Chèn dữ liệu vào bảng phieuxuat
INSERT INTO phieuxuat (ma_phieu_xuat, ngay_xuat, tong_tien, nguoi_tao) VALUES
(1, '2025-03-21 09:00:00', 23000000, 'employee1'),
(2, '2025-03-21 15:00:00', 14000000, 'employee2');

-- Chèn dữ liệu vào bảng chitietphieuxuat
INSERT INTO chitietphieuxuat (ma_phieu_xuat, ma_san_pham, loai_san_pham, so_luong, don_gia) VALUES
(1, 'SP001', 'Computer', 1, 15000000),
(1, 'SP003', 'Phone', 1, 8000000),
(2, 'SP004', 'Phone', 2, 6000000),
(2, 'SP003', 'Phone', 1, 8000000);