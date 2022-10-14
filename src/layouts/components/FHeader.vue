<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1">
                <ElemeFilled />
            </el-icon>
            xx管理系统
        </span>
        <el-icon class="icon-btn">
            <Fold />
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <!-- margin-left: auto; 右居中 -->
        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="handleCommand">
                <span>
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{$store.state.user.username}}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>

import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useFullscreen } from '@vueuse/core'
import { showModal, toast } from "@/composables/util.js";
import { logout } from "@/api/manager.js";


const { isFullscreen, toggle } = useFullscreen()


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
                    // 清楚用户当前的状态vuex
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

function handleCommand(c) {
    switch (c) {
        case 'logout':
            handleLogout();
            break;
        case 'rePassword':

            break;
    }
}

// 刷新
// const handleRefresh = () => {
//     location.reload()
// }

// 简写
const handleRefresh = () => location.reload()





</script>

<style scoped>
.f-header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
    height: 64px;
}

.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
    width: 42px;
    height: 64px;
    cursor: pointer
}

.icon-btn:hover {
    @apply bg-indigo-600
}

.f-header .dropdown {
    @apply mx-5;
    cursor: pointer;
}

.f-header .dropdown>span {
    @apply flex items-center text-light-50;
}
</style>