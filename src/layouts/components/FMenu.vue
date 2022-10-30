<template>
    <!-- 动态设置宽度 -->
    <div class="f-menu" :style="{ width: $store.state.asideWidth }">
        <!-- collapse-transition="false" 关闭菜单动画效果 -->
        <el-menu unique-opened :collapse="isCollapse" :default-active="defaultActive" :collapse-transition="false"
            router class="border-0" @select="handleSelect">
            <template v-for="(item, index) in  asideMenus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>

                    <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>

        </el-menu>
    </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const route = useRoute();
const store = useStore();

// 默认选中路由 
const defaultActive = ref(route.path)

// 是否折叠状态 boolean
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));

// 菜单 不用computed也可以 
const asideMenus = computed(() => store.state.menus)

// 路由跳转
const handleSelect = (e) => {
    // router.push(e);
    defaultActive.value = e
};
</script>

<style scoped>
.f-menu {
    /* 给收缩添加动画 */
    transition: all 0.2s;
    /* fixed固定位置 当中间内容过多时候 也保持位置不变bottom 都为0 可以占满整个空间 */
    /* overflow-x-hidden 消除收缩变化时,x方向的滚动条 */
    /* overflow: auto  会根据实际情况显示滚动条*/
    @apply fixed top-[64px] left-0 bottom-0 overflow-x-hidden overflow-y-auto shadow-md bg-light-50;
}

.f-menu::-webkit-scrollbar {
    width: 0;
    /*隐藏滚动条*/
}
</style>