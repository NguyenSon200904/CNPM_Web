package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class ReceiptDetailId implements Serializable {

    @Column(name = "ma_phieu_nhap")
    @JsonProperty("maPhieuNhap")
    private Long maPhieuNhap;

    @Column(name = "ma_san_pham")
    @JsonProperty("maSanPham")
    private String maSanPham;

    // Getters and setters
    public Long getMaPhieuNhap() {
        return maPhieuNhap;
    }

    public void setMaPhieuNhap(Long maPhieuNhap) {
        this.maPhieuNhap = maPhieuNhap;
    }

    public String getMaSanPham() {
        return maSanPham;
    }

    public void setMaSanPham(String maSanPham) {
        this.maSanPham = maSanPham;
    }

    @Override
    public String toString() {
        return "ReceiptDetailId{" +
                "maPhieuNhap=" + maPhieuNhap +
                ", maSanPham='" + maSanPham + '\'' +
                '}';
    }
}