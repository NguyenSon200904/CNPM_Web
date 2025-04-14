package com.example.warehouse.controller;

import com.example.warehouse.dto.ProductDTO;
import com.example.warehouse.model.Product;
import com.example.warehouse.entity.MayTinh;
import com.example.warehouse.entity.DienThoai;
import com.example.warehouse.repository.MayTinhRepository;
import com.example.warehouse.repository.DienThoaiRepository;
import com.example.warehouse.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private MayTinhRepository mayTinhRepository;

    @Autowired
    private DienThoaiRepository dienThoaiRepository;

    // GET: Lấy danh sách sản phẩm
    @GetMapping("/products")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager', 'ROLE_Importer', 'ROLE_Exporter')")
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(name = "loai_san_pham", required = false) String loaiSanPham) {
        try {
            List<ProductDTO> result = new ArrayList<>();
            List<Product> products;

            if (loaiSanPham == null || loaiSanPham.equals("TẤT_CẢ")) {
                products = productService.findAll(); // Lấy tất cả sản phẩm
                System.out.println("Found " + products.size() + " products (all types)");
            } else {
                // Sử dụng trực tiếp giá trị loaiSanPham từ frontend ("MAYTINH" hoặc
                // "DIENTHOAI")
                System.out.println("loai_san_pham: " + loaiSanPham);
                products = productService.findByLoaiSanPham(loaiSanPham); // Gọi service với giá trị gốc
                System.out.println("Found " + products.size() + " products with loai_san_pham = " + loaiSanPham);
            }

            for (Product product : products) {
                ProductDTO dto = new ProductDTO();
                dto.setMaSanPham(product.getMaSanPham());
                dto.setTenSanPham(product.getTenSanPham());
                dto.setGia(product.getGia());
                dto.setSoLuongCoTheNhap(product.getSoLuongCoTheNhap());
                dto.setLoaiSanPham(product.getLoaiSanPham()); // Giữ nguyên giá trị từ DB
                dto.setXuatXu(product.getXuatXu());
                try {
                    dto.setTrangThai(product.getTrangThai());
                } catch (NumberFormatException e) {
                    dto.setTrangThai(null);
                }

                if ("MAYTINH".equals(product.getLoaiSanPham())) {
                    mayTinhRepository.findByMaSanPham(product.getMaSanPham()).ifPresent(mayTinh -> {
                        System.out.println("Found MayTinh for maSanPham: " + product.getMaSanPham());
                        dto.setTenCpu(mayTinh.getTencpu());
                        dto.setRam(mayTinh.getRam());
                        dto.setRom(mayTinh.getRom());
                        dto.setCongSuatNguon(mayTinh.getCongSuatNguon());
                        dto.setDungLuongPin(mayTinh.getDungLuongPin());
                        dto.setKichThuocMan(mayTinh.getKichThuocMan());
                        dto.setMaBoard(mayTinh.getMaBoard());
                    });
                } else if ("DIENTHOAI".equals(product.getLoaiSanPham())) {
                    dienThoaiRepository.findByMaSanPham(product.getMaSanPham()).ifPresent(dienThoai -> {
                        System.out.println("Found DienThoai for maSanPham: " + product.getMaSanPham());
                        dto.setHeDieuHanh(dienThoai.getHeDieuHanh());
                        dto.setDoPhanGiaiCamera(dienThoai.getDoPhanGiaiCamera());
                        dto.setRam(dienThoai.getRam());
                        dto.setRom(dienThoai.getRom());
                        dto.setDungLuongPin(String.valueOf(dienThoai.getDungLuongPin()));
                        dto.setKichThuocMan(dienThoai.getKichThuocMan());
                    });
                }
                result.add(dto);
            }

            System.out.println("Returning " + result.size() + " products");
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error fetching products: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POST: Thêm sản phẩm mới
    @PostMapping("/products")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<String> addProduct(@RequestBody ProductDTO productDTO) {
        try {
            Product product = new Product();
            product.setMaSanPham(productDTO.getMaSanPham());
            product.setTenSanPham(productDTO.getTenSanPham());
            product.setGia(Objects.isNull(productDTO.getGia()) || "N/A".equals(String.valueOf(productDTO.getGia()))
                    ? 0.0
                    : productDTO.getGia());
            product.setSoLuongCoTheNhap(productDTO.getSoLuongCoTheNhap());
            product.setLoaiSanPham(productDTO.getLoaiSanPham());
            product.setXuatXu(productDTO.getXuatXu());
            product.setTrangThai(productDTO.getTrangThai() != null ? productDTO.getTrangThai() : 1);

            productService.save(product);

            if ("MAYTINH".equals(productDTO.getLoaiSanPham())) {
                MayTinh mayTinh = new MayTinh();
                mayTinh.setMaSanPham(productDTO.getMaSanPham());
                mayTinh.setTencpu(productDTO.getTenCpu());
                mayTinh.setRam(productDTO.getRam());
                mayTinh.setRom(productDTO.getRom());
                mayTinh.setCongSuatNguon(productDTO.getCongSuatNguon());
                mayTinh.setDungLuongPin(productDTO.getDungLuongPin());
                mayTinh.setKichThuocMan(productDTO.getKichThuocMan());
                mayTinh.setMaBoard(productDTO.getMaBoard());
                mayTinhRepository.save(mayTinh);
            } else if ("DIENTHOAI".equals(productDTO.getLoaiSanPham())) {
                DienThoai dienThoai = new DienThoai();
                dienThoai.setMaSanPham(productDTO.getMaSanPham());
                dienThoai.setHeDieuHanh(productDTO.getHeDieuHanh());
                dienThoai.setDoPhanGiaiCamera(productDTO.getDoPhanGiaiCamera());
                dienThoai.setRam(productDTO.getRam());
                dienThoai.setRom(productDTO.getRom());
                dienThoai.setDungLuongPin(
                        productDTO.getDungLuongPin() != null ? Integer.parseInt(productDTO.getDungLuongPin()) : 0);
                dienThoai.setKichThuocMan(productDTO.getKichThuocMan());
                dienThoaiRepository.save(dienThoai);
            }

            return new ResponseEntity<>("Thêm sản phẩm thành công!", HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("Error adding product: " + e.getMessage());
            return new ResponseEntity<>("Lỗi khi thêm sản phẩm: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT: Sửa sản phẩm
    @PutMapping("/products/{maSanPham}")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<String> updateProduct(
            @PathVariable String maSanPham,
            @RequestBody ProductDTO productDTO) {
        try {
            Product existingProduct = productService.findByMaSanPham(maSanPham);
            if (existingProduct == null) {
                return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
            }

            existingProduct.setTenSanPham(productDTO.getTenSanPham());
            existingProduct
                    .setGia(Objects.isNull(productDTO.getGia()) || "N/A".equals(String.valueOf(productDTO.getGia()))
                            ? 0.0
                            : productDTO.getGia());
            existingProduct.setSoLuongCoTheNhap(productDTO.getSoLuongCoTheNhap());
            existingProduct.setLoaiSanPham(productDTO.getLoaiSanPham());
            existingProduct.setXuatXu(productDTO.getXuatXu());
            productService.save(existingProduct);

            if ("MAYTINH".equals(productDTO.getLoaiSanPham())) {
                Optional<MayTinh> mayTinhOpt = mayTinhRepository.findByMaSanPham(maSanPham);
                if (mayTinhOpt.isPresent()) {
                    MayTinh mayTinh = mayTinhOpt.get();
                    mayTinh.setTencpu(productDTO.getTenCpu());
                    mayTinh.setRam(productDTO.getRam());
                    mayTinh.setRom(productDTO.getRom());
                    mayTinh.setCongSuatNguon(productDTO.getCongSuatNguon());
                    mayTinh.setDungLuongPin(productDTO.getDungLuongPin());
                    mayTinh.setKichThuocMan(productDTO.getKichThuocMan());
                    mayTinh.setMaBoard(productDTO.getMaBoard());
                    mayTinhRepository.save(mayTinh);
                }
            } else if ("DIENTHOAI".equals(productDTO.getLoaiSanPham())) {
                Optional<DienThoai> dienThoaiOpt = dienThoaiRepository.findByMaSanPham(maSanPham);
                if (dienThoaiOpt.isPresent()) {
                    DienThoai dienThoai = dienThoaiOpt.get();
                    dienThoai.setHeDieuHanh(productDTO.getHeDieuHanh());
                    dienThoai.setDoPhanGiaiCamera(productDTO.getDoPhanGiaiCamera());
                    dienThoai.setRam(productDTO.getRam());
                    dienThoai.setRom(productDTO.getRom());
                    dienThoai.setDungLuongPin(
                            productDTO.getDungLuongPin() != null ? Integer.parseInt(productDTO.getDungLuongPin()) : 0);
                    dienThoai.setKichThuocMan(productDTO.getKichThuocMan());
                    dienThoaiRepository.save(dienThoai);
                }
            }

            return new ResponseEntity<>("Sửa sản phẩm thành công!", HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error updating product: " + e.getMessage());
            return new ResponseEntity<>("Lỗi khi sửa sản phẩm: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE: Xóa sản phẩm (Soft Delete)
    @DeleteMapping("/products/{maSanPham}")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager')")
    @Transactional
    public ResponseEntity<String> deleteProduct(@PathVariable String maSanPham) {
        try {
            productService.deleteByMaSanPham(maSanPham);
            return new ResponseEntity<>("Xóa sản phẩm thành công!", HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error deleting product: " + e.getMessage());
            return new ResponseEntity<>("Lỗi khi xóa sản phẩm: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}