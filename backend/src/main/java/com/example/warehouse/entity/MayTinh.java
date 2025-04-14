package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "maytinh")
public class MayTinh {
  @Id
  @Column(name = "ma_san_pham")
  private String maSanPham;

  @Column(name = "cong_suat_nguon")
  private Integer congSuatNguon;

  @Column(name = "kich_thuoc_man")
  private Double kichThuocMan;

  @Column(name = "dung_luong_pin")
  private String dungLuongPin;

  @Column(name = "loai_may")
  private String loaiMay;

  @Column(name = "ma_board")
  private String maBoard;

  @Column(name = "ram")
  private String ram;

  @Column(name = "rom")
  private String rom;

  @Column(name = "tencpu")
  private String tencpu;

  // Getter và Setter
  public String getMaSanPham() {
    return maSanPham;
  }

  public void setMaSanPham(String maSanPham) {
    this.maSanPham = maSanPham;
  }

  public Integer getCongSuatNguon() {
    return congSuatNguon;
  }

  public void setCongSuatNguon(Integer congSuatNguon) {
    this.congSuatNguon = congSuatNguon;
  }

  public Double getKichThuocMan() {
    return kichThuocMan;
  }

  public void setKichThuocMan(Double kichThuocMan) {
    this.kichThuocMan = kichThuocMan;
  }

  public String getDungLuongPin() {
    return dungLuongPin;
  }

  public void setDungLuongPin(String dungLuongPin) {
    this.dungLuongPin = dungLuongPin;
  }

  public String getLoaiMay() {
    return loaiMay;
  }

  public void setLoaiMay(String loaiMay) {
    this.loaiMay = loaiMay;
  }

  public String getMaBoard() {
    return maBoard;
  }

  public void setMaBoard(String maBoard) {
    this.maBoard = maBoard;
  }

  public String getRam() {
    return ram;
  }

  public void setRam(String ram) {
    this.ram = ram;
  }

  public String getRom() {
    return rom;
  }

  public void setRom(String rom) {
    this.rom = rom;
  }

  public String getTencpu() {
    return tencpu;
  }

  public void setTencpu(String tencpu) {
    this.tencpu = tencpu;
  }
}