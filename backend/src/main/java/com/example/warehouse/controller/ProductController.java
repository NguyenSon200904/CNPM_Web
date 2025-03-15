package com.example.warehouse.controller;

import com.example.warehouse.dto.ProductDTO;
import com.example.warehouse.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    // Có thể thêm các endpoint khác nếu cần
    @GetMapping("/inventory")
    public List<ProductDTO> getInventory() {
        return productService.getInventory();
    }
}