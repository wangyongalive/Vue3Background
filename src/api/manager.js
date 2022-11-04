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
  return request.post("/admin/logout");
}

export function updatepassword(data) {
  return request.post("/admin/updatepassword", data);
}

export function getManagerList(
  page,
  query = {
    limit: 10,
    keyword: "ceshi",
  }
) {
  console.log(page, query);
  let q = [];
  for (const key in query) {
    if (query[key] != null) {
      q.push(`${key}=${query[key]}`);
    }
  }
  q = q.join("&");
  return request.get(`/admin/manager/${page}?${q}`);
}
