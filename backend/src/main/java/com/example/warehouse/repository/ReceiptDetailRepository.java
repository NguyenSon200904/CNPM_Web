package com.example.warehouse.repository;

import com.example.warehouse.model.ReceiptDetail;
import com.example.warehouse.model.ReceiptDetailId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceiptDetailRepository extends JpaRepository<ReceiptDetail, ReceiptDetailId> {
    // Lấy danh sách chi tiết phiếu nhập theo maPhieu
    List<ReceiptDetail> findByIdMaPhieu(String maPhieu);

    // Lấy danh sách chi tiết phiếu nhập theo maSanPham
    List<ReceiptDetail> findByIdMaSanPham(String maSanPham);

    // Kiểm tra xem một sản phẩm đã tồn tại trong phiếu nhập hay chưa
    boolean existsByIdMaPhieuAndIdMaSanPham(String maPhieu, String maSanPham);
}