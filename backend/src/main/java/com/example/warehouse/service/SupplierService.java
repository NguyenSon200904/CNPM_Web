package com.example.warehouse.service;

import com.example.warehouse.dto.SupplierDTO;
import com.example.warehouse.model.Supplier;
import com.example.warehouse.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private SupplierDTO convertToDTO(Supplier supplier) {
        SupplierDTO dto = new SupplierDTO();
        dto.setMaNhaCungCap(supplier.getMaNhaCungCap());
        dto.setTenNhaCungCap(supplier.getTenNhaCungCap());
        dto.setSdt(supplier.getSdt());
        dto.setDiaChi(supplier.getDiaChi());
        return dto;
    }
}