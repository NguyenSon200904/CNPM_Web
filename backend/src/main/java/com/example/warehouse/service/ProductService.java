package com.example.warehouse.service;

import com.example.warehouse.model.Product;
import com.example.warehouse.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    // Thêm phương thức findByMaSanPham (tương tự findById)
    public Product findByMaSanPham(String maSanPham) {
        return productRepository.findById(maSanPham).orElse(null);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    // Thêm phương thức findByLoaiSanPham
    public List<Product> findByLoaiSanPham(String loaiSanPham) {
        return productRepository.findByLoaiSanPham(loaiSanPham);
    }

    // Thêm phương thức findByTrangThai
    public List<Product> findByTrangThai(int trangThai) {
        return productRepository.findByTrangThai(trangThai);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void deleteById(String id) {
        productRepository.deleteById(id);
    }

    // Thêm phương thức deleteByMaSanPham (tương tự deleteById)
    public void deleteByMaSanPham(String maSanPham) {
        productRepository.deleteById(maSanPham);
    }

    // Thêm phương thức existsByMaSanPham
    public boolean existsByMaSanPham(String maSanPham) {
        return productRepository.existsById(maSanPham);
    }

    public long countAll() {
        return productRepository.countAll();
    }
}