import { ElNotification, ElMessageBox } from "element-plus";

// 消息提示
export function toast(
  message,
  type = "success",
  dangerouslyUseHTMLString = false,
  duration = 3000
) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration,
  });
}

export function showModal(content = "提示内容", type = "warning", title = "") {
  // return 返回一个promise
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type,
  });
}
