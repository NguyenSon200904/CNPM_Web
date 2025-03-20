package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.model.ExportReceiptDetailId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExportReceiptDetailRepository extends JpaRepository<ExportReceiptDetail, ExportReceiptDetailId> {
    // Lấy danh sách chi tiết phiếu xuất theo maPhieu
    List<ExportReceiptDetail> findByIdMaPhieu(String maPhieu);

    // Lấy danh sách chi tiết phiếu xuất theo maSanPham
    List<ExportReceiptDetail> findByIdMaSanPham(String maSanPham);

    // Kiểm tra xem một sản phẩm đã tồn tại trong phiếu xuất hay chưa
    boolean existsByIdMaPhieuAndIdMaSanPham(String maPhieu, String maSanPham);
}