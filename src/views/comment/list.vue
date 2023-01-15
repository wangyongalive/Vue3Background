<template>
    <el-card shadow="always" class="y-table">
        <search @search="getData(1)" @reset="restSearchForm">
            <!-- 默认插槽 -->
            <search-item label="关键词">
                <el-input v-model="searchForm.keyword" placeholder="要搜索的商品" clearable></el-input>
            </search-item>
        </search>

        <div class="container">
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" height="100%" row-key="id">
                <el-table-column type="expand">
                    <template #default="{ row }">
                        <div class="flex ml-18">
                            <el-avatar :size="50" :src="row.user.avatar" fit="fill" class="mr-3" />
                            <div class="flex-1">
                                <h6 class="flex items-center">
                                    {{ row.user.nickname || row.user.username }}
                                    <small class=" text-gray-400 ml-2">{{ row.review_time }}</small>
                                    <el-button size="small" class="ml-auto" @click.stop="openTextarea(row)"
                                        v-if="!row.textareaEdit && !row.extra">回复</el-button>
                                </h6>
                                {{ row.review.data }}
                                <div class="py-2">
                                    <el-image v-for="(image, index) in row.review.image" :key="index" :src="image"
                                        fit="fill" :lazy="true" style="width:100px;height:100px;"
                                        class="rounded"></el-image>
                                </div>

                                <div v-if="row.textareaEdit">
                                    <el-input v-model="row.textarea" type="textarea"
                                        placeholder="Please input"></el-input>
                                    <div class="py-2">
                                        <el-button type="primary" size="small" @click.stop="review(row)">回复</el-button>
                                        <el-button size="small" @click="row.textareaEdit = false">取消</el-button>
                                    </div>
                                </div>
                                <template v-else>
                                    <div class="mt-3 p-3 rounded bg-gray-100" v-for="(item, index) in row.extra"
                                        :key="index">
                                        <h6 class="flex font-bold">
                                            客服
                                            <el-button type="info" size="small" class="ml-auto"
                                                @click.stop="openTextarea(row, item.data)">修改</el-button>
                                        </h6>
                                        <p>{{ item.data }}</p>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
                <el-table-column label="商品" width="200">
                    <!-- 需要用到插槽 table中的prop就不需要了 -->
                    <template v-slot="scope">
                        <div class="flex items-center">
                            <el-image :src="scope.row.goods_item ? scope.row.goods_item.cover : ''" fit="fill"
                                :lazy="true" style="width:50px;height:50px" class="rounded">
                            </el-image>
                            <div class="ml-3">
                                <h6>{{ scope.row.goods_item?.title ?? '商品已被删除' }}</h6>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="评价信息">
                    <template #default="{ row }">
                        <p>
                            用户:{{
                                row.user.username || row.user.nickname
                            }}
                        </p>
                        <p>
                            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="review_time" label="评价时间" />
                <el-table-column label="状态">
                    <!-- 解构 -->
                    <template #default="{ row }">
                        <!-- $event可以获取默认传递的值 $event不一定代表原生事件 -->
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                            :loading="row.statusLoading" :disabled="row.super == 1"
                            @change="handleStatusChange($event, row)">
                        </el-switch>
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
import { toast } from "~/composables/util"
import {
    getGoodsCommentList,
    updateGoodsCommentStatus,
    reviewGoodsComment
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
            o.textareaEdit = false
            o.textarea = ''
            return o;
        });
    },
    updateStatus: updateGoodsCommentStatus
})

const openTextarea = (row, data = '') => {
    console.log('row', row)
    row.textareaEdit = true
    row.textarea = data
}

const review = (row) => {
    if (row.textarea == '') {
        return toast("回复内容不能为空", "error")
    }
    reviewGoodsComment(row.id, row.textarea)
        .then(() => {
            row.textareaEdit = false;
            toast("回复成功")
            getData(1)
        })
        .catch(console.log)
}
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