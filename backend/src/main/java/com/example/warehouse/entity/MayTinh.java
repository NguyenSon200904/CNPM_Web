package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "maytinh")
@Data
public class MayTinh {
  @Id
  private String maSanPham;

  private Integer congSuatNguon; // Xóa @Column(name = "cong_suat_nguon")

  private Double kichThuocMan; // Xóa @Column(name = "kich_thuoc_man")

  private String dungLuongPin; // Xóa @Column(name = "dung_luong_pin")

  private String loaiMay; // Xóa @Column(name = "loai_may")

  private String maBoard; // Xóa @Column(name = "ma_board")

  private String ram;

  private String rom;

  private String tencpu; // Xóa @Column(name = "tencpu")
}