package com.example.warehouse.repository;

import com.example.warehouse.model.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReceiptRepository extends JpaRepository<Receipt, Integer> {

    @Query("SELECT r FROM Receipt r WHERE r.nguoiTao.userName = :userName")
    List<Receipt> findByNguoiTaoUserName(@Param("userName") String userName);

    @Query("SELECT r FROM Receipt r WHERE r.ngayNhap BETWEEN :start AND :end")
    List<Receipt> findByNgayNhapBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(r.tongTien) FROM Receipt r")
    Double getTotalReceiptAmount();

    @Query("SELECT SUM(r.tongTien) FROM Receipt r WHERE r.ngayNhap BETWEEN :start AND :end")
    Double getTotalReceiptAmountByNgayNhapBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}