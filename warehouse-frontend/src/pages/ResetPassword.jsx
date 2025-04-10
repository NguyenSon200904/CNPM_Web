import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      message.error("Token không hợp lệ! Vui lòng thử lại.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/reset-password", {
        token,
        newPassword: values.newPassword,
      });

      message.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response) {
        message.error(
          "Lỗi: " +
            (error.response.data.error || "Token không hợp lệ hoặc đã hết hạn!")
        );
      } else {
        message.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex w-screen h-screen">
      <div className="w-1/2 flex flex-col items-center justify-center bg-green-500 text-white">
        <div className="flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
            alt="User Icon"
            className="w-28 h-28 mb-4"
          />
          <h2 className="text-4xl font-bold">RESET PASSWORD</h2>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center bg-gray-900">
        <Form
          form={form}
          onFinish={handleSubmit}
          className="text-white w-96 p-8"
        >
          <h2 className="text-3xl font-semibold text-center mb-6">
            Đặt lại mật khẩu
          </h2>

          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <div>
              <label className="block text-gray-300">Mật khẩu mới</label>
              <Input.Password
                className="w-full px-4 py-2 border-b bg-gray-900 border-gray-400 text-white focus:outline-none"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <div>
              <label className="block text-gray-300">Xác nhận mật khẩu</label>
              <Input.Password
                className="w-full px-4 py-2 border-b bg-gray-900 border-gray-400 text-white focus:outline-none"
                placeholder="Xác nhận mật khẩu"
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
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
