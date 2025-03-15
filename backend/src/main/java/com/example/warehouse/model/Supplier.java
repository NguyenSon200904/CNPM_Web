package com.example.warehouse.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "NhaCungCap")
@Data
public class Supplier {
    @Id
    private String maNhaCungCap;
    private String tenNhaCungCap;
    private String sdt;
    private String diaChi;
}