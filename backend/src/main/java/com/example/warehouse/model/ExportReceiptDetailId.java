package com.example.warehouse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

/**
 * Composite key for ExportReceiptDetail, consisting of maPhieuXuat and
 * maSanPham.
 */
@Embeddable
@Data
public class ExportReceiptDetailId implements Serializable {
    @Column(name = "ma_phieu_xuat", nullable = false) // Xóa length vì không áp dụng cho Long
    private Long maPhieuXuat;

    @Column(name = "maSanPham", nullable = false, length = 50)
    private String maSanPham;
}