package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ChiTietPhieuNhap")
@Data
public class ReceiptDetail {
    @EmbeddedId
    private ReceiptDetailId id;

    @ManyToOne
    @MapsId("maPhieu")
    @JoinColumn(name = "maPhieu", nullable = false)
    @JsonBackReference
    private Receipt receipt;

    @ManyToOne
    @MapsId("maSanPham")
    @JoinColumn(name = "maSanPham", nullable = false)
    private Product product;

    @Column(name = "loaiSanPham", length = 20)
    private String loaiSanPham;

    @Column(name = "soLuong", nullable = false)
    private int soLuong;

    @Column(name = "donGia", nullable = false)
    private double donGia;
}