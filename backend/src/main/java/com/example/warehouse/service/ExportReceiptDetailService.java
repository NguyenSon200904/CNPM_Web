package com.example.warehouse.service;

import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.model.ExportReceiptDetailId;

import java.util.List;

public interface ExportReceiptDetailService {
    List<ExportReceiptDetail> findAll();

    ExportReceiptDetail findById(ExportReceiptDetailId id);

    ExportReceiptDetail save(ExportReceiptDetail detail);

    void deleteById(ExportReceiptDetailId id);

    boolean existsById(ExportReceiptDetailId id);

    boolean existsByIdMaPhieuXuatAndIdMaSanPham(Long maPhieuXuat, String maSanPham);

    List<ExportReceiptDetail> findByIdMaPhieuXuat(Long maPhieuXuat);
}