import request from "@/axios.js";

export function getImageClassList(page) {
  return request.get("/admin/image_class/" + page);
}

// image_class/ 后面没有/
export function createImageClass(data) {
  return request.post("/admin/image_class", data);
}

export function updateImageClass(id, data) {
  return request.post("/admin/image_class/" + id, data);
}
