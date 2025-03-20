package com.example.warehouse.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "phieunhap")
@Data
public class Receipt {
    @Id
    @Column(name = "maPhieu", nullable = false, length = 50)
    private String maPhieu;

    @Column(name = "thoiGianTao")
    private LocalDateTime thoiGianTao;

    @ManyToOne
    @JoinColumn(name = "maNhaCungCap", referencedColumnName = "maNhaCungCap")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "nguoiTao", referencedColumnName = "userName")
    private Account account;

    @Column(name = "tongTien", nullable = false)
    private double tongTien;

    public double getTongTien() {
        return tongTien;
    }

    public void setTongTien(double tongTien) {
        this.tongTien = tongTien;
    }

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ReceiptDetail> details;
}