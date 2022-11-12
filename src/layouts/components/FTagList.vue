<template>
    <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
        <!-- style="min-width:100px" 必须加宽度 否则无法显示前后符号 -->
        <el-tabs v-model="activeTab" type="card" style="min-width:100px" @tab-remove="removeTab"
            @tab-change="changeTab">
            <el-tab-pane v-for="item in tabList" :key="item.path" :closable="item.path != '/'" :label="item.title"
                :name="item.path">
            </el-tab-pane>
        </el-tabs>
        <el-dropdown class="f-tag-btn" @command="handleClose">
            <span>
                <el-icon>
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <!-- {{ ff }} -->
    </div>
    <div style="height:44px;"></div>
</template>
<script  setup>
import { useTabList } from "@/composables/useTabList";
const { activeTab, tabList, changeTab, removeTab, handleClose } = useTabList();
</script>

<style lang="scss" scoped>
// fixed 使位置固定
.f-tag-list {
    @apply fixed top-64px right-0 h-44px bg-gray-100 flex items-center px-2;
    z-index: 1000;

    :deep(.el-tabs__header) {
        margin-bottom: 0;
    }
}

.f-tag-btn {
    @apply flex items-center justify-center ml-auto h-32px w-32px bg-white rounded;
}

:deep .el-tabs--card {
    height: 32px;

    .el-tabs__header {
        border: 0 !important;
    }

    .el-tabs__header .el-tabs__nav {
        @apply border-0;

        .el-tabs__item {
            @apply bg-white border-0 mx-1 h-32px rounded;
            line-height: 32px;
        }
    }

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
        line-height: 32px;
    }

    .el-tabs__nav-next.is-disabled,
    .el-tabs__nav-prev.is-disabled {
        cursor: not-allowed;
        @apply text-gray-300;
    }
}
</style>