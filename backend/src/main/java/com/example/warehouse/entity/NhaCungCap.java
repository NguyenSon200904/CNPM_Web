package com.example.warehouse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nhacungcap")
@Data
public class NhaCungCap {
  @Id
  private String maNhaCungCap;

  private String tenNhaCungCap;

  private String soDienThoai;

  private String diaChi;
}