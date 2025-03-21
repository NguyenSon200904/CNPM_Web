package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "chitietphieunhap")
@Data
public class ReceiptDetail {
    @EmbeddedId
    private ReceiptDetailId id;

    @ManyToOne
    @MapsId("maPhieuNhap")
    @JoinColumn(name = "ma_phieu_nhap")
    private Receipt receipt;

    @ManyToOne
    @MapsId("maSanPham")
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    @Column(name = "loai_san_pham", length = 20)
    private String loaiSanPham;

    @Column(name = "so_luong", nullable = false)
    private int soLuong;

    @Column(name = "don_gia", nullable = false)
    private double donGia;
}