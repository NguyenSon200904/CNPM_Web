package com.example.warehouse.controller;

import com.example.warehouse.entity.NhaCungCap;
import com.example.warehouse.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    // GET: Lấy danh sách nhà cung cấp
    @GetMapping("/suppliers")
    public List<NhaCungCap> getSuppliers() {
        return supplierService.findAll();
    }

    // POST: Thêm nhà cung cấp mới
    @PostMapping("/suppliers")
    public NhaCungCap addSupplier(@RequestBody NhaCungCap nhaCungCap) {
        if (supplierService.existsByMaNhaCungCap(nhaCungCap.getMaNhaCungCap())) {
            throw new RuntimeException("Mã nhà cung cấp đã tồn tại!");
        }
        return supplierService.save(nhaCungCap);
    }

    // PUT: Sửa nhà cung cấp
    @PutMapping("/suppliers/{maNhaCungCap}")
    public NhaCungCap updateSupplier(@PathVariable String maNhaCungCap, @RequestBody NhaCungCap nhaCungCap) {
        if (!supplierService.existsByMaNhaCungCap(maNhaCungCap)) {
            throw new RuntimeException("Nhà cung cấp không tồn tại!");
        }
        nhaCungCap.setMaNhaCungCap(maNhaCungCap); // Đảm bảo mã không bị thay đổi
        return supplierService.save(nhaCungCap);
    }

    // DELETE: Xóa nhà cung cấp
    @DeleteMapping("/suppliers/{maNhaCungCap}")
    public void deleteSupplier(@PathVariable String maNhaCungCap) {
        if (!supplierService.existsByMaNhaCungCap(maNhaCungCap)) {
            throw new RuntimeException("Nhà cung cấp không tồn tại!");
        }
        supplierService.deleteByMaNhaCungCap(maNhaCungCap);
    }
}