import request from "@/axios.js";

export function getStatistics1() {
  return request.get("/admin/statistics1");
}
