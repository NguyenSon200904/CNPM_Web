package com.example.warehouse.service;

import com.example.warehouse.model.Product;
import com.example.warehouse.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product findByMaSanPham(String maSanPham) {
        return productRepository.findById(maSanPham).orElse(null);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public List<Product> findByLoaiSanPham(String loaiSanPham) {
        return productRepository.findByLoaiSanPham(loaiSanPham);
    }

    public List<Product> findByTrangThai(int trangThai) {
        return productRepository.findByTrangThai(trangThai);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void deleteById(String id) {
        productRepository.deleteById(id);
    }

    public void deleteByMaSanPham(String maSanPham) {
        productRepository.deleteById(maSanPham);
    }

    public boolean existsByMaSanPham(String maSanPham) {
        return productRepository.existsById(maSanPham);
    }

    public long countAll() {
        return productRepository.countAll();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateSoLuongCoTheNhap(String maSanPham, int soLuongNhap) {
        Product product = productRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại: " + maSanPham));

        logger.info("Trước khi cập nhật - Sản phẩm {}: soLuongCoTheNhap = {}", maSanPham,
                product.getSoLuongCoTheNhap());

        long soLuongCoTheNhapMoi = product.getSoLuongCoTheNhap() - soLuongNhap;
        if (soLuongCoTheNhapMoi < 0) {
            logger.error("Số lượng có thể nhập không thể âm cho sản phẩm: {}", maSanPham);
            throw new IllegalArgumentException("Số lượng có thể nhập không thể âm cho sản phẩm: " + maSanPham);
        }

        product.setSoLuongCoTheNhap(soLuongCoTheNhapMoi);
        productRepository.saveAndFlush(product);
        logger.info("Sau khi cập nhật - Sản phẩm {}: soLuongCoTheNhap = {}", maSanPham, product.getSoLuongCoTheNhap());
    }
}