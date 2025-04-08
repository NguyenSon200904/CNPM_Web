package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ExportReceiptDetailId implements Serializable {

    @Column(name = "ma_phieu_xuat")
    @JsonProperty("maPhieuXuat")
    private Integer maPhieuXuat;

    @Column(name = "ma_san_pham")
    @JsonProperty("maSanPham")
    private String maSanPham;

    // Getters and setters
    public int getMaPhieuXuat() {
        return maPhieuXuat;
    }

    public void setMaPhieuXuat(Integer maPhieuXuat) {
        this.maPhieuXuat = maPhieuXuat;
    }

    public String getMaSanPham() {
        return maSanPham;
    }

    public void setMaSanPham(String maSanPham) {
        this.maSanPham = maSanPham;
    }

    @Override
    public String toString() {
        return "ExportReceiptDetailId{" +
                "maPhieuXuat=" + maPhieuXuat +
                ", maSanPham='" + maSanPham + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ExportReceiptDetailId that = (ExportReceiptDetailId) o;
        return Objects.equals(maPhieuXuat, that.maPhieuXuat) &&
                Objects.equals(maSanPham, that.maSanPham);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maPhieuXuat, maSanPham);
    }
}