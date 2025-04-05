package com.example.warehouse.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class InventoryDTO {
    @JsonProperty("maSanPham")
    private String maSanPham;

    @JsonProperty("tenSanPham")
    private String tenSanPham;

    @JsonProperty("loaiSanPham")
    private String loaiSanPham;

    @JsonProperty("gia")
    private double gia;

    @JsonProperty("soLuongTonKho")
    private int soLuongTonKho;

    // Getters và setters
    public String getMaSanPham() {
        return maSanPham;
    }

    public void setMaSanPham(String maSanPham) {
        this.maSanPham = maSanPham;
    }

    public String getTenSanPham() {
        return tenSanPham;
    }

    public void setTenSanPham(String tenSanPham) {
        this.tenSanPham = tenSanPham;
    }

    public String getLoaiSanPham() {
        return loaiSanPham;
    }

    public void setLoaiSanPham(String loaiSanPham) {
        this.loaiSanPham = loaiSanPham;
    }

    public double getGia() {
        return gia;
    }

    public void setGia(double gia) {
        this.gia = gia;
    }

    public int getSoLuongTonKho() {
        return soLuongTonKho;
    }

    public void setSoLuongTonKho(int soLuongTonKho) {
        this.soLuongTonKho = soLuongTonKho;
    }
}