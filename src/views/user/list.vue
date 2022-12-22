<template>
    <el-card shadow="always" class="y-table">

        <search @search="getData(1)" @reset="restSearchForm">
            <!-- 默认插槽 -->
            <search-item label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称" clearable></el-input>
            </search-item>
            <template #show>
                <SearchItem label="会员等级">
                    <el-select v-model="searchForm.user_level_id" placeholder="请选择会员等级" clearable>
                        <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </SearchItem>
            </template>
        </search>

        <!-- 新增和刷新 -->
        <header-list @create="handleCreate" @reFresh="handleReresh"></header-list>


        <div class="container">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" height="100%">
                <el-table-column label="会员" width="200" align="center">
                    <!-- 需要用到插槽 table中的prop就不需要了 -->
                    <template v-slot="scope">
                        <div class="flex items-center">
                            <el-avatar :size="40" :src="scope.row.avatar">
                                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                            </el-avatar>
                            <div class="ml-3">
                                <h6>{{ scope.row.username }}</h6>
                                <!-- <small>元素將使文本的字体变小一号 -->
                                <small>ID:{{ scope.row.id }}</small>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="会员等级" align="center">
                    <template #default="{ row }">
                        {{ row.user_level?.name || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="会员等登录注册级" align="center">
                    <template #default="{ row }">
                        <p v-if="row.last_login_time">
                            最后登录 : {{ row.last_login_time }}
                        </p>
                        <p>
                            注册时间 : {{ row.create_time }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="120">
                    <!-- 解构 -->
                    <template #default="{ row }">
                        <!-- $event可以获取默认传递的值 $event不一定代表原生事件 -->
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                            :loading="row.statusLoading" :disabled="row.super == 1"
                            @change="handleStatusChange($event, row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <small v-if="scope.row.super == 1" class="text-sm text-gray-500">暂无操作</small>
                        <div v-else>
                            <el-button type="primary" size="default" text
                                @click.stop="hanleEdit(scope.row)">修改</el-button>
                            <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="hanleDelete(scope.row.id)">
                                <template #reference>
                                    <el-button text type="primary">
                                        删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <div class="flex justify-center mt-5">
            <!-- current-page 当前页数  @current-page current-page改变时触发 -->
            <el-pagination background layout="prev, pager,next" :total="total" :page-size="limit"
                @current-change="getData" v-model:current-page="currentPage" />

            <form-drawer ref="formDrawerRef" :title="drawTitle" @submit="handleSubmit">
                <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="form.nickname" placeholder="昵称"></el-input>
                    </el-form-item>
                    <el-form-item label="头像" prop="avatar">
                        <!-- <el-input v-model="form.avatar" placeholder="头像"></el-input> -->
                        <!-- 头像组件 -->
                        <!-- 组件中的v-model -->
                        <choose-image v-model="form.avatar"></choose-image>
                    </el-form-item>
                    <el-form-item label="会员等级" prop="user_level_id">
                        <el-select v-model="form.user_level_id" placeholder="选择会员等级">
                            <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                        <el-input v-model="form.phone" placeholder="手机"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="content">
                        <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                        </el-switch>
                    </el-form-item>
                </el-form>

            </form-drawer>
        </div>
    </el-card>

</template>
  
<script setup>
import { ref } from "vue";
import FormDrawer from "../../components/FormDrawer.vue";
import ChooseImage from "@/components/ChooseImage.vue";
import HeaderList from "@/components/HeaderList.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";

import { useInitTable, useInitForm } from "@/composables/useCommon";

import {
    getUserList,
    updateUserStatus,
    createUser,
    updateUser,
    deleteUser
} from "~/api/user"


const user_level = ref([])

// 抽离 列表分页和搜索
const {
    searchForm,
    restSearchForm,
    loading,
    tableData,
    currentPage,
    total,
    limit,
    getData,
    hanleDelete,
    handleStatusChange
} = useInitTable({
    searchForm: {
        keyword: "",
        user_level_id: null
    },
    getList: getUserList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map((o) => {
            o.statusLoading = false; // switch 默认没有动画
            return o;
        });
        total.value = res.totalCount;
        user_level.value = res.user_level
    },
    updateStatus: updateUserStatus,
    delete: deleteUser
})


const {
    editId,
    drawTitle,
    formDrawerRef,
    formRef,
    form,
    rules,
    resetForm,
    handleCreate,
    hanleEdit,
    handleSubmit,
    handleReresh } = useInitForm({
        form: {
            username: "",
            password: "",
            user_level_id: null,
            status: 1,
            avatar: "",
            nickname: "",
            phone: "",
            email: ""
        },
        getData,
        update: updateUser,
        create: createUser
    })

</script>
  
<style lang="scss" scoped>
.y-table {
    height: calc(100vh - 150px);

    :deep(.el-card__body) {
        height: 100%;
    }

    :deep(.container) {
        height: calc(100% - 140px);
    }
}
</style>