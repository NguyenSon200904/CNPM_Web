package com.example.warehouse.repository;

import com.example.warehouse.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {

    @Query("SELECT p FROM Product p WHERE p.loaiSanPham = :loaiSanPham")
    List<Product> findByLoaiSanPham(@Param("loaiSanPham") String loaiSanPham);

    @Query("SELECT p FROM Product p WHERE p.trangThai = :trangThai")
    List<Product> findByTrangThai(@Param("trangThai") int trangThai);

    @Query("SELECT COUNT(p) FROM Product p")
    long countAll();
}