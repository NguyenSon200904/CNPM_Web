import React, { useEffect, useState } from "react";
import { fetchData } from "./api";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData("products") // Gọi API /products từ backend
      .then((result) => setData(result))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      {data ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}

export default App;
