import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { logout, updatepassword } from "@/api/manager.js";
import { showModal, toast } from "@/composables/util.js";

// 抽离的代码要引入对应的库
// useRouter useStore 不能在外面引用
export function useRepassword() {
  const router = useRouter();
  const store = useStore();
  // 修改密码
  const formDrawerRef = ref(null);

  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const rules = {
    oldpassword: [
      {
        required: true,
        message: "旧密码不能为空",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "新密码不能为空",
        trigger: "blur",
      },
    ],
    repassword: [
      {
        required: true,
        message: "确认密码不能为空",
        trigger: "blur",
      },
    ],
  };

  const formRef = ref(null);
  const onSubmit = () => {
    formRef.value.validate((valid, fields) => {
      if (!valid) {
        return false;
      }
      // loading.value = true
      formDrawerRef.value.showLoading();
      updatepassword(form)
        .then((res) => {
          toast("修改密码成功，请重新登陆");
          store.dispatch("logout");

          // 跳转登陆页
          router.push("/login");
        })
        .catch((err) => console.log(`修改密码  ${err}`)) // 捕获错误
        .finally(() => {
          // loading.value = false
          formDrawerRef.value.hideLoading();
        });
    });
  };
  const openRePasswordForm = () => formDrawerRef.value.open();
  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm,
  };
}

export function useLogout() {
  const router = useRouter();
  const store = useStore();
  function handleLogout() {
    showModal("是否退出登陆?")
      .then((res) => {
        // console.log('showModal',res)
        // 无论失败还是成功 都退出登陆
        logout()
          .finally(() => {
            console.log("finally logout");

            // 移除cookie里面的token
            // 清除用户当前的状态vuex
            store.dispatch("logout");

            // 跳转登陆页
            router.push("/login");
            // 提示退出登陆成功
            toast("退出登陆成功");
          })
          .catch((err) => {
            console.log("logout", err);
          });
      })
      .catch(() => {
        console.log("选择了取消！！！");
      });
  }
  return {
    handleLogout,
  };
}
