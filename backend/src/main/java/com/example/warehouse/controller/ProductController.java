package com.example.warehouse.controller;

import com.example.warehouse.model.Product;
import com.example.warehouse.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Lấy tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.findAll();
        return ResponseEntity.ok(products);
    }

    // Lấy sản phẩm theo maSanPham
    @GetMapping("/{maSanPham}")
    public ResponseEntity<Product> getProductByMaSanPham(@PathVariable String maSanPham) {
        Product product = productService.findByMaSanPham(maSanPham);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    // Lấy danh sách sản phẩm theo loaiSanPham
    @GetMapping("/type/{loaiSanPham}")
    public ResponseEntity<List<Product>> getProductsByLoaiSanPham(@PathVariable String loaiSanPham) {
        List<Product> products = productService.findByLoaiSanPham(loaiSanPham);
        return ResponseEntity.ok(products);
    }

    // Lấy danh sách sản phẩm theo trangThai
    @GetMapping("/status/{trangThai}")
    public ResponseEntity<List<Product>> getProductsByTrangThai(@PathVariable Integer trangThai) {
        if (trangThai == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Product> products = productService.findByTrangThai(trangThai);
        return ResponseEntity.ok(products);
    }

    // Tạo sản phẩm mới
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        if (productService.existsByMaSanPham(product.getMaSanPham())) {
            return ResponseEntity.badRequest().build();
        }
        Product savedProduct = productService.save(product);
        return ResponseEntity.status(201).body(savedProduct);
    }

    // Cập nhật sản phẩm
    @PutMapping("/{maSanPham}")
    public ResponseEntity<Product> updateProduct(@PathVariable String maSanPham, @RequestBody Product product) {
        if (!productService.existsByMaSanPham(maSanPham)) {
            return ResponseEntity.notFound().build();
        }
        product.setMaSanPham(maSanPham);
        Product updatedProduct = productService.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    // Xóa sản phẩm
    @DeleteMapping("/{maSanPham}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String maSanPham) {
        if (!productService.existsByMaSanPham(maSanPham)) {
            return ResponseEntity.notFound().build();
        }
        productService.deleteByMaSanPham(maSanPham);
        return ResponseEntity.noContent().build();
    }
}