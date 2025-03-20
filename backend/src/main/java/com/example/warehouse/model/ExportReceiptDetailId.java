package com.example.warehouse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

/**
 * Composite key for ExportReceiptDetail, consisting of maPhieu and maSanPham.
 */
@Embeddable
@Data
public class ExportReceiptDetailId implements Serializable {
    @Column(name = "maPhieu", nullable = false, length = 50)
    private String maPhieu;

    public String getMaPhieu() {
        return maPhieu;
    };

    public void setMaPhieu(String maPhieu) {
        this.maPhieu = maPhieu;
    };

    @Column(name = "maSanPham", nullable = false, length = 50)
    private String maSanPham;

    public String getMaSanPham() {
        return maSanPham;
    };

    public void setMaSanPham(String maSanPham) {
        this.maSanPham = maSanPham;
    };
}