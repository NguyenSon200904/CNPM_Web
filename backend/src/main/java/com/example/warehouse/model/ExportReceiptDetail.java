package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "chitietphieuxuat")
@Data
public class ExportReceiptDetail {
    @EmbeddedId
    private ExportReceiptDetailId id;

    @ManyToOne
    @MapsId("maPhieuXuat") // Đổi từ maPhieu thành maPhieuXuat
    @JoinColumn(name = "ma_phieu_xuat", nullable = false)
    @JsonBackReference
    private ExportReceipt exportReceipt;

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