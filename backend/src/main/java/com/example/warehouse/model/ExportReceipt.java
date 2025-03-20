package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing an ExportReceipt (PhieuXuat) in the warehouse system.
 */
@Entity
@Table(name = "phieuxuat")
@Data
public class ExportReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phieu_xuat", nullable = false)
    private Long maPhieuXuat; // Sửa từ maPhieu (String) thành maPhieuXuat (Long)

    @Column(name = "ngay_xuat")
    private LocalDateTime ngayXuat; // Sửa từ thoiGianTao thành ngayXuat

    @ManyToOne
    @JoinColumn(name = "nguoi_tao", referencedColumnName = "user_name", nullable = false)
    @JsonBackReference
    private Account account;

    @Column(name = "tong_tien", nullable = false)
    private double tongTien;

    @OneToMany(mappedBy = "exportReceipt", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ExportReceiptDetail> details;
}