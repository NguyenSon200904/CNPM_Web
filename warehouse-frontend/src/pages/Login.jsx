import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Modal } from "antd";
import axios from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();

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
        username: values.username,
        password: values.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      message.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
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

  const handleForgotPassword = async (values) => {
    setForgotPasswordLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/forgot-password",
        {
          username: values.username,
        }
      );

      message.success(
        response.data.message ||
          "Yêu cầu reset mật khẩu đã được gửi! Vui lòng kiểm tra email."
      );
      console.log("Reset token (for testing):", response.data.resetToken);
      setForgotPasswordModalVisible(false);
      forgotPasswordForm.resetFields();
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response) {
        message.error(
          "Lỗi: " +
            (error.response.data.error ||
              "Không tìm thấy tài khoản với tên đăng nhập này!")
        );
      } else {
        message.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setForgotPasswordLoading(false);
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
          <h2 className="text-4xl font-bold">LOGIN</h2>
        </div>
      </div>

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
              <label className="block text-gray-300 mb-1">Username</label>
              <Input
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-green-500 focus:bg-gray-700 transition-colors duration-200 custom-input"
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <div>
              <label className="block text-gray-300 mb-1">Password</label>
              <Input.Password
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-green-500 focus:bg-gray-700 transition-colors duration-200 custom-input custom-password-input"
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
            <a
              href="#"
              className="text-gray-300 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setForgotPasswordModalVisible(true);
              }}
            >
              Quên mật khẩu?
            </a>
          </div>
        </Form>
      </div>

      <Modal
        title="Quên mật khẩu"
        open={forgotPasswordModalVisible}
        onCancel={() => {
          setForgotPasswordModalVisible(false);
          forgotPasswordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={forgotPasswordForm}
          onFinish={handleForgotPassword}
          className="w-full"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <div>
              <label className="block text-gray-700 mb-1">Tên đăng nhập</label>
              <Input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              loading={forgotPasswordLoading}
            >
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .custom-input {
          background-color: #1f2937 !important; /* gray-800 */
          color: #ffffff !important; /* white */
          border: 1px solid #4b5563 !important; /* gray-600 */
          border-radius: 6px !important;
        }
        .custom-input:hover {
          background-color: #ffffff !important; /* white */
        }
        .custom-input:focus {
          background-color: #374151 !important; /* gray-700 */
          border-color: #10b981 !important; /* green-500 */
        }
        .custom-input::placeholder {
          color: #ffffff !important; /* white */
        }
        .custom-input:hover::placeholder {
          color: #000000 !important; /* black */
        }

        .custom-password-input .ant-input-affix-wrapper {
          background-color: #1f2937 !important; /* gray-800 */
          border: 1px solid #4b5563 !important; /* gray-600 */
          border-radius: 6px !important;
        }
        .custom-password-input .ant-input-affix-wrapper:hover {
          background-color: #ffffff !important; /* white */
        }
        .custom-password-input .ant-input-affix-wrapper:focus-within {
          background-color: #374151 !important; /* gray-700 */
          border-color: #10b981 !important; /* green-500 */
        }
        .custom-password-input .ant-input {
          background-color: transparent !important; /* Make input background transparent to match wrapper */
          color: #ffffff !important; /* white */
          border: none !important; /* Remove inner input border */
        }
        .custom-password-input .ant-input:hover {
          background-color: transparent !important; /* Keep transparent on hover */
        }
        .custom-password-input .ant-input:focus {
          background-color: transparent !important; /* Keep transparent on focus */
        }
        .custom-password-input .ant-input::placeholder {
          color: #ffffff !important; /* white */
        }
        .custom-password-input .ant-input:hover::placeholder {
          color: #000000 !important; /* black */
        }
        .custom-password-input .ant-input-password-icon {
          color: #ffffff !important; /* white */
        }
        .custom-password-input .ant-input-password-icon:hover {
          color: #10b981 !important; /* green-500 */
        }
        .custom-password-input .ant-input-suffix {
          background: transparent !important; /* Remove the line by making suffix background transparent */
        }
        .custom-password-input .ant-input-affix-wrapper {
          padding-right: 12px !important; /* Adjust padding to align icon properly */
        }
      `}</style>
    </div>
  );
};

export default Login;
