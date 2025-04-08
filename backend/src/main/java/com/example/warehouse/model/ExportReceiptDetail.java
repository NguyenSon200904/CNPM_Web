package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "chitietphieuxuat")
public class ExportReceiptDetail {

    @EmbeddedId
    @JsonProperty("id")
    private ExportReceiptDetailId id;

    @ManyToOne
    @JoinColumn(name = "ma_phieu_xuat", insertable = false, updatable = false)
    @JsonBackReference(value = "exportReceipt-exportReceiptDetails")
    @JsonProperty("exportReceipt")
    private ExportReceipt exportReceipt;

    @ManyToOne(fetch = FetchType.LAZY) // Giữ LAZY, vì chúng ta sẽ fetch bằng JOIN FETCH
    @JoinColumn(name = "ma_san_pham", insertable = false, updatable = false)
    // @JsonBackReference(value = "product-exportReceiptDetails")
    @JsonProperty("sanPham")
    private Product sanPham;

    @Column(name = "so_luong", nullable = false)
    @JsonProperty("soLuong")
    private int soLuong;

    @Column(name = "don_gia", nullable = false)
    @JsonProperty("donGia")
    private double donGia;

    // Getters and setters
    public ExportReceiptDetailId getId() {
        return id;
    }

    public void setId(ExportReceiptDetailId id) {
        this.id = id;
    }

    public ExportReceipt getExportReceipt() {
        return exportReceipt;
    }

    public void setExportReceipt(ExportReceipt exportReceipt) {
        this.exportReceipt = exportReceipt;
    }

    public Product getSanPham() {
        return sanPham;
    }

    public void setSanPham(Product sanPham) {
        this.sanPham = sanPham;
    }

    public int getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(int soLuong) {
        this.soLuong = soLuong;
    }

    public double getDonGia() {
        return donGia;
    }

    public void setDonGia(double donGia) {
        this.donGia = donGia;
    }

    @Override
    public String toString() {
        return "ExportReceiptDetail{" +
                "id=" + id +
                ", soLuong=" + soLuong +
                ", donGia=" + donGia +
                ", sanPham=" + (sanPham != null ? sanPham.getMaSanPham() : "null") +
                '}';
    }
}