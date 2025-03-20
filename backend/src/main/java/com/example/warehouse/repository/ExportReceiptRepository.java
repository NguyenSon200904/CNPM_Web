package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, Long> {
    List<ExportReceipt> findByAccountUserName(String userName);

    List<ExportReceipt> findByNgayXuatBetween(LocalDateTime start, LocalDateTime end);

    boolean existsByMaPhieuXuat(Long maPhieuXuat);
}