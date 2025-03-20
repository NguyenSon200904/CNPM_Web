package com.example.warehouse.controller;

import com.example.warehouse.model.Supplier;
import com.example.warehouse.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    // Lấy tất cả nhà cung cấp
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        List<Supplier> suppliers = supplierService.findAll();
        return ResponseEntity.ok(suppliers);
    }

    // Lấy nhà cung cấp theo maNhaCungCap
    @GetMapping("/{maNhaCungCap}")
    public ResponseEntity<Supplier> getSupplierByMaNhaCungCap(@PathVariable String maNhaCungCap) {
        Supplier supplier = supplierService.findByMaNhaCungCap(maNhaCungCap);
        if (supplier == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(supplier);
    }

    // Tìm nhà cung cấp theo tenNhaCungCap
    @GetMapping("/search")
    public ResponseEntity<List<Supplier>> searchSuppliersByTenNhaCungCap(@RequestParam String tenNhaCungCap) {
        List<Supplier> suppliers = supplierService.findByTenNhaCungCapContaining(tenNhaCungCap);
        return ResponseEntity.ok(suppliers);
    }

    // Tạo nhà cung cấp mới
    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        if (supplierService.existsByMaNhaCungCap(supplier.getMaNhaCungCap())) {
            return ResponseEntity.badRequest().build();
        }
        Supplier savedSupplier = supplierService.save(supplier);
        return ResponseEntity.status(201).body(savedSupplier);
    }

    // Cập nhật nhà cung cấp
    @PutMapping("/{maNhaCungCap}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable String maNhaCungCap, @RequestBody Supplier supplier) {
        if (!supplierService.existsByMaNhaCungCap(maNhaCungCap)) {
            return ResponseEntity.notFound().build();
        }
        supplier.setMaNhaCungCap(maNhaCungCap);
        Supplier updatedSupplier = supplierService.save(supplier);
        return ResponseEntity.ok(updatedSupplier);
    }

    // Xóa nhà cung cấp
    @DeleteMapping("/{maNhaCungCap}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable String maNhaCungCap) {
        if (!supplierService.existsByMaNhaCungCap(maNhaCungCap)) {
            return ResponseEntity.notFound().build();
        }
        supplierService.deleteByMaNhaCungCap(maNhaCungCap);
        return ResponseEntity.noContent().build();
    }
}