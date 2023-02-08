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
                <template #show>
                    <search-item label="收货人">
                        <el-input v-model="searchForm.name" placeholder="收货人" clearable></el-input>
                    </search-item>
                    <search-item label="手机号">
                        <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
                    </search-item>
                    <search-item label="开始时间">
                        <el-date-picker v-model="searchForm.starttime" type="date" placeholder="开始日期"
                            style="width: 90%;" value-format="YYYY-MM-DD" />
                    </search-item>
                    <search-item label="结束时间">
                        <el-date-picker v-model="searchForm.endtime" type="date" placeholder="结束时间" style="width: 90%;"
                            value-format="YYYY-MM-DD" />
                    </search-item>
                </template>
            </search>

            <!-- 新增和刷新 -->
            <header-list layout="reFresh,download" @reFresh="getData" @download="handleExportExcel">
                <el-button type="danger" size="small" @click.stop="handleMultiDelete">批量删除</el-button>
            </header-list>

            <div class="container">
                <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
                    style="width: 100%" v-loading="loading" height="100%">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="商品" width="350" align="center">
                        <!-- 需要用到插槽 table中的prop就不需要了 -->
                        <template v-slot="{ row }">
                            <div class="flex items-center">
                                <div class="flex-1">
                                    <p>订单号：</p>
                                    <small>{{ row.no }}</small>
                                </div>
                                <div class="flex-1">
                                    <p>下单时间：</p>
                                    <small>{{
                                        row.create_time
                                    }}</small>
                                </div>
                            </div>
                            <div class="flex py-2" v-for="(item, index) in row.order_items">
                                <el-image :src="item.goods_item?.cover ?? ''" fit="fill" :lazy="true" :key="index"
                                    style="width:30px;height:30px"></el-image>
                                <p class="ml-2 text-blue-500">{{ item.goods_item?.title }}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="实际付款" width="120" prop="total_price" align="center">
                    </el-table-column>
                    <el-table-column label="买家" width="120" align="center">
                        <!-- 解构 -->
                        <template #default="{ row }">
                            <p>{{ row.user.nickname || row.user.username }}</p>
                            <small>(用户ID:{{ row.user.id }})</small>
                        </template>
                    </el-table-column>
                    <el-table-column label="交易状态" width="170" align="center">
                        <!-- 解构 -->
                        <template #default="{ row }">
                            <div>
                                付款状态:
                                <el-tag v-if="row.payment_method === 'wechat'" type="success" size="small">微信支付</el-tag>
                                <el-tag v-else-if="row.payment_method === 'alipay'" size="small">支付宝支付</el-tag>
                                <el-tag v-else type="info" size="small">未支付</el-tag>
                            </div>
                            <div>
                                发货状态:
                                <el-tag v-if="row.ship_data" type="success" size="small">已发货</el-tag>
                                <el-tag v-else type="info" size="small">未发货</el-tag>
                            </div>
                            <div>
                                收获状态:
                                <el-tag v-if="row.ship_status" type="success" size="small">已收获</el-tag>
                                <el-tag v-else type="info" size="small">未收获</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="{ row }">
                            <el-button class="px-1" type="primary" size="small" text
                                @click.stop="openInfoModal(row)">订单详情</el-button>
                            <el-button v-if="searchForm.tab === 'noship'" class="px-1" type="primary" size="small"
                                text>订单发货</el-button>
                            <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="primary" size="small"
                                text @click.stop="handleRefund(row.id, 1)">同意退款</el-button>
                            <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="primary" size="small"
                                text @click.stop="handleRefund(row.id, 0)">拒绝退款</el-button>
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

        <export-excel :tabs="tabbars" ref="ExportExcelRef"></export-excel>
        <info-model ref="InfoModalRef" :info="info" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderList from "@/components/HeaderList.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import ExportExcel from './ExportExcel.vue'
import InfoModel from "./InfoModel.vue";

import {
    showModal,
    showPrompt,
    toast
} from "~/composables/util"


import {
    getOrderList,
    deleteOrder,
    refundOrder
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
    key: "nopay",
    name: "待支付"
}, {
    key: "noship",
    name: "待发货"
}, {
    key: "shiped",
    name: "待收货"
}, {
    key: "received",
    name: "已收货"
}, {
    key: "finish",
    name: "已完成"
},
{
    key: "closed",
    name: "已关闭"
},
{
    key: "refunding",
    name: "退款中"
}]


const ExportExcelRef = ref(null);
const handleExportExcel = () => ExportExcelRef.value.open()


const InfoModalRef = ref(null)
const info = ref(null)
const openInfoModal = (row) => {
    row.order_items = row.order_items.map(o => {
        // skus_type == 1 代表多规格
        if (o.skus_type == 1 && o.goods_skus) {
            let s = []
            for (const k in o.goods_skus.skus) {
                s.push(o.goods_skus.skus[k].value)
            }
            o.sku = s.join(",")
        }
        return o
    })
    info.value = row
    InfoModalRef.value.open()
}

const handleRefund = (id, agree) => {
    // 弹出框和输入框 返回promise
    (agree ? showModal("是否要同意该订单退款?") : showPrompt("请输入拒绝的理由"))
        .then(({ value }) => {
            const data = { agree }
            if (!agree) {
                // 追加参数
                data.disagree_reason = value
            }
            refundOrder(id, data)
                .then(res => {
                    getData(1)
                    toast("操作成功")
                })
                .catch(console.log)
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