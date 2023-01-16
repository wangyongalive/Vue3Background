<template>
    <div>
        <!-- @tab-change  activeName 改变时触发 -->
        <el-tabs v-model="searchForm.tab" @tab-change="getData(1)">
            <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabbars"
                ::key="index"></el-tab-pane>
        </el-tabs>
        <el-card shadow="never" class="y-table border-0">

            <search @search="getData(1)" @reset="restSearchForm">
                <!-- 默认插槽 -->
                <search-item label="订单编号">
                    <el-input v-model="searchForm.no" placeholder="订单编号" clearable></el-input>
                </search-item>
                <!-- 高级搜索插槽 -->
                <!-- <template #show>
                    <search-item label="商品名称">
                        <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
                            <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </search-item>
                </template> -->
            </search>

            <!-- 新增和刷新 -->
            <header-list layout="">
                <el-button type="danger" size="small" @click.stop="handleMultiDelete">批量删除</el-button>
            </header-list>

            <div class="container">
                <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
                    style="width: 100%" v-loading="loading" height="100%">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="管理员" width="300" align="center">
                        <!-- 需要用到插槽 table中的prop就不需要了 -->
                        <template v-slot="{ row }">
                            <div class="flex items-center">
                                <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px;"
                                    class="mr-2"></el-image>
                                <div class="flex-1 text-left">
                                    <div>{{ row.title }}</div>
                                    <div>
                                        <span class="text-rose-500">{{ row.min_price }}</span>
                                        <el-divider direction="vertical" />
                                        <span class="text-gray-500 text-xs">{{ row.min_oprice }}</span>
                                    </div>
                                    <p class="text-xs mb-1 text-gray-400">分类：{{ row?.category?.name || '未分类' }}</p>
                                    <p class="text-xs text-gray-400">创建时间：{{ row.create_time }}</p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="实际销量" width="100" prop="sale_count" align="center">
                    </el-table-column>
                    <el-table-column label="商品状态" width="120">
                        <!-- 解构 -->
                        <template #default="{ row }">
                            <el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '上架' : '仓库' }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态" width="120" align="center" v-if="searchForm.tab !== 'delete'">
                        <!-- 解构 -->
                        <template #default="{ row }">
                            <div v-if="row.ischeck == 0">
                                <el-button type="success" size="small" plain>审核通过</el-button>
                                <!-- !ml-0 !important -->
                                <el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
                            </div>
                            <span v-else>
                                {{ row.ischeck == 1 ? '通过' : '拒绝' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="总库存" width="90" prop="stock" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <el-button class="px-0" type="primary" size="default" text>商品详情</el-button>
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
    </div>
</template>

<script setup>
import HeaderList from "@/components/HeaderList.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";

import { toast } from "@/composables/util.js";

import {
    getOrderList,
    deleteOrder,
} from "~/api/order"

import { useInitTable } from "@/composables/useCommon";

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
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,
    multiSelections,
} = useInitTable({
    searchForm: {
        no: "",
        tab: "all",
        starttime: '',
        endtime: '',
        name: '',
        phone: ''
    },
    getList: getOrderList,
    onGetListSuccess: (res) => {
        total.value = res.totalCount;
        tableData.value = res.list
    },
    delete: deleteOrder
})



// tab标签页
const tabbars = [{
    key: "all",
    name: "全部"
}, {
    key: "checking",
    name: "审核中"
}, {
    key: "saling",
    name: "出售中"
}, {
    key: "off",
    name: "已下架"
}, {
    key: "min_stock",
    name: "库存预警"
}, {
    key: "delete",
    name: "回收站"
}]




// 恢复删除
const handleRestoreGoods = () => {
    // console.log(multiSelections2);
    loading.value = true
    restoreGoods(multiSelections.value)
        .then(res => {
            toast("恢复成功")
            // 清空选中
            if (multipleTableRef.value) {
                multipleTableRef.value.clearSelection()
            }
            getData(1)
        })
        .finally(() => {
            loading.value = false
        })
}


</script>

<style lang="scss" scoped>
.y-table {
    height: calc(100vh - 200px);

    :deep(.el-card__body) {
        height: 100%;
    }

    .container {
        height: calc(100% - 140px);
    }
}
</style>