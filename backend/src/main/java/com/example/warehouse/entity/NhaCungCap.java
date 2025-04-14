package com.example.warehouse.entity;

import com.example.warehouse.model.Receipt;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "nhacungcap")
@Getter
@Setter
public class NhaCungCap {

  @Id
  @Column(name = "ma_nha_cung_cap")
  private String maNhaCungCap;

  @Column(name = "ten_nha_cung_cap")
  private String tenNhaCungCap;

  @Column(name = "dia_chi")
  private String diaChi;

  @Column(name = "so_dien_thoai")
  @JsonProperty("soDienThoai")
  private String sdt;

  @Column(name = "trang_thai")
  private Integer trangThai;

  @OneToMany(mappedBy = "nhaCungCap")
  @JsonIgnore
  private List<Receipt> receipts;
}