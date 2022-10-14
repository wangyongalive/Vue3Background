import request from "@/axios.js";

export function login(username, password) {
  return request.post("/admin/login", {
    username,
    password,
  });
}

export function getInfo() {
  return request.post("/admin/getinfo");
}

export function logout() {
  return request.post("/admin/logout1");
}
