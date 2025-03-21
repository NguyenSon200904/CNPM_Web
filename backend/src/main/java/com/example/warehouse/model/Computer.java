package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "maytinh")
@Data
public class Computer {
    @Id
    @Column(name = "maSanPham", length = 50)
    private String maSanPham;

    @OneToOne
    @MapsId
    @JoinColumn(name = "maSanPham")
    private Product product;

    @Column(name = "congSuatNguon")
    private int congSuatNguon;

    @Column(name = "dungLuongPin", length = 25)
    private String dungLuongPin;

    @Column(name = "kichThuocMan")
    private double kichThuocMan;

    @Column(name = "loaiMay", length = 255)
    private String loaiMay;

    @Column(name = "maBoard", length = 255)
    private String maBoard;

    @Column(name = "ram", length = 255)
    private String ram;

    @Column(name = "rom", length = 255)
    private String rom;

    @Column(name = "tenCPU", length = 255)
    private String tenCPU;
}