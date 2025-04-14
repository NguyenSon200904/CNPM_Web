package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "maytinh")
@Data
public class Computer {
    @Id
    @Column(name = "ma_san_pham", length = 50)
    private String maSanPham;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ma_san_pham")
    private Product product;

    @Column(name = "cong_suat_nguon")
    private Integer congSuatNguon;

    @Column(name = "dung_luong_pin", length = 255)
    private String dungLuongPin;

    @Column(name = "kich_thuoc_man")
    private Double kichThuocMan;

    @Column(name = "loai_may", length = 255)
    private String loaiMay;

    @Column(name = "ma_board", length = 255)
    private String maBoard;

    @Column(name = "ram", length = 255)
    private String ram;

    @Column(name = "rom", length = 255)
    private String rom;

    @Column(name = "tencpu", length = 255)
    private String tenCPU;
}