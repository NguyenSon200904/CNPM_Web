package com.example.warehouse.service;

import com.example.warehouse.entity.NhaCungCap;
import com.example.warehouse.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    // Lấy nhà cung cấp theo maNhaCungCap
    public NhaCungCap findByMaNhaCungCap(String maNhaCungCap) {
        return supplierRepository.findById(maNhaCungCap).orElse(null);
    }

    // Tìm danh sách nhà cung cấp theo tenNhaCungCap (tìm kiếm gần đúng)
    public List<NhaCungCap> findByTenNhaCungCapContaining(String tenNhaCungCap) {
        return supplierRepository.findByTenNhaCungCapContainingIgnoreCase(tenNhaCungCap);
    }

    // Lấy tất cả nhà cung cấp
    public List<NhaCungCap> findAll() {
        return supplierRepository.findAll();
    }

    // Lưu hoặc cập nhật nhà cung cấp
    public NhaCungCap save(NhaCungCap nhaCungCap) {
        return supplierRepository.save(nhaCungCap);
    }

    // Xóa nhà cung cấp theo maNhaCungCap
    public void deleteByMaNhaCungCap(String maNhaCungCap) {
        supplierRepository.deleteById(maNhaCungCap);
    }

    // Kiểm tra xem nhà cung cấp có tồn tại hay không
    public boolean existsByMaNhaCungCap(String maNhaCungCap) {
        return supplierRepository.existsByMaNhaCungCap(maNhaCungCap);
    }
}