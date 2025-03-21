package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, Long> {

    @Query("SELECT e FROM ExportReceipt e WHERE e.ngayXuat BETWEEN :start AND :end")
    List<ExportReceipt> findByNgayXuatBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(e.tongTien) FROM ExportReceipt e")
    Double getTotalExportReceiptAmount();

    @Query("SELECT SUM(e.tongTien) FROM ExportReceipt e WHERE e.ngayXuat BETWEEN :start AND :end")
    Double getTotalExportReceiptAmountByNgayXuatBetween(@Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}