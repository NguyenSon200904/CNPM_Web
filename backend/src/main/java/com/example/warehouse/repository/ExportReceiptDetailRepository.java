package com.example.warehouse.repository;

import com.example.warehouse.model.ExportReceiptDetail;
import com.example.warehouse.model.ExportReceiptDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExportReceiptDetailRepository extends JpaRepository<ExportReceiptDetail, ExportReceiptDetailId> {
    List<ExportReceiptDetail> findByIdMaPhieuXuat(@Param("maPhieuXuat") Long maPhieuXuat);

    @Query("SELECT ed.id.maSanPham, SUM(ed.soLuong) FROM ExportReceiptDetail ed GROUP BY ed.id.maSanPham")
    List<Object[]> getTotalQuantityByProduct();

    @Query("SELECT COALESCE(SUM(erd.soLuong), 0) FROM ExportReceiptDetail erd WHERE erd.id.maSanPham = :maSanPham")
    int getTotalExportedQuantityByMaSanPham(@Param("maSanPham") String maSanPham);

    // Thêm phương thức xóa chi tiết phiếu xuất
    @Modifying
    @Query("DELETE FROM ExportReceiptDetail erd WHERE erd.id.maPhieuXuat = :maPhieuXuat AND erd.id.maSanPham = :maSanPham")
    void deleteByIdMaPhieuXuatAndIdMaSanPham(
            @Param("maPhieuXuat") Integer maPhieuXuat,
            @Param("maSanPham") String maSanPham);
}