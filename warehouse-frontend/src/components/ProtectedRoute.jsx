import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setShouldRedirect("/login");
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
          duration: 2,
        });
        setShouldRedirect("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Kiểm tra quyền truy cập và chuyển hướng
  useEffect(() => {
    if (loading || !user) return;

    const role = user.role;

    const importerAllowedPaths = [
      "/",
      "/san-pham",
      "/nha-cung-cap",
      "/nhap-hang",
      "/phieu-nhap",
    ];

    const exporterAllowedPaths = [
      "/",
      "/san-pham",
      "/nha-cung-cap",
      "/xuat-hang",
      "/phieu-xuat",
    ];

    const _adminManagerOnlyPaths = ["/tai-khoan", "/ton-kho", "/thong-ke"];

    // Cho phép tất cả vai trò truy cập trang "/doi-thong-tin"
    if (location.pathname === "/doi-thong-tin") {
      return;
    }

    if (role === "Importer") {
      if (!importerAllowedPaths.includes(location.pathname)) {
        message.error("Bạn không có quyền truy cập trang này!", {
          key: "access-denied",
          duration: 2,
        });
        setShouldRedirect("/");
      }
    } else if (role === "Exporter") {
      if (!exporterAllowedPaths.includes(location.pathname)) {
        message.error("Bạn không có quyền truy cập trang này!", {
          key: "access-denied",
          duration: 2,
        });
        setShouldRedirect("/");
      }
    } else if (role === "Admin" || role === "Manager") {
      // Admin và Manager có thể truy cập tất cả các trang
    } else {
      message.error("Vai trò không hợp lệ!", {
        key: "invalid-role",
        duration: 2,
      });
      setShouldRedirect("/login");
    }
  }, [user, loading, location.pathname]);

  // Xử lý chuyển hướng
  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        console.log(
          "Destroying all messages before redirect to:",
          shouldRedirect
        );
        message.destroy();
        navigate(shouldRedirect, { replace: true });
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, navigate]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (shouldRedirect) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
