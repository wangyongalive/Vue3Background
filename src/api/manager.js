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
  let q = [];
  for (const key in query) {
    if (query[key] != null) {
      q.push(`${key}=${query[key]}`);
    }
  }
  q = q.join("&");
  return request.get(`/admin/manager/${page}?${q}`);
}

// 修改管理员状态
export function updateManagerStatus(id, status) {
  return request.post(`/admin/manager/${id}/update_status`, {
    status,
  });
}

// 新增管理员
export function createManager(data) {
  return request.post(`/admin/manager`, data);
}

// 更新管理员
export function updateManager(id, data) {
  return request.post(`/admin/manager/${id}`, data);
}

// 删除管理员
export function deleteManager(id) {
  return request.post(`/admin/manager/${id}/delete`);
}
