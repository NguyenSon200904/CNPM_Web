package com.example.warehouse.repository;

import com.example.warehouse.entity.DienThoai;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DienThoaiRepository extends JpaRepository<DienThoai, String> {
  Optional<DienThoai> findByMaSanPham(String maSanPham);

  void deleteByMaSanPham(String maSanPham);
}