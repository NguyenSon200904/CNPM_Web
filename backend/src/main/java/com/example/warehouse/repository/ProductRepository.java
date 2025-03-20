package com.example.warehouse.repository;

import com.example.warehouse.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    // Lấy danh sách sản phẩm theo loaiSanPham
    List<Product> findByLoaiSanPham(String loaiSanPham);

    // Lấy danh sách sản phẩm theo trangThai
    List<Product> findByTrangThai(Integer trangThai);

    // Kiểm tra xem sản phẩm có tồn tại hay không
    boolean existsByMaSanPham(String maSanPham);
}