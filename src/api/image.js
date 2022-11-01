import request from "@/axios.js";

export function getImageList(id, page) {
  return request.get("/admin/image_class/" + id + "/image/" + page);
}
