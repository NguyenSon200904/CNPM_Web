package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceipt;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, Integer> {

    @EntityGraph(attributePaths = { "chiTietPhieuXuats", "chiTietPhieuXuats.sanPham", "nguoiTao" })
    @Override
    @NonNull
    List<ExportReceipt> findAll();

    @EntityGraph(attributePaths = { "chiTietPhieuXuats", "chiTietPhieuXuats.sanPham", "nguoiTao" })
    @NonNull
    List<ExportReceipt> findByNguoiTaoUserName(String userName);

    @EntityGraph(attributePaths = { "chiTietPhieuXuats", "chiTietPhieuXuats.sanPham", "nguoiTao" })
    @NonNull
    List<ExportReceipt> findByNgayXuatBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(r.tongTien) FROM ExportReceipt r")
    Double getTotalExportAmount();

    @Query("SELECT SUM(r.tongTien) FROM ExportReceipt r WHERE r.ngayXuat BETWEEN :start AND :end")
    Double getTotalExportAmountByNgayXuatBetween(LocalDateTime start, LocalDateTime end);

    // Thêm phương thức findById với @EntityGraph để đảm bảo fetch dữ liệu đầy đủ
    @EntityGraph(attributePaths = { "chiTietPhieuXuats", "chiTietPhieuXuats.sanPham", "nguoiTao" })
    @NonNull
    Optional<ExportReceipt> findById(Integer id);

}