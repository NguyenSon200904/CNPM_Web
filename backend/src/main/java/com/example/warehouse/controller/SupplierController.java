package com.example.warehouse.controller;

import com.example.warehouse.entity.NhaCungCap;
import com.example.warehouse.repository.SupplierRepository;
import com.example.warehouse.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections; // Thêm import này để sử dụng Collections.emptyList()
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private SupplierRepository supplierRepository;

    @GetMapping("/suppliers")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<List<NhaCungCap>> getAllSuppliers() {
        try {
            List<NhaCungCap> suppliers = supplierRepository.findAll();
            return new ResponseEntity<>(suppliers, HttpStatus.OK);
        } catch (Exception e) {
            // Trả về danh sách rỗng thay vì null để khớp với kiểu trả về
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
            throw new RuntimeException("Nhà cung cấp không tồn tại!");
        }
        supplierService.deleteByMaNhaCungCap(maNhaCungCap);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}