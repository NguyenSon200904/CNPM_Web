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
    public List<Map<String, Object>> getProducts(@RequestParam("loaiSanPham") String loaiSanPham) {
        List<Map<String, Object>> result = new ArrayList<>();

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

        System.out.println("Returning " + result.size() + " products");
        return result;
    }

    // POST: Thêm sản phẩm mới
    @PostMapping("/products")
    public SanPham addProduct(@RequestBody Map<String, Object> productData) {
        // Lưu vào bảng sanpham
        SanPham sanPham = new SanPham();
        sanPham.setMaSanPham((String) productData.get("maSanPham"));
        sanPham.setTenSanPham((String) productData.get("tenSanPham"));
        sanPham.setGia(Double.parseDouble(productData.get("gia").toString()));
        sanPham.setSoLuong(Integer.parseInt(productData.get("soLuong").toString()));
        sanPham.setLoaiSanPham((String) productData.get("loaiSanPham"));
        sanPham.setTrangThai(1); // Mặc định trạng thái là 1 (hoạt động)
        sanPham.setXuatXu("Unknown"); // Mặc định xuất xứ
        sanPhamRepository.save(sanPham);

        // Lưu vào bảng maytinh hoặc dienthoai
        if (sanPham.getLoaiSanPham().equals("Computer")) {
            MayTinh mayTinh = new MayTinh();
            mayTinh.setMaSanPham(sanPham.getMaSanPham());
            mayTinh.setTencpu((String) productData.get("tenCpu"));
            mayTinh.setRam((String) productData.get("ram"));
            mayTinh.setRom((String) productData.get("rom"));
            mayTinh.setCongSuatNguon(0); // Mặc định
            mayTinh.setKichThuocMan(0.0); // Mặc định
            mayTinh.setDungLuongPin("N/A"); // Mặc định
            mayTinh.setLoaiMay("N/A"); // Mặc định
            mayTinh.setMaBoard("N/A"); // Mặc định
            mayTinhRepository.save(mayTinh);
        } else if (sanPham.getLoaiSanPham().equals("Phone")) {
            DienThoai dienThoai = new DienThoai();
            dienThoai.setMaSanPham(sanPham.getMaSanPham());
            dienThoai.setHeDieuHanh((String) productData.get("heDieuHanh"));
            dienThoai.setDoPhanGiaiCamera((String) productData.get("doPhanGiaiCamera"));
            dienThoai.setRam((String) productData.get("ram"));
            dienThoai.setRom((String) productData.get("rom"));
            dienThoai.setDungLuongPin(0); // Mặc định
            dienThoai.setKichThuocMan(0.0); // Mặc định
            dienThoai.setTenDienThoai(sanPham.getTenSanPham()); // Lấy từ sanpham
            dienThoaiRepository.save(dienThoai);
        }

        return sanPham;
    }

    // PUT: Sửa sản phẩm
    @PutMapping("/products/{maSanPham}")
    public SanPham updateProduct(@PathVariable String maSanPham, @RequestBody Map<String, Object> productData) {
        // Cập nhật bảng sanpham
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        sanPham.setTenSanPham((String) productData.get("tenSanPham"));
        sanPham.setGia(Double.parseDouble(productData.get("gia").toString()));
        sanPham.setSoLuong(Integer.parseInt(productData.get("soLuong").toString()));
        sanPhamRepository.save(sanPham);

        // Cập nhật bảng maytinh hoặc dienthoai
        if (sanPham.getLoaiSanPham().equals("Computer")) {
            MayTinh mayTinh = mayTinhRepository.findByMaSanPham(maSanPham)
                    .orElseThrow(() -> new RuntimeException("Máy tính không tồn tại"));
            mayTinh.setTencpu((String) productData.get("tenCpu"));
            mayTinh.setRam((String) productData.get("ram"));
            mayTinh.setRom((String) productData.get("rom"));
            mayTinhRepository.save(mayTinh);
        } else if (sanPham.getLoaiSanPham().equals("Phone")) {
            DienThoai dienThoai = dienThoaiRepository.findByMaSanPham(maSanPham)
                    .orElseThrow(() -> new RuntimeException("Điện thoại không tồn tại"));
            dienThoai.setHeDieuHanh((String) productData.get("heDieuHanh"));
            dienThoai.setDoPhanGiaiCamera((String) productData.get("doPhanGiaiCamera"));
            dienThoai.setRam((String) productData.get("ram"));
            dienThoai.setRom((String) productData.get("rom"));
            dienThoai.setTenDienThoai(sanPham.getTenSanPham());
            dienThoaiRepository.save(dienThoai);
        }

        return sanPham;
    }

    // DELETE: Xóa sản phẩm
    @DeleteMapping("/products/{maSanPham}")
    public void deleteProduct(@PathVariable String maSanPham) {
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // Xóa từ bảng maytinh hoặc dienthoai trước
        if (sanPham.getLoaiSanPham().equals("Computer")) {
            mayTinhRepository.deleteById(maSanPham);
        } else if (sanPham.getLoaiSanPham().equals("Phone")) {
            dienThoaiRepository.deleteById(maSanPham);
        }

        // Xóa từ bảng sanpham
        sanPhamRepository.deleteById(maSanPham);
    }
}