import axios from "axios";

const API_BASE = "http://localhost:3000";

export async function fetchProducts() {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
}
