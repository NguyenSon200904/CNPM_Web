package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceiptDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExportReceiptDetailRepository extends JpaRepository<ExportReceiptDetail, String> {
}