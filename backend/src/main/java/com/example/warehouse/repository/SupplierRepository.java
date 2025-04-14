package com.example.warehouse.repository;

import com.example.warehouse.entity.NhaCungCap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierRepository extends JpaRepository<NhaCungCap, String> {
  // Tìm danh sách nhà cung cấp theo tenNhaCungCap (tìm kiếm gần đúng, không phân
  // biệt hoa thường)
  List<NhaCungCap> findByTenNhaCungCapContainingIgnoreCase(String tenNhaCungCap);

  // Kiểm tra xem nhà cung cấp có tồn tại hay không theo maNhaCungCap
  boolean existsByMaNhaCungCap(String maNhaCungCap);

  // Tìm danh sách nhà cung cấp theo trạng thái (trang_thai)
  List<NhaCungCap> findByTrangThai(Integer trangThai);
}