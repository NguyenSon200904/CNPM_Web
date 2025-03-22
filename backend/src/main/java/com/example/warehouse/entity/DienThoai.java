package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dienthoai")
@Data
public class DienThoai {
  @Id
  private String maSanPham;

  private Integer dungLuongPin; // Xóa @Column(name = "dung_luong_pin")

  private Double kichThuocMan; // Xóa @Column(name = "kich_thuoc_man")

  private String doPhanGiaiCamera; // Xóa @Column(name = "do_phan_giai_camera")

  private String heDieuHanh; // Xóa @Column(name = "he_dieu_hanh")

  private String ram;

  private String rom;

  private String tenDienThoai; // Xóa @Column(name = "ten_dien_thoai")
}