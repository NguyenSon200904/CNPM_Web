package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, Long> {

    List<ExportReceipt> findByNguoiTaoUserName(String userName);

    List<ExportReceipt> findByNgayXuatBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(r.tongTien) FROM ExportReceipt r")
    Double getTotalExportAmount();

    @Query("SELECT SUM(r.tongTien) FROM ExportReceipt r WHERE r.ngayXuat BETWEEN :start AND :end")
    Double getTotalExportAmountByNgayXuatBetween(LocalDateTime start, LocalDateTime end);

}