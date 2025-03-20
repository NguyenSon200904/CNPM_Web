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

    // Lấy sản phẩm theo maSanPham
    public Product findByMaSanPham(String maSanPham) {
        return productRepository.findById(maSanPham).orElse(null);
    }

    // Lấy danh sách sản phẩm theo loaiSanPham
    public List<Product> findByLoaiSanPham(String loaiSanPham) {
        return productRepository.findByLoaiSanPham(loaiSanPham);
    }

    // Lấy danh sách sản phẩm theo trangThai
    public List<Product> findByTrangThai(Integer trangThai) {
        return productRepository.findByTrangThai(trangThai);
    }

    // Lấy tất cả sản phẩm
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    // Lưu hoặc cập nhật sản phẩm
    public Product save(Product product) {
        return productRepository.save(product);
    }

    // Xóa sản phẩm theo maSanPham
    public void deleteByMaSanPham(String maSanPham) {
        productRepository.deleteById(maSanPham);
    }

    // Kiểm tra xem sản phẩm có tồn tại hay không
    public boolean existsByMaSanPham(String maSanPham) {
        return productRepository.existsByMaSanPham(maSanPham);
    }
}