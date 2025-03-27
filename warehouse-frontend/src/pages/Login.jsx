import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Kiểm tra nếu đã đăng nhập, chuyển hướng về "/"
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        userName: values.username,
        password: values.password,
      });

      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token);

      // Lưu thông tin người dùng (nếu cần)
      localStorage.setItem("user", JSON.stringify(response.data.user));

      message.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // Log chi tiết lỗi
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
        message.error(
          "Đăng nhập thất bại: " +
            (error.response.data.error ||
              "Tên đăng nhập hoặc mật khẩu không đúng")
        );
      } else if (error.request) {
        console.log("Request:", error.request);
        message.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra backend!"
        );
      } else {
        console.log("Error message:", error.message);
        message.error("Đã có lỗi xảy ra: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex w-screen h-screen">
      {/* Phần bên trái */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-green-500 text-white">
        <div className="flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
            alt="User Icon"
            className="w-28 h-28 mb-4"
          />
          <h2 className="text-4xl font-bold">LOGIN</h2>
        </div>
      </div>

      {/* Phần bên phải */}
      <div className="w-1/2 flex items-center justify-center bg-gray-900">
        <Form
          form={form}
          onFinish={handleSubmit}
          className="text-white w-96 p-8"
        >
          <h2 className="text-3xl font-semibold text-center mb-6">Đăng nhập</h2>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <div>
              <label className="block text-gray-300">Username</label>
              <Input
                className="w-full px-4 py-2 border-b bg-gray-900 border-gray-400 text-white focus:outline-none"
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <div>
              <label className="block text-gray-300">Password</label>
              <Input.Password
                className="w-full px-4 py-2 border-b bg-gray-900 border-gray-400 text-white focus:outline-none"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <a href="#" className="text-gray-300 hover:underline">
              Quên mật khẩu ?
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
