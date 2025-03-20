package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "DienThoai")
@Data
public class DienThoai extends Product {
    @Column(name = "tenDienThoai", nullable = false)
    private String tenDienThoai;

    @Column(name = "heDieuHanh")
    private String heDieuHanh;

    @Column(name = "ram")
    private String ram;

    @Column(name = "dungLuongPin")
    private Integer dungLuongPin;

    @Column(name = "doPhanGiaiCamera")
    private String doPhanGiaiCamera;

    @Column(name = "kichThuocMan")
    private Double kichThuocMan;

    @Column(name = "rom")
    private String rom;

    @Column(name = "chip")
    private String chip;
}