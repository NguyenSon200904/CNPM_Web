package com.example.warehouse.repository;

import com.example.warehouse.model.ReceiptDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptDetailRepository extends JpaRepository<ReceiptDetail, String> {
}