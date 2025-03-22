package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sanpham")
@Data
public class SanPham {
  @Id
  private String maSanPham;

  private String tenSanPham; // Xóa @Column(name = "ten_san_pham")

  private Double gia;

  private Integer soLuong; // Xóa @Column(name = "so_luong")

  private Integer trangThai; // Xóa @Column(name = "trang_thai")

  private String loaiSanPham; // Xóa @Column(name = "loai_san_pham")

  private String xuatXu; // Xóa @Column(name = "xuat_xu")
}