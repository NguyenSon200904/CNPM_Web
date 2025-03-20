package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, String> {
    // Lấy danh sách phiếu xuất theo nguoiTao
    List<ExportReceipt> findByNguoiTaoUserName(String nguoiTao);

    // Lấy danh sách phiếu xuất theo khoảng thời gian
    List<ExportReceipt> findByThoiGianTaoBetween(LocalDateTime start, LocalDateTime end);

    // Kiểm tra xem một phiếu xuất có tồn tại hay không (dựa trên maPhieu)
    boolean existsByMaPhieu(String maPhieu);
}