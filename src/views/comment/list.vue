<template>
    <el-card shadow="always" class="y-table">
        <search @search="getData(1)" @reset="restSearchForm">
            <!-- 默认插槽 -->
            <search-item label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
            </search-item>
        </search>

        <div class="container">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" height="100%">
                <el-table-column label="管理员" width="200" align="center">
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
                <el-table-column label="所属管理员" align="center">
                    <template #default="{ row }">
                        {{ row.role?.name || '-' }}
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
                            <el-popconfirm title="是否删除该管理员?" confirm-button-text="确认" cancel-button-text="取消"
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
        </div>
    </el-card>
</template>
  
<script setup>
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { useInitTable } from "@/composables/useCommon";
import {
    getGoodsCommentList,
    updateGoodsCommentStatus,
} from "~/api/goods_comment"



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
        title: ""
    },
    getList: getGoodsCommentList,
    onGetListSuccess: (res) => {
        total.value = res.totalCount;
        tableData.value = res.list.map((o) => {
            o.statusLoading = false; // switch 默认没有动画
            return o;
        });
    },
    updateStatus: updateGoodsCommentStatus
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