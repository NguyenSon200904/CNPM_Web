const API_BASE_URL = "http://localhost:8080"; // Đổi URL nếu backend chạy cổng khác

export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error("Lỗi khi gọi API");
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    return null;
  }
}

export async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi:", error);
    return null;
  }
}
