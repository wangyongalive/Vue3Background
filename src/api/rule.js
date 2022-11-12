import request from "@/axios.js";

// 菜单权限列表
export function getRuleList(page) {
  return request.get(`/admin/rule/${page}`);
}
