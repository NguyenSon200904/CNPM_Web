package com.example.warehouse.controller;

import com.example.warehouse.entity.NhaCungCap;
import com.example.warehouse.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost5173:")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping("/suppliers")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager', 'ROLE_Importer', 'ROLE_Exporter')")
    public ResponseEntity<List<NhaCungCap>> getAllSuppliers() {
        try {
            List<NhaCungCap> suppliers = supplierService.findAll(); // Chỉ lấy các nhà cung cấp có trang_thai = 1
            return new ResponseEntity<>(suppliers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/suppliers")
    public ResponseEntity<NhaCungCap> addSupplier(@RequestBody NhaCungCap nhaCungCap) {
        Objects.requireNonNull(nhaCungCap, "Nhà cung cấp không được null");
        Objects.requireNonNull(nhaCungCap.getMaNhaCungCap(), "Mã nhà cung cấp không được null");
        if (supplierService.existsByMaNhaCungCap(nhaCungCap.getMaNhaCungCap())) {
            throw new RuntimeException("Mã nhà cung cấp đã tồn tại!");
        }
        NhaCungCap savedSupplier = supplierService.save(nhaCungCap);
        return new ResponseEntity<>(savedSupplier, HttpStatus.CREATED);
    }

    @PutMapping("/suppliers/{maNhaCungCap}")
    public ResponseEntity<NhaCungCap> updateSupplier(
            @PathVariable String maNhaCungCap, @RequestBody NhaCungCap nhaCungCap) {
        Objects.requireNonNull(maNhaCungCap, "Mã nhà cung cấp không được null");
        Objects.requireNonNull(nhaCungCap, "Nhà cung cấp không được null");
        if (!supplierService.existsByMaNhaCungCap(maNhaCungCap)) {
            throw new RuntimeException("Nhà cung cấp không tồn tại!");
        }
        nhaCungCap.setMaNhaCungCap(maNhaCungCap);
        NhaCungCap updatedSupplier = supplierService.save(nhaCungCap);
        return new ResponseEntity<>(updatedSupplier, HttpStatus.OK);
    }

    @DeleteMapping("/suppliers/{maNhaCungCap}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable String maNhaCungCap) {
        Objects.requireNonNull(maNhaCungCap, "Mã nhà cung cấp không được null");
        if (!supplierService.existsByMaNhaCungCap(maNhaCungCap)) {
            throw new RuntimeException("Nhà cung cấp không tồn tại hoặc đã bị xóa!");
        }
        supplierService.deleteByMaNhaCungCap(maNhaCungCap); // Sử dụng soft delete
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}