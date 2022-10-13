<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" class="login-container__left">
      <div>
        <div>
          欢迎光临
        </div>
        <div>
          此站点是《Vue3实战商城后台管理系统开发》视频课程的演示地址，
          点击立即学习
        </div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="login-container__right">
      <h2 class="login-container__right__title">欢迎回来</h2>
      <div>
        <span class="login-container__right__line"></span>
        <span class="login-container__right__text">账号密码登录</span>
        <span class="login-container__right__line"></span>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" class="w-[250px]">
        <el-form-item prop="usename">
          <el-input v-model="form.usename" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <!-- loading状态下无法点击 -->
          <el-button type="primary" color="#626aef" round @click="onSubmit" class="w-[250px]" :loading="loading">确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { toast } from "@/composables/util.js";



const router = useRouter()
const store = useStore()
const form = reactive({
  usename: "",
  password: "",
});

const rules = {
  usename: [{
    required: true,
    message: '用户名不能为空',
    trigger: 'blur'
  }],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }
  ]
}

const formRef = ref(null)
const loading = ref(false)
const onSubmit = () => {
  formRef.value.validate((valid, fields) => {
    if (!valid) {
      return false
    }
    loading.value = true
    // 将登录放到login当中
    store.dispatch('login', form).then(res => {
      console.log('logView', res)
      toast('登陆成功')
      router.push('/')
    })
      .catch((err) => { // settle.js:19 Uncaught (in promise)   promise加上catch 养成习惯
        console.log('catch loginView', err)
      })
      .finally(() => { // 无论失败或者成功都会执行
        console.log('finally ')
        loading.value = false
      })

    // login(form.usename, form.password).then(res => {

    //   // 成功
    //   // ElNotification({
    //   //   message: '登陆成功',
    //   //   type: 'success',
    //   //   duration: 3000
    //   // })
    //   toast('登陆成功')

    //   // 存储cookie
    //   // const cookie = useCookies()
    //   // cookie.set('admin-token', res.token)
    //   setToken(res.token)

    //   // 获取用户信息
    //   // 移到store中
    //   // getInfo().then(res2 => {
    //   //   store.commit('SET_USERINFO', res2)
    //   //   console.log(res2)
    //   // })


    //   // 跳转到首页
    //   router.push('/')
    // }).catch((err) => { // catch 捕获错误
    //   console.log(err)
    // })
    //   .finally(() => { // 无论失败或者成功都会执行
    //     loading.value = false
    //   })
  })
};

// 回车登录
function onKeyUp(e) {
  console.log(e)
  if (e.code == 'Enter') onSubmit()
}
onMounted(() => {
  document.addEventListener("keyup", onKeyUp)
})
onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})

</script>

<style scoped>
.login-container {
  @apply min-h-screen bg-indigo-500;
}

.login-container .login-container__left,
.login-container .login-container__right {
  @apply flex items-center justify-center;
}

.login-container .login-container__right {
  @apply flex-col bg-light-50;
}

.login-container__left>div>div:first-child {
  @apply font-bold text-light-50 text-5xl mb-4;
}

.login-container__left>div>div:last-child {
  @apply text-gray-200 font-normal;
}

.login-container__right__title {
  @apply mt-6 text-3xl font-bold text-gray-900
}

.login-container__right>div {
  @apply flex items-center justify-center mt-5 mb-8 space-x-2
}

.login-container__right__line {
  @apply h-[1px] w-16 bg-gray-200
}

.login-container__right__text {
  @apply text-gray-300 font-normal
}
</style>