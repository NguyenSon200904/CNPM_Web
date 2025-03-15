package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, String> {
}