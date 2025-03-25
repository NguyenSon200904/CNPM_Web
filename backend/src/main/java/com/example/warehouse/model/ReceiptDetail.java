package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "chitietphieunhap")
public class ReceiptDetail {
    @EmbeddedId
    @JsonProperty("id")
    private ReceiptDetailId id;

    @ManyToOne
    @JoinColumn(name = "ma_phieu_nhap", insertable = false, updatable = false)
    @JsonBackReference(value = "receipt-receiptDetails")
    @JsonProperty("receipt")
    private Receipt receipt;

    @ManyToOne
    @JoinColumn(name = "ma_san_pham", insertable = false, updatable = false)
    @JsonBackReference(value = "product-receiptDetails")
    @JsonProperty("sanPham")
    private Product sanPham;

    @Column(name = "loai_san_pham", length = 20)
    @JsonProperty("loaiSanPham")
    private String loaiSanPham;

    @Column(name = "so_luong", nullable = false)
    @JsonProperty("soLuong")
    private int soLuong;

    @Column(name = "don_gia", nullable = false)
    @JsonProperty("donGia")
    private double donGia;

    // Getters and setters
    public ReceiptDetailId getId() {
        return id;
    }

    public void setId(ReceiptDetailId id) {
        this.id = id;
    }

    public Receipt getReceipt() {
        return receipt;
    }

    public void setReceipt(Receipt receipt) {
        this.receipt = receipt;
    }

    public Product getSanPham() {
        return sanPham;
    }

    public void setSanPham(Product sanPham) {
        this.sanPham = sanPham;
    }

    public String getLoaiSanPham() {
        return loaiSanPham;
    }

    public void setLoaiSanPham(String loaiSanPham) {
        this.loaiSanPham = loaiSanPham;
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
        return "ReceiptDetail{" +
                "id=" + id +
                ", loaiSanPham='" + loaiSanPham + '\'' +
                ", soLuong=" + soLuong +
                ", donGia=" + donGia +
                ", sanPham=" + (sanPham != null ? sanPham.getMaSanPham() : "null") +
                '}';
    }
}