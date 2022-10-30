<template>
    <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
        <el-tabs v-model="activeTab" type="card" style="min-width:100px" @tab-remove="removeTab"
            @tab-change="changeTab">
            <el-tab-pane v-for="item in tabList" :key="item.path" :closable="item.path != '/'" :label="item.title"
                :name="item.path">
            </el-tab-pane>
        </el-tabs>
        <el-dropdown class="f-tag-btn">
            <span>
                <el-icon>
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <!-- {{ ff }} -->
    </div>
    <div style="height:44px;"></div>
</template>
<script  setup>
import { ref } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { useCookies } from '@vueuse/integrations/useCookies'

const route = useRoute();
const router = useRouter();
const cookie = useCookies()


// 获取刷新后激活的tab
const activeTab = ref(route.path);
const tabList = ref([
    {
        title: "后台首页",
        path: "/",
    },
]);

// 添加标签导航
const addTab = (tab) => {
    let noTab = !tabList.value.some(t => t.path == tab.path)
    if (noTab) {
        tabList.value.push(tab)
        cookie.set("tabList", tabList.value)
    }

}

const changeTab = (t) => {
    activeTab.value = t
    router.push(t)
}


// 添加一个导航守卫，在当前位置即将更新时触发
onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path
    addTab({
        title: to.meta.title,
        path: to.path
    })

})

// 初始化标签导航列表  从cookie中获取数据
function initTabList() {
    let tbs = cookie.get("tabList")
    if (tbs) {
        tabList.value = tbs
    }
}

initTabList()


let ff = 11111; // 在模板中可以使用 但是数值改变 模板不会变 非响应式变化

const removeTab = (t) => {
    let tabs = tabList.value
    let a = activeTab.value
    if (a == t) {
        let tabIndex = tabs.findIndex((tab) => tab.path == t)
        let nextTab = tabs[tabIndex + 1] || tabs[tabIndex - 1] // 下一个tab
        if (nextTab) {
            a = nextTab.path
        }
    }

    activeTab.value = a; // 拿到激活的path
    tabList.value = tabList.value.filter(tab => tab.path != t)

    cookie.set('tabList', tabList.value)
};
</script>

<style lang="scss" scoped>
// fixed 使位置固定
.f-tag-list {
    @apply fixed top-64px right-0 h-44px bg-gray-100 flex items-center px-2;

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