import request from "@/axios.js";

export function getRuleList(page) {
  return request.get(`/admin/rule/${page}`);
}
