<template>
  <div>
    <!-- 格式化 -->
    <pre>
      {{ $store.state.user.username }}
    </pre>

    <el-button @click="handleLogout">退出登陆</el-button>
  </div>
</template>
<script setup>
import { showModal, toast } from '@/composables/util.js'
import { logout } from '@/api/manager.js'
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter()
const store = useStore()
function handleLogout() {
  showModal("是否退出登陆?").then((res) => {
    // console.log('showModal',res)
    // 无论失败还是成功 都退出登陆
    logout()
      .then((res2) => {
        console.log('logout ',res2)

        // 移除cookie里面的token
        // 清楚用户当前的状态vuex
        store.dispatch('logout')

        // 跳转登陆页
        router.push('/login')
        // 提示退出登陆成功
        toast("退出登陆成功")
      })
      .catch(err => {
        console.log('logout', err)
      })

  }).catch(() => {
    console.log('取消');
  })
}

</script>
