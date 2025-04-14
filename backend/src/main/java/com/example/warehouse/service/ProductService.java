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
import java.util.Optional;

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

    // Chỉ lấy các sản phẩm có trang_thai = 1 (Hoạt động)
    public List<Product> findAll() {
        return productRepository.findByTrangThai(1);
    }

    // Chỉ lấy các sản phẩm có trang_thai = 1 và theo loại sản phẩm
    public List<Product> findByLoaiSanPham(String loaiSanPham) {
        return productRepository.findByLoaiSanPhamAndTrangThai(loaiSanPham, 1);
    }

    public List<Product> findByTrangThai(int trangThai) {
        return productRepository.findByTrangThai(trangThai);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void deleteById(String id) {
        deleteByMaSanPham(id);
    }

    // Soft delete: Cập nhật trạng thái thành 0 (Không hoạt động)
    @Transactional
    public void deleteByMaSanPham(String maSanPham) {
        Optional<Product> productOptional = productRepository.findById(maSanPham);
        if (productOptional.isEmpty()) {
            throw new IllegalArgumentException("Sản phẩm không tồn tại: " + maSanPham);
        }

        Product product = productOptional.get();
        product.setTrangThai(0); // Đặt trạng thái thành "Không hoạt động"
        productRepository.save(product);
        logger.info("Đã soft delete sản phẩm: {}", maSanPham);
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