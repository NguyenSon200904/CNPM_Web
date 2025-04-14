package com.example.warehouse.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nhacungcap")
@Data
public class Supplier {
    @Id
    @Column(name = "maNhaCungCap", length = 50)
    private String maNhaCungCap;

    @Column(name = "tenNhaCungCap", length = 50)
    private String tenNhaCungCap;

    @Column(name = "diaChi", length = 150)
    private String diaChi;

    @Column(name = "sdt", length = 50)
    private String sdt;

    @Column(name = "trang_thai") // Thêm cột trang_thai
    private Integer trangThai = 1; // Mặc định là 1 (hoạt động)

    @OneToMany(mappedBy = "nhaCungCap")
    @JsonIgnore
    private List<Receipt> receipts;
}