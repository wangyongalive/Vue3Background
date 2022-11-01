import request from "@/axios.js";

export function getImageList(id, page) {
  return request.get(`/admin/image_class/${id}/image/${page}`);
}

export function updateImage(id, name) {
  return request.post(`/admin/image/${id}`, { name });
}

export function deleteImage(ids) {
  return request.post(`/admin/image/delete_all`, { ids });
}
