package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sanpham")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
public abstract class Product {
    @Id
    @Column(name = "maSanPham", nullable = false, length = 50)
    private String maSanPham;
    public String getMaSanPham() {
        return maSanPham;
    };
    public void setMaSanPham(String maSanPham) {
        this.maSanPham = maSanPham;
    };

    @Column(name = "tenSanPham")
    private String tenSanPham;

    @Column(name = "soLuong", nullable = false)
    private int soLuong;

    @Column(name = "gia", nullable = false)
    private double gia;

    @Column(name = "xuatXu", length = 50)
    private String xuatXu;

    @Column(name = "trangThai")
    private Integer trangThai;

    @Column(name = "loaiSanPham", length = 20)
    private String loaiSanPham;
}