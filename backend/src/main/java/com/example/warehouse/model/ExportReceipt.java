package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing an ExportReceipt (PhieuXuat) in the warehouse system.
 */
@Entity
@Table(name = "PhieuXuat")
@Data
public class ExportReceipt {
    @Id
    @Column(name = "maPhieu", nullable = false, length = 50)
    private String maPhieu;

    @Column(name = "thoiGianTao")
    private LocalDateTime thoiGianTao;

    @ManyToOne
    @JoinColumn(name = "nguoiTao", referencedColumnName = "userName", nullable = false)
    private Account account;

    @Column(name = "tongTien", nullable = false)
    private double tongTien;

    @OneToMany(mappedBy = "exportReceipt", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ExportReceiptDetail> details;
}