import request from "@/axios.js";

export function getImageClassList(page) {
  return request.get("/admin/image_class/" + page);
}
