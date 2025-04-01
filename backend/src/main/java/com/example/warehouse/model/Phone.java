package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dienthoai")
@Data
public class Phone {
    @Id
    @Column(name = "maSanPham", length = 50)
    private String maSanPham;

    @OneToOne
    @MapsId
    @JoinColumn(name = "maSanPham")
    private Product product;

    @Column(name = "doPhanGiaiCamera", length = 25)
    private String doPhanGiaiCamera;

    @Column(name = "dungLuongPin")
    private String dungLuongPin; // Đảm bảo kiểu Integer

    @Column(name = "heDieuHanh", length = 25)
    private String heDieuHanh;

    @Column(name = "kichThuocMan")
    private Double kichThuocMan;

    @Column(name = "ram", length = 25)
    private String ram;

    @Column(name = "rom", length = 25)
    private String rom;

    @Column(name = "tenDienThoai", length = 50)
    private String tenDienThoai;
}