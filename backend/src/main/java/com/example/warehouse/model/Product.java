package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Entity
@Table(name = "sanpham")
@Getter
@Setter
@ToString
public class Product {
    @Id
    @Column(name = "ma_san_pham")
    @JsonProperty("maSanPham")
    private String maSanPham;

    @Column(name = "ten_san_pham", nullable = false)
    @JsonProperty("tenSanPham")
    private String tenSanPham;

    @Column(name = "loai_san_pham", length = 20)
    @JsonProperty("loaiSanPham")
    private String loaiSanPham;

    @Column(name = "gia", nullable = false)
    @JsonProperty("gia")
    private double gia;

    @Column(name = "so_luong", nullable = false)
    @JsonProperty("soLuong")
    private int soLuong;

    @Column(name = "xuat_xu", length = 50)
    @JsonProperty("xuatXu")
    private String xuatXu;

    @Column(name = "trang_thai", length = 20)
    @JsonProperty("trangThai")
    private String trangThai;

    @OneToMany(mappedBy = "sanPham")
    @JsonManagedReference(value = "product-receiptDetails")
    @ToString.Exclude
    @JsonProperty("receiptDetails")
    private List<ReceiptDetail> receiptDetails;

    @OneToMany(mappedBy = "sanPham")
    @JsonManagedReference(value = "product-exportReceiptDetails")
    @ToString.Exclude
    @JsonProperty("exportReceiptDetails")
    private List<ExportReceiptDetail> exportReceiptDetails;
}