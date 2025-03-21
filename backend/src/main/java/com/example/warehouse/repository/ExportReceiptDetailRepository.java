package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.model.ExportReceiptDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExportReceiptDetailRepository extends JpaRepository<ExportReceiptDetail, ExportReceiptDetailId> {
    List<ExportReceiptDetail> findByIdMaPhieuXuat(@Param("maPhieuXuat") Long maPhieuXuat);
}