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

        <!-- 抽屉组件 -->
        <!-- <el-drawer v-model="showDrawer" title="修改密码" size="45%" :close-on-click-modal="false">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" size="small">
                <el-form-item prop="oldpassword" label="旧密码">
                    <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="新密码">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password>
                    </el-input>
                </el-form-item>
                <el-form-item prop="repassword" label="确认密码">
                    <el-input v-model="form.repassword" type="password" placeholder="请输入确认密码" show-password>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="loading">确定
                    </el-button>
                </el-form-item>
            </el-form>
        </el-drawer> -->
        <!-- loading状态下无法点击 -->

        <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" size="small">
                <el-form-item prop="oldpassword" label="旧密码">
                    <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="新密码">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password>
                    </el-input>
                </el-form-item>
                <el-form-item prop="repassword" label="确认密码">
                    <el-input v-model="form.repassword" type="password" placeholder="请输入确认密码" show-password>
                    </el-input>
                </el-form-item>
            </el-form>
        </form-drawer>
    </div>
</template>

<script setup>
import { useFullscreen } from "@vueuse/core";
import FormDrawer from '@/components/FormDrawer.vue'
import { useRepassword, useLogout } from "@/composables/useManager.js";


const { isFullscreen, toggle } = useFullscreen();
const { formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm } = useRepassword()
const { handleLogout } = useLogout()


function handleCommand(c) {
    switch (c) {
        case "logout":
            handleLogout();
            break;
        case "rePassword":
            // showDrawer.value = true;
            // formDrawerRef.value.open()
            openRePasswordForm()
            break;
    }
}

// 刷新
// const handleRefresh = () => {
//     location.reload()
// }

// 刷新的简写
const handleRefresh = () => location.reload();
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
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-600;
}

.f-header .dropdown {
    @apply mx-5;
    cursor: pointer;
}

.f-header .dropdown>span {
    @apply flex items-center text-light-50;
}
</style>