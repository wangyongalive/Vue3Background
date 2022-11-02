import request from "@/axios.js";

export function getNotice(id) {
  return request.get(`/admin/notice/${id}`);
}

export function createNotice(data) {
  console.log(data);
  return request.post(`/admin/notice`, data);
}

export function updateNotice(id, data) {
  return request.post(`/admin/notice/${id}`, data);
}

export function deleteNotice(id) {
  return request.post(`/admin/notice/${id}/delete`);
}
