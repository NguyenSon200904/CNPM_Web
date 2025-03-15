package com.example.warehouse.service;

import com.example.warehouse.dto.ProductDTO;
import com.example.warehouse.model.Product;
import com.example.warehouse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getInventory() {
        return productRepository.findAll().stream()
                .filter(product -> product.getSoLuong() > 0)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getTotalProducts() {
        return productRepository.count(); // Sử dụng phương thức count() của JpaRepository
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setMaMay(product.getMaMay());
        dto.setTenMay(product.getTenMay());
        dto.setSoLuong(product.getSoLuong());
        dto.setTenCpu(product.getTenCpu());
        dto.setRam(product.getRam());
        dto.setCardManHinh(product.getCardManHinh());
        dto.setGia(product.getGia());
        dto.setMainBoard(product.getMainBoard());
        dto.setCongSuatNguon(product.getCongSuatNguon());
        dto.setLoaiMay(product.getLoaiMay());
        dto.setRom(product.getRom());
        dto.setKichThuocMan(product.getKichThuocMan());
        dto.setDungLuongPin(product.getDungLuongPin());
        dto.setXuatXu(product.getXuatXu());
        dto.setTrangThai(product.getTrangThai());
        return dto;
    }
}