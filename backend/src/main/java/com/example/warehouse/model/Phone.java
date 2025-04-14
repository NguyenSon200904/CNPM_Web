package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dienthoai")
@Data
public class Phone {
    @Id
    @Column(name = "ma_san_pham", length = 50)
    private String maSanPham;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    @Column(name = "do_phan_giai_camera", length = 25)
    private String doPhanGiaiCamera;

    @Column(name = "dung_luong_pin")
    private String dungLuongPin; // Đảm bảo kiểu Integer

    @Column(name = "he_dieu_hanh", length = 25)
    private String heDieuHanh;

    @Column(name = "kich_thuoc_man")
    private Double kichThuocMan;

    @Column(name = "ram", length = 25)
    private String ram;

    @Column(name = "rom", length = 25)
    private String rom;

    @Column(name = "ten_dien_thoai", length = 50)
    private String tenDienThoai;
}