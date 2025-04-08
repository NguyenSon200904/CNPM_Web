package com.example.warehouse.controller;

import com.example.warehouse.dto.ProductDTO;
import com.example.warehouse.entity.SanPham;
import com.example.warehouse.entity.MayTinh;
import com.example.warehouse.entity.DienThoai;
import com.example.warehouse.repository.SanPhamRepository;
import com.example.warehouse.repository.MayTinhRepository;
import com.example.warehouse.repository.DienThoaiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional; // Thêm import này
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
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private MayTinhRepository mayTinhRepository;

    @Autowired
    private DienThoaiRepository dienThoaiRepository;

    // GET: Lấy danh sách sản phẩm
    @GetMapping("/products")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager', 'ROLE_Nhân viên nhập kho', 'ROLE_Nhân viên xuất kho')")
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(value = "loaiSanPham", required = false) String loaiSanPham) {
        try {
            List<ProductDTO> result = new ArrayList<>();

            if (loaiSanPham == null || loaiSanPham.equals("TẤT_CẢ")) {
                List<SanPham> allSanPhams = sanPhamRepository.findAll();
                System.out.println("Found " + allSanPhams.size() + " products (all types)");

                for (SanPham sanPham : allSanPhams) {
                    ProductDTO dto = new ProductDTO();
                    dto.setMaSanPham(sanPham.getMaSanPham());
                    dto.setTenSanPham(sanPham.getTenSanPham());
                    dto.setGia(sanPham.getGia());
                    dto.setSoLuongCoTheNhap(sanPham.getSoLuongCoTheNhap());
                    dto.setLoaiSanPham(sanPham.getLoaiSanPham());
                    dto.setXuatXu(sanPham.getXuatXu());
                    try {
                        dto.setTrangThai(sanPham.getTrangThai());
                    } catch (NumberFormatException e) {
                        dto.setTrangThai(null);
                    }

                    if (sanPham.getLoaiSanPham().equals("Computer")) {
                        mayTinhRepository.findByMaSanPham(sanPham.getMaSanPham()).ifPresent(mayTinh -> {
                            System.out.println("Found MayTinh for maSanPham: " + sanPham.getMaSanPham());
                            dto.setTenCpu(mayTinh.getTencpu());
                            dto.setRam(mayTinh.getRam());
                            dto.setRom(mayTinh.getRom());
                            dto.setCongSuatNguon(mayTinh.getCongSuatNguon());
                            dto.setDungLuongPin(mayTinh.getDungLuongPin());
                            dto.setKichThuocMan(mayTinh.getKichThuocMan());
                            dto.setMaBoard(mayTinh.getMaBoard());
                        });
                    } else if (sanPham.getLoaiSanPham().equals("Phone")) {
                        dienThoaiRepository.findByMaSanPham(sanPham.getMaSanPham()).ifPresent(dienThoai -> {
                            System.out.println("Found DienThoai for maSanPham: " + sanPham.getMaSanPham());
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
            } else {
                String loaiSanPhamDb = loaiSanPham.equals("MAY_TINH") ? "Computer" : "Phone";
                System.out.println("loaiSanPham: " + loaiSanPham + ", loaiSanPhamDb: " + loaiSanPhamDb);

                List<SanPham> sanPhams = sanPhamRepository.findByLoaiSanPham(loaiSanPhamDb);
                System.out.println("Found " + sanPhams.size() + " products with loai_san_pham = " + loaiSanPhamDb);

                for (SanPham sanPham : sanPhams) {
                    ProductDTO dto = new ProductDTO();
                    dto.setMaSanPham(sanPham.getMaSanPham());
                    dto.setTenSanPham(sanPham.getTenSanPham());
                    dto.setGia(sanPham.getGia());
                    dto.setSoLuongCoTheNhap(sanPham.getSoLuongCoTheNhap());
                    dto.setLoaiSanPham(sanPham.getLoaiSanPham());
                    dto.setXuatXu(sanPham.getXuatXu());
                    try {
                        dto.setTrangThai(sanPham.getTrangThai());
                    } catch (NumberFormatException e) {
                        dto.setTrangThai(null);
                    }

                    if (loaiSanPham.equals("MAY_TINH")) {
                        mayTinhRepository.findByMaSanPham(sanPham.getMaSanPham()).ifPresent(mayTinh -> {
                            System.out.println("Found MayTinh for maSanPham: " + sanPham.getMaSanPham());
                            dto.setTenCpu(mayTinh.getTencpu());
                            dto.setRam(mayTinh.getRam());
                            dto.setRom(mayTinh.getRom());
                            dto.setCongSuatNguon(mayTinh.getCongSuatNguon());
                            dto.setDungLuongPin(mayTinh.getDungLuongPin());
                            dto.setKichThuocMan(mayTinh.getKichThuocMan());
                            dto.setMaBoard(mayTinh.getMaBoard());
                        });
                    } else if (loaiSanPham.equals("DIEN_THOAI")) {
                        dienThoaiRepository.findByMaSanPham(sanPham.getMaSanPham()).ifPresent(dienThoai -> {
                            System.out.println("Found DienThoai for maSanPham: " + sanPham.getMaSanPham());
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
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager', 'ROLE_Nhân viên nhập kho')")
    public ResponseEntity<String> addProduct(@RequestBody ProductDTO productDTO) {
        try {
            SanPham sanPham = new SanPham();
            sanPham.setMaSanPham(productDTO.getMaSanPham());
            sanPham.setTenSanPham(productDTO.getTenSanPham());
            // Kiểm tra giá trị của gia
            try {
                sanPham.setGia(Objects.isNull(productDTO.getGia()) || "N/A".equals(String.valueOf(productDTO.getGia()))
                        ? 0.0
                        : productDTO.getGia());
            } catch (NumberFormatException e) {
                sanPham.setGia(0.0);
            }
            sanPham.setSoLuongCoTheNhap(productDTO.getSoLuongCoTheNhap());
            sanPham.setLoaiSanPham(productDTO.getLoaiSanPham());
            sanPham.setXuatXu(productDTO.getXuatXu());
            sanPham.setTrangThai(productDTO.getTrangThai() != null ? productDTO.getTrangThai() : 0);

            sanPhamRepository.save(sanPham);

            if (productDTO.getLoaiSanPham().equals("Computer")) {
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
            } else if (productDTO.getLoaiSanPham().equals("Phone")) {
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
            @PathVariable("maSanPham") String maSanPham,
            @RequestBody ProductDTO productDTO) {
        try {
            Optional<SanPham> existingSanPhamOpt = sanPhamRepository.findById(maSanPham);
            if (!existingSanPhamOpt.isPresent()) {
                return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
            }

            SanPham existingSanPham = existingSanPhamOpt.get();
            existingSanPham.setTenSanPham(productDTO.getTenSanPham());
            // Kiểm tra giá trị của gia
            try {
                existingSanPham
                        .setGia(Objects.isNull(productDTO.getGia()) || "N/A".equals(String.valueOf(productDTO.getGia()))
                                ? 0.0
                                : productDTO.getGia());
            } catch (NumberFormatException e) {
                existingSanPham.setGia(0.0);
            }
            existingSanPham.setSoLuongCoTheNhap(productDTO.getSoLuongCoTheNhap());
            existingSanPham.setLoaiSanPham(productDTO.getLoaiSanPham());
            existingSanPham.setXuatXu(productDTO.getXuatXu());
            existingSanPham.setTrangThai(productDTO.getTrangThai() != null ? productDTO.getTrangThai() : 0);
            sanPhamRepository.save(existingSanPham);

            if (productDTO.getLoaiSanPham().equals("Computer")) {
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
            } else if (productDTO.getLoaiSanPham().equals("Phone")) {
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

    // DELETE: Xóa sản phẩm
    @DeleteMapping("/products/{maSanPham}")
    @PreAuthorize("hasAnyRole('ROLE_Admin', 'ROLE_Manager')")
    @Transactional // Thêm annotation này để đảm bảo giao dịch
    public ResponseEntity<String> deleteProduct(@PathVariable("maSanPham") String maSanPham) {
        try {
            Optional<SanPham> sanPhamOpt = sanPhamRepository.findById(maSanPham);
            if (!sanPhamOpt.isPresent()) {
                return new ResponseEntity<>("Sản phẩm không tồn tại!", HttpStatus.NOT_FOUND);
            }

            SanPham sanPham = sanPhamOpt.get();
            // Xóa bản ghi trong bảng MayTinh hoặc DienThoai trước
            if (sanPham.getLoaiSanPham().equals("Computer")) {
                Optional<MayTinh> mayTinhOpt = mayTinhRepository.findByMaSanPham(maSanPham);
                mayTinhOpt.ifPresent(mayTinh -> mayTinhRepository.delete(mayTinh));
            } else if (sanPham.getLoaiSanPham().equals("Phone")) {
                Optional<DienThoai> dienThoaiOpt = dienThoaiRepository.findByMaSanPham(maSanPham);
                dienThoaiOpt.ifPresent(dienThoai -> dienThoaiRepository.delete(dienThoai));
            }

            // Sau đó xóa bản ghi trong bảng SanPham
            sanPhamRepository.delete(sanPham);

            return new ResponseEntity<>("Xóa sản phẩm thành công!", HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error deleting product: " + e.getMessage());
            return new ResponseEntity<>("Lỗi khi xóa sản phẩm: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}