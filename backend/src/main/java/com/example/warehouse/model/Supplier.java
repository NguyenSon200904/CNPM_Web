package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nhacungcap")
@Data
public class Supplier {
    @Id
    @Column(name = "maNhaCungCap", length = 50)
    private String maNhaCungCap;

    @Column(name = "diaChi", length = 150)
    private String diaChi;

    @Column(name = "sdt", length = 50)
    private String sdt;

    @Column(name = "tenNhaCungCap", length = 50)
    private String tenNhaCungCap;
}