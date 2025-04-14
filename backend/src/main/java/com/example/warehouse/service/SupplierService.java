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

    // Lấy nhà cung cấp theo maNhaCungCap (chỉ lấy nếu trang_thai = 1)
    public NhaCungCap findByMaNhaCungCap(String maNhaCungCap) {
        NhaCungCap nhaCungCap = supplierRepository.findById(maNhaCungCap).orElse(null);
        if (nhaCungCap != null && nhaCungCap.getTrangThai() == 1) {
            return nhaCungCap;
        }
        return null;
    }

    // Tìm danh sách nhà cung cấp theo tenNhaCungCap (tìm kiếm gần đúng, chỉ lấy nếu
    // trang_thai = 1)
    public List<NhaCungCap> findByTenNhaCungCapContaining(String tenNhaCungCap) {
        List<NhaCungCap> suppliers = supplierRepository.findByTenNhaCungCapContainingIgnoreCase(tenNhaCungCap);
        return suppliers.stream()
                .filter(nhaCungCap -> nhaCungCap.getTrangThai() == 1)
                .toList();
    }

    // Lấy tất cả nhà cung cấp (chỉ lấy nếu trang_thai = 1)
    public List<NhaCungCap> findAll() {
        return supplierRepository.findByTrangThai(1);
    }

    // Lưu hoặc cập nhật nhà cung cấp
    public NhaCungCap save(NhaCungCap nhaCungCap) {
        if (nhaCungCap == null) {
            throw new IllegalArgumentException("Nhà cung cấp không được null!");
        }
        // Đảm bảo trạng thái là 1 khi lưu mới hoặc cập nhật
        if (nhaCungCap.getTrangThai() == null) {
            nhaCungCap.setTrangThai(1);
        }
        return supplierRepository.save(nhaCungCap);
    }

    // Soft delete nhà cung cấp theo maNhaCungCap (cập nhật trang_thai = 0)
    public void deleteByMaNhaCungCap(String maNhaCungCap) {
        if (maNhaCungCap == null) {
            throw new IllegalArgumentException("Mã nhà cung cấp không được null!");
        }
        NhaCungCap nhaCungCap = supplierRepository.findById(maNhaCungCap).orElse(null);
        if (nhaCungCap != null && nhaCungCap.getTrangThai() == 1) {
            nhaCungCap.setTrangThai(0); // Soft delete: đặt trạng thái thành 0
            supplierRepository.save(nhaCungCap);
        } else {
            throw new IllegalArgumentException("Nhà cung cấp không tồn tại hoặc đã bị xóa!");
        }
    }

    // Kiểm tra xem nhà cung cấp có tồn tại hay không (chỉ tính nếu trang_thai = 1)
    public boolean existsByMaNhaCungCap(String maNhaCungCap) {
        if (maNhaCungCap == null) {
            return false;
        }
        NhaCungCap nhaCungCap = supplierRepository.findById(maNhaCungCap).orElse(null);
        return nhaCungCap != null && nhaCungCap.getTrangThai() == 1;
    }
}