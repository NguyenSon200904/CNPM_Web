package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "phieuxuat")
@Getter
@Setter
public class ExportReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phieu_xuat")
    @JsonProperty("maPhieuXuat")
    private Integer maPhieuXuat;

    @Column(name = "ngay_xuat")
    @JsonProperty("ngayXuat")
    private LocalDateTime ngayXuat;

    @Column(name = "tong_tien")
    @JsonProperty("tongTien")
    private Double tongTien;

    @ManyToOne
    @JoinColumn(name = "nguoi_tao", nullable = false)
    @JsonProperty("nguoiTao")
    private Account nguoiTao;

    @OneToMany(mappedBy = "exportReceipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonProperty("chiTietPhieuXuats")
    private List<ExportReceiptDetail> chiTietPhieuXuats = new ArrayList<>();

    @Override
    public String toString() {
        return "ExportReceipt{" +
                "maPhieuXuat=" + maPhieuXuat +
                ", ngayXuat=" + ngayXuat +
                ", tongTien=" + tongTien +
                ", nguoiTao=" + (nguoiTao != null ? nguoiTao.getUserName() : "null") +
                ", chiTietPhieuXuats=" + chiTietPhieuXuats +
                '}';
    }
}