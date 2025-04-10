import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", {
          key: "session-expired",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user.role;

  // Quyền truy cập của Importer
  const importerAllowedPaths = [
    "/",
    "/san-pham",
    "/nha-cung-cap",
    "/nhap-hang",
    "/phieu-nhap",
  ];

  // Quyền truy cập của Exporter
  const exporterAllowedPaths = [
    "/",
    "/san-pham",
    "/nha-cung-cap",
    "/xuat-hang",
    "/phieu-xuat",
  ];

  // Các trang chỉ dành cho Admin và Manager
  const _adminManagerOnlyPaths = [
    "/tai-khoan",
    "/ton-kho",
    "/thong-ke",
    "/doi-thong-tin",
  ];

  // Kiểm tra quyền truy cập
  if (role === "Importer") {
    // Nếu Importer truy cập trang không được phép
    if (!importerAllowedPaths.includes(location.pathname)) {
      message.error("Bạn không có quyền truy cập trang này!", {
        key: "access-denied",
      });
      return <Navigate to="/" replace />;
    }
  } else if (role === "Exporter") {
    // Nếu Exporter truy cập trang không được phép
    if (!exporterAllowedPaths.includes(location.pathname)) {
      message.error("Bạn không có quyền truy cập trang này!", {
        key: "access-denied",
      });
      return <Navigate to="/" replace />;
    }
  } else if (role === "Admin" || role === "Manager") {
    // Admin và Manager có thể truy cập tất cả các trang
    // Không cần kiểm tra thêm
  } else {
    // Vai trò không xác định, chuyển hướng về trang đăng nhập
    message.error("Vai trò không hợp lệ!", {
      key: "invalid-role",
    });
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
