package com.example.warehouse.repository;

import com.example.warehouse.entity.DienThoai;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DienThoaiRepository extends JpaRepository<DienThoai, String> {
  Optional<DienThoai> findByMaSanPham(String maSanPham);
}