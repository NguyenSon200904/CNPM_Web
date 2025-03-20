package com.example.warehouse.repository;

import com.example.warehouse.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, String> {
    // Tìm danh sách nhà cung cấp theo tenNhaCungCap (tìm kiếm gần đúng)
    List<Supplier> findByTenNhaCungCapContainingIgnoreCase(String tenNhaCungCap);

    // Kiểm tra xem nhà cung cấp có tồn tại hay không
    boolean existsByMaNhaCungCap(String maNhaCungCap);
}