package com.example.warehouse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class ExportReceiptDetailId implements Serializable {
    @Column(name = "ma_phieu_xuat", nullable = false)
    private Long maPhieuXuat;

    @Column(name = "maSanPham", nullable = false, length = 25)
    private String maSanPham;
}