package com.example.warehouse.repository;

import com.example.warehouse.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SanPhamRepository extends JpaRepository<SanPham, String> {
  List<SanPham> findByLoaiSanPham(String loaiSanPham);

  List<SanPham> findByLoaiSanPhamAndTrangThai(String loaiSanPham, int trangThai);

  List<SanPham> findByTrangThai(int trangThai);
}