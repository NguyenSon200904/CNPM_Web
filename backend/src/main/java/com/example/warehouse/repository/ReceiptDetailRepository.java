package com.example.warehouse.repository;

import com.example.warehouse.model.ReceiptDetail;
import com.example.warehouse.model.ReceiptDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReceiptDetailRepository extends JpaRepository<ReceiptDetail, ReceiptDetailId> {

    @Query("SELECT rd FROM ReceiptDetail rd WHERE rd.id.maPhieuNhap = :maPhieuNhap")
    List<ReceiptDetail> findByIdMaPhieuNhap(@Param("maPhieuNhap") Long maPhieuNhap);

    @Query("SELECT rd FROM ReceiptDetail rd WHERE rd.id.maSanPham = :maSanPham")
    List<ReceiptDetail> findByIdMaSanPham(@Param("maSanPham") String maSanPham);

    @Query("SELECT CASE WHEN COUNT(rd) > 0 THEN true ELSE false END FROM ReceiptDetail rd WHERE rd.id.maPhieuNhap = :maPhieuNhap AND rd.id.maSanPham = :maSanPham")
    boolean existsByIdMaPhieuNhapAndIdMaSanPham(@Param("maPhieuNhap") Long maPhieuNhap,
            @Param("maSanPham") String maSanPham);
}