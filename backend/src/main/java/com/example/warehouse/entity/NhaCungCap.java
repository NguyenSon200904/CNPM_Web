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
  private String maNhaCungCap;

  private String tenNhaCungCap;

  private String diaChi;

  @Column(name = "so_dien_thoai")
  @JsonProperty("soDienThoai")
  private String sdt;

  @OneToMany(mappedBy = "nhaCungCap")
  @JsonIgnore
  private List<Receipt> receipts;

  // Constructors, getters, setters
}