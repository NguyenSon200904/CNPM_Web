package com.example.warehouse.repository;

import com.example.warehouse.entity.MayTinh;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MayTinhRepository extends JpaRepository<MayTinh, String> {
  Optional<MayTinh> findByMaSanPham(String maSanPham);

  void deleteByMaSanPham(String maSanPham);
}