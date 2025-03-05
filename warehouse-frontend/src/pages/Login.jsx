import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login with:", { username, password });
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
        <form onSubmit={handleSubmit} className="text-white w-96 p-8">
          <h2 className="text-3xl font-semibold text-center mb-6">Đăng nhập</h2>

          <div className="mb-4">
            <label className="block text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border-b bg-gray-900 border-gray-400 text-white focus:outline-none"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-b bg-gray-900 border-gray-400 text-white focus:outline-none"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Đăng nhập
          </button>

          <div className="text-center mt-4">
            <a href="#" className="text-gray-300 hover:underline">
              Quên mật khẩu ?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
