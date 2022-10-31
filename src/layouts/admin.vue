<template>
  <el-container>
    <el-header>
      <f-header />
    </el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth">
        <!-- 固定定位 -->
        <f-menu></f-menu>
      </el-aside>
      <el-main>
        <f-tag-list />
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <keep-alive :max="10">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import FHeader from './components/FHeader.vue';
import FMenu from './components/FMenu.vue';
import FTagList from './components/FTagList.vue';
</script>

<style>
.el-aside {
  /* 消除闪一下的效果 */
  transition: all 0.2s;
}

/* 动画采用的是animate.css  cdn 选择对应类的class 拷贝*/

.fade-enter-from {
  opacity: 0;
  -webkit-transform: translate3d(0, -100%, 0);
  transform: translate3d(0, -100%, 0);
}

.fade-enter-to {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.fade-leave-from {
  opacity: 1;
}


.fade-leave-to {
  opacity: 0;
  -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all .3s;
}

.fade-enter-active {
  transition-delay: .3s;
}
</style>