package com.example.warehouse.repository;

import com.example.warehouse.model.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReceiptRepository extends JpaRepository<Receipt, String> {
    // Lấy danh sách phiếu nhập theo nguoiTao
    List<Receipt> findByNguoiTaoUserName(String nguoiTao);

    // Lấy danh sách phiếu nhập theo maNhaCungCap
    List<Receipt> findByNhaCungCapMaNhaCungCap(String maNhaCungCap);

    // Lấy danh sách phiếu nhập theo khoảng thời gian
    List<Receipt> findByThoiGianTaoBetween(LocalDateTime start, LocalDateTime end);

    // Kiểm tra xem một phiếu nhập có tồn tại hay không
    boolean existsByMaPhieu(String maPhieu);
}