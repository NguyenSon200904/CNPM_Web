package com.example.warehouse.model;

import com.example.warehouse.entity.NhaCungCap;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "phieunhap")
@Getter
@Setter
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phieu_nhap")
    @JsonProperty("maPhieuNhap")
    private int maPhieuNhap;

    @Column(name = "ngay_nhap")
    @JsonProperty("ngayNhap")
    private LocalDateTime ngayNhap;

    @Column(name = "tong_tien")
    @JsonProperty("tongTien")
    private Double tongTien;

    @ManyToOne
    @JoinColumn(name = "ma_nha_cung_cap")
    @ToString.Exclude
    @JsonProperty("nhaCungCap")
    private NhaCungCap nhaCungCap;

    @ManyToOne
    @JoinColumn(name = "nguoi_tao", nullable = false)
    @ToString.Exclude
    @JsonProperty("nguoiTao")
    private Account nguoiTao;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonProperty("chiTietPhieuNhaps")
    private List<ReceiptDetail> chiTietPhieuNhaps = new ArrayList<>();

    @Override
    public String toString() {
        return "Receipt{" +
                "maPhieuNhap=" + maPhieuNhap +
                ", ngayNhap=" + ngayNhap +
                ", tongTien=" + tongTien +
                ", nhaCungCap=" + (nhaCungCap != null ? nhaCungCap.getMaNhaCungCap() : "null") +
                ", nguoiTao=" + (nguoiTao != null ? nguoiTao.getUserName() : "null") +
                ", chiTietPhieuNhaps=" + chiTietPhieuNhaps +
                '}';
    }
}