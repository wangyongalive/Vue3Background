import request from "@/axios.js";

// 菜单权限列表
export function getRuleList(page) {
  return request.get(`/admin/rule/${page}`);
}

// 增加菜单权限
export function createRule(data) {
  return request.post(`/admin/rule`, data);
}

// 修改菜单权限
export function updateRule(id, data) {
  return request.post(`/admin/rule/${id}`, data);
}

// 修改菜单权限
export function deleteRule(id) {
  return request.post(`/admin/rule/${id}/delete`);
}

// 修改菜单权限
export function updateRuleStatus(id, status) {
  return request.post(`/admin/rule/${id}/update_status`, { status });
}
