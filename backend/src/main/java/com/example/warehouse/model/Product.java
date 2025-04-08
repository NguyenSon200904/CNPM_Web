package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "xuat_xu", length = 50)
    @JsonProperty("xuatXu")
    private String xuatXu;

    @Column(name = "trang_thai")
    @JsonProperty("trangThai")
    private Integer trangThai;

    @Column(name = "so_luong_co_the_nhap")
    @JsonProperty("soLuongCoTheNhap")
    private long soLuongCoTheNhap; // Thay int bằng long

    @OneToMany(mappedBy = "sanPham")
    @JsonIgnore // Ngăn Jackson serialize trường này
    @ToString.Exclude
    private List<ReceiptDetail> receiptDetails;

    // @OneToMany(mappedBy = "sanPham")
    // @JsonIgnore // Ngăn Jackson serialize trường này
    // @ToString.Exclude
    // private List<ExportReceiptDetail> exportReceiptDetails;

    @OneToMany(mappedBy = "sanPham", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "product-exportReceiptDetails")
    @JsonIgnore
    private List<ExportReceiptDetail> exportReceiptDetails;
}