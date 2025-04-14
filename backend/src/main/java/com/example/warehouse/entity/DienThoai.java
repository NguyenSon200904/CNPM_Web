package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dienthoai")
@Data
public class DienThoai {
  @Id
  @Column(name = "ma_san_pham") // Ánh xạ với cột ma_san_pham trong cơ sở dữ liệu
  private String maSanPham;

  @Column(name = "dung_luong_pin") // Ánh xạ với cột dung_luong_pin
  private Integer dungLuongPin;

  @Column(name = "kich_thuoc_man") // Ánh xạ với cột kich_thuoc_man
  private Double kichThuocMan;

  @Column(name = "do_phan_giai_camera") // Ánh xạ với cột do_phan_giai_camera
  private String doPhanGiaiCamera;

  @Column(name = "he_dieu_hanh") // Ánh xạ với cột he_dieu_hanh
  private String heDieuHanh;

  @Column(name = "ram") // Ánh xạ với cột ram
  private String ram;

  @Column(name = "rom") // Ánh xạ với cột rom
  private String rom;

  @Column(name = "ten_dien_thoai") // Ánh xạ với cột ten_dien_thoai
  private String tenDienThoai;
}