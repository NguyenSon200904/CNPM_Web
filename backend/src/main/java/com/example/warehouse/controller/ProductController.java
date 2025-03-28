package com.example.warehouse.controller;

import com.example.warehouse.entity.SanPham;
import com.example.warehouse.entity.MayTinh;
import com.example.warehouse.entity.DienThoai;
import com.example.warehouse.repository.SanPhamRepository;
import com.example.warehouse.repository.MayTinhRepository;
import com.example.warehouse.repository.DienThoaiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private MayTinhRepository mayTinhRepository;

    @Autowired
    private DienThoaiRepository dienThoaiRepository;

    // GET: Lấy danh sách sản phẩm
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts(
            @RequestParam(value = "loaiSanPham", required = false) String loaiSanPham) {
        List<Map<String, Object>> result = new ArrayList<>();

        // Nếu không có loaiSanPham hoặc loaiSanPham là "TẤT_CẢ", lấy tất cả sản phẩm
        if (loaiSanPham == null || loaiSanPham.equals("TẤT_CẢ")) {
            // Lấy tất cả sản phẩm từ bảng sanpham
            List<SanPham> allSanPhams = sanPhamRepository.findAll();
            System.out.println("Found " + allSanPhams.size() + " products (all types)");

            for (SanPham sanPham : allSanPhams) {
                if (sanPham.getLoaiSanPham().equals("Computer")) {
                    mayTinhRepository.findByMaSanPham(sanPham.getMaSanPham()).ifPresent(mayTinh -> {
                        System.out.println("Found MayTinh for maSanPham: " + sanPham.getMaSanPham());
                        Map<String, Object> product = Map.of(
                                "maSanPham", sanPham.getMaSanPham(),
                                "tenSanPham", sanPham.getTenSanPham(),
                                "gia", sanPham.getGia(),
                                "soLuong", sanPham.getSoLuong(),
                                "loaiSanPham", sanPham.getLoaiSanPham(),
                                "tenCpu", mayTinh.getTencpu(),
                                "ram", mayTinh.getRam(),
                                "rom", mayTinh.getRom());
                        result.add(product);
                    });
                } else if (sanPham.getLoaiSanPham().equals("Phone")) {
                    dienThoaiRepository.findByMaSanPham(sanPham.getMaSanPham()).ifPresent(dienThoai -> {
                        System.out.println("Found DienThoai for maSanPham: " + sanPham.getMaSanPham());
                        Map<String, Object> product = Map.of(
                                "maSanPham", sanPham.getMaSanPham(),
                                "tenSanPham", sanPham.getTenSanPham(),
                                "gia", sanPham.getGia(),
                                "soLuong", sanPham.getSoLuong(),
                                "loaiSanPham", sanPham.getLoaiSanPham(),
                                "heDieuHanh", dienThoai.getHeDieuHanh(),
                                "doPhanGiaiCamera", dienThoai.getDoPhanGiaiCamera(),
                                "ram", dienThoai.getRam(),
                                "rom", dienThoai.getRom());
                        result.add(product);
                    });
                }
            }
        } else {
            // Xử lý như trước cho MAY_TINH và DIEN_THOAI
            String loaiSanPhamDb = loaiSanPham.equals("MAY_TINH") ? "Computer" : "Phone";
            System.out.println("loaiSanPham: " + loaiSanPham + ", loaiSanPhamDb: " + loaiSanPhamDb);

            List<SanPham> sanPhams = sanPhamRepository.findByLoaiSanPham(loaiSanPhamDb);
            System.out.println("Found " + sanPhams.size() + " products with loai_san_pham = " + loaiSanPhamDb);

            if (loaiSanPham.equals("MAY_TINH")) {
                sanPhams.forEach(sanPham -> {
                    mayTinhRepository.findByMaSanPham(sanPham.getMaSanPham()).ifPresent(mayTinh -> {
                        System.out.println("Found MayTinh for maSanPham: " + sanPham.getMaSanPham());
                        Map<String, Object> product = Map.of(
                                "maSanPham", sanPham.getMaSanPham(),
                                "tenSanPham", sanPham.getTenSanPham(),
                                "gia", sanPham.getGia(),
                                "soLuong", sanPham.getSoLuong(),
                                "loaiSanPham", sanPham.getLoaiSanPham(),
                                "tenCpu", mayTinh.getTencpu(),
                                "ram", mayTinh.getRam(),
                                "rom", mayTinh.getRom());
                        result.add(product);
                    });
                });
            } else if (loaiSanPham.equals("DIEN_THOAI")) {
                sanPhams.forEach(sanPham -> {
                    dienThoaiRepository.findByMaSanPham(sanPham.getMaSanPham()).ifPresent(dienThoai -> {
                        System.out.println("Found DienThoai for maSanPham: " + sanPham.getMaSanPham());
                        Map<String, Object> product = Map.of(
                                "maSanPham", sanPham.getMaSanPham(),
                                "tenSanPham", sanPham.getTenSanPham(),
                                "gia", sanPham.getGia(),
                                "soLuong", sanPham.getSoLuong(),
                                "loaiSanPham", sanPham.getLoaiSanPham(),
                                "heDieuHanh", dienThoai.getHeDieuHanh(),
                                "doPhanGiaiCamera", dienThoai.getDoPhanGiaiCamera(),
                                "ram", dienThoai.getRam(),
                                "rom", dienThoai.getRom());
                        result.add(product);
                    });
                });
            }
        }

        System.out.println("Returning " + result.size() + " products");
        return result;
    }

    // Các phương thức khác (POST, PUT, DELETE) giữ nguyên
    // ...
}