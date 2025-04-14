-- Dữ liệu cho bảng account
INSERT INTO account (role, status, email, full_name, password, user_name) VALUES
(0, 1, 'admin@example.com', 'Admin User', 'admin123', 'admin'),
(1, 1, 'employee1@example.com', 'Employee One', 'emp123', 'employee1'),
(2, 1, 'employee2@example.com', 'Employee Two', 'emp123', 'employee2');

-- Dữ liệu cho bảng nhacungcap
INSERT INTO nhacungcap (ma_nha_cung_cap, ten_nha_cung_cap, so_dien_thoai, dia_chi) VALUES
('NCC01', 'Nha cung cap 1', '0123456789', '123 Duong ABC, Quan XYZ, HCM'),
('NCC02', 'Nha cung cap 2', '0987654321', '456 Duong XYZ, Quan ABC, HCM'),
('NCC03', 'Nha cung cap 3', '0123456789', '123 Duong ABC, Quan XYZ, HCM'),
('NCC04', 'Nha cung cap 4', '0987654321', '456 Duong XYZ, Quan ABC, HCM'),
('NCC05', 'Nha cung cap 5', '0123456789', '123 Duong ABC, Quan XYZ, HCM'),
('NCC06', 'Nha cung cap 6', '0987654321', '456 Duong XYZ, Quan ABC, HCM'),
('NCC07', 'Nha cung cap 7', '0123456789', '123 Duong ABC, Quan XYZ, HCM'),
('NCC08', 'Nha cung cap 8', '0987654321', '456 Duong XYZ, Quan ABC, HCM'),
('NCC09', 'Nha cung cap 9', '0123456789', '123 Duong ABC, Quan XYZ, HCM'),
('NCC10', 'Nha cung cap 10', '0987654321', '456 Duong XYZ, Quan ABC, HCM');

-- Dữ liệu cho bảng sanpham
INSERT INTO sanpham (gia, so_luong, trang_thai, loai_san_pham, ten_san_pham, ma_san_pham, xuat_xu) VALUES
(1500.00, 10, 1, 'Computer', 'Dell XPS 13', 'MT001', 'USA'),
(2500.00, 5, 1, 'Computer', 'MacBook Pro 14', 'MT002', 'China'),
(1200.00, 8, 1, 'Computer', 'HP Spectre x360', 'MT003', 'Taiwan'),
(1800.00, 7, 1, 'Computer', 'Lenovo ThinkPad X1', 'MT004', 'China'),
(2200.00, 3, 1, 'Computer', 'Asus ROG Zephyrus', 'MT005', 'Taiwan'),
(999.00, 20, 1, 'Phone', 'iPhone 14 Pro', 'DT001', 'China'),
(1199.00, 15, 1, 'Phone', 'Galaxy S23 Ultra', 'DT002', 'South Korea'),
(799.00, 25, 1, 'Phone', 'Xiaomi 13 Pro', 'DT003', 'China'),
(599.00, 30, 1, 'Phone', 'Pixel 7', 'DT004', 'USA'),
(899.00, 18, 1, 'Phone', 'Oppo Find X5 Pro', 'DT005', 'China');

-- Dữ liệu cho bảng maytinh
INSERT INTO maytinh (cong_suat_nguon, kich_thuoc_man, dung_luong_pin, ma_san_pham, loai_may, ma_board, ram, rom, tencpu) VALUES
(65, 13.3, '50Wh', 'MT001', 'Laptop', 'Intel B660', '16GB', '512GB SSD', 'Intel i7-12700H'),
(90, 15.6, '75Wh', 'MT002', 'Laptop', 'Intel Z690', '32GB', '1TB SSD', 'Intel i9-12900H'),
(45, 14.0, '60Wh', 'MT003', 'Laptop', 'Apple M2', '16GB', '1TB SSD', 'Apple M2 Pro'),
(80, 15.6, '70Wh', 'MT004', 'Laptop', 'AMD B550', '16GB', '512GB SSD', 'AMD Ryzen 7 5800H'),
(120, 0, 'N/A', 'MT005', 'Desktop', 'AMD X570', '32GB', '2TB HDD', 'AMD Ryzen 9 5900X');

-- Dữ liệu cho bảng dienthoai
INSERT INTO dienthoai (dung_luong_pin, kich_thuoc_man, do_phan_giai_camera, he_dieu_hanh, ram, rom, ma_san_pham, ten_dien_thoai) VALUES
(3279, 6.1, '12MP', 'iOS 16', '6GB', '256GB', 'DT001', 'iPhone 14 Pro'),
(5000, 6.8, '108MP', 'Android 13', '12GB', '512GB', 'DT002', 'Galaxy S23 Ultra'),
(4400, 6.7, '50MP', 'Android 13', '8GB', '256GB', 'DT003', 'Xiaomi 13 Pro'),
(4352, 6.3, '50MP', 'Android 13', '8GB', '128GB', 'DT004', 'Pixel 7'),
(4500, 6.7, '48MP', 'Android 12', '12GB', '256GB', 'DT005', 'Oppo Find X5 Pro');

-- Dữ liệu cho bảng phieuxuat
INSERT INTO phieuxuat (tong_tien, ma_phieu_xuat, ngay_xuat, nguoi_tao) VALUES
(23000000, 1, '2025-03-22 14:00:00', 'employee1'),
(20000000, 2, '2025-03-22 14:30:00', 'employee2');

-- Dữ liệu cho bảng chitietphieuxuat
INSERT INTO chitietphieuxuat (ma_phieu_xuat, ma_san_pham, loai_san_pham, so_luong, don_gia) VALUES
(1, 'MT001', 'Computer', 1, 15000000),
(1, 'DT001', 'Phone', 1, 8000000),
(2, 'DT002', 'Phone', 2, 6000000),
(2, 'DT003', 'Phone', 1, 8000000);