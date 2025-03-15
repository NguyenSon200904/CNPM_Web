package com.example.warehouse.repository;

import com.example.warehouse.model.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptRepository extends JpaRepository<Receipt, String> {
}