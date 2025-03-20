package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "MayTinh")
@Data
public class MayTinh extends Product {
    @Column(name = "tenCpu", nullable = false)
    private String tenCpu;

    @Column(name = "ram", nullable = false)
    private String ram;

    @Column(name = "cardManHinh")
    private String cardManHinh;

    @Column(name = "mainBoard")
    private String mainBoard;

    @Column(name = "congSuatNguon")
    private Integer congSuatNguon;

    @Column(name = "loaiMay")
    private String loaiMay;

    @Column(name = "rom")
    private String rom;

    @Column(name = "kichThuocMan")
    private Double kichThuocMan;

    @Column(name = "dungLuongPin")
    private String dungLuongPin;
}