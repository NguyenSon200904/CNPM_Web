package com.example.warehouse.repository;

import com.example.warehouse.entity.MayTinh;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MayTinhRepository extends JpaRepository<MayTinh, String> {
  Optional<MayTinh> findByMaSanPham(String maSanPham);
}