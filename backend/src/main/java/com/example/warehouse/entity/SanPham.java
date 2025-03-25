package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sanpham")
@Data
public class SanPham {
  @Id
  @Column(name = "ma_san_pham")
  private String maSanPham;

  @Column(name = "ten_san_pham")
  private String tenSanPham; // Xóa @Column(name = "ten_san_pham")

  private Double gia;

  @Column(name = "so_luong")
  private Integer soLuong; // Xóa @Column(name = "so_luong")

  @Column(name = "trang_thai")
  private Integer trangThai; // Xóa @Column(name = "trang_thai")

  @Column(name = "loai_san_pham")
  private String loaiSanPham; // Xóa @Column(name = "loai_san_pham")

  @Column(name = "xuat_xu")
  private String xuatXu; // Xóa @Column(name = "xuat_xu")
}