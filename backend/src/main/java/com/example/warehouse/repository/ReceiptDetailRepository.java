package com.example.warehouse.repository;

import com.example.warehouse.model.ReceiptDetail;
import com.example.warehouse.model.ReceiptDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReceiptDetailRepository extends JpaRepository<ReceiptDetail, ReceiptDetailId> {

    @Query("SELECT rd FROM ReceiptDetail rd WHERE rd.id.maPhieuNhap = :maPhieuNhap")
    List<ReceiptDetail> findByIdMaPhieuNhap(@Param("maPhieuNhap") int maPhieuNhap);

    @Query("SELECT rd FROM ReceiptDetail rd WHERE rd.id.maSanPham = :maSanPham")
    List<ReceiptDetail> findByIdMaSanPham(@Param("maSanPham") String maSanPham);

    @Query("SELECT CASE WHEN COUNT(rd) > 0 THEN true ELSE false END FROM ReceiptDetail rd WHERE rd.id.maPhieuNhap = :maPhieuNhap AND rd.id.maSanPham = :maSanPham")
    boolean existsByIdMaPhieuNhapAndIdMaSanPham(@Param("maPhieuNhap") int maPhieuNhap,
            @Param("maSanPham") String maSanPham);

    @Query("SELECT rd.id.maSanPham, SUM(rd.soLuong) FROM ReceiptDetail rd GROUP BY rd.id.maSanPham")
    List<Object[]> getTotalQuantityByProduct();

    @Query("SELECT COALESCE(SUM(rd.soLuong), 0) FROM ReceiptDetail rd WHERE rd.id.maSanPham = :maSanPham")
    int getTotalImportedQuantityByMaSanPham(@Param("maSanPham") String maSanPham);

}