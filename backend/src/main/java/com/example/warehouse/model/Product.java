package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sanpham")
@Data
public class Product {
    @Id
    @Column(name = "maSanPham", length = 50)
    private String maSanPham;

    @Column(name = "gia")
    private double gia;

    @Column(name = "loaiSanPham", length = 20)
    private String loaiSanPham;

    @Column(name = "soLuong")
    private int soLuong;

    @Column(name = "tenSanPham", length = 25)
    private String tenSanPham;

    @Column(name = "trangThai")
    private int trangThai;

    @Column(name = "xuatXu", length = 50)
    private String xuatXu;
}