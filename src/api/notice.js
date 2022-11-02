import request from "@/axios.js";

export function getNotice(id) {
  return request.get(`/admin/notice/${id}`);
}
