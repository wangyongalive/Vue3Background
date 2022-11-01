<!-- 图片列表侧边栏 -->
<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <!-- 动态添加active类class emit-- edit  click没有被emit props发生透传 handleChangeActiveId-->
      <aside-list v-for="(item, index) in list" :key="index" :active="activeId == item.id" @edit="handleEdit(item)"
        @delete="handleDelete(item.id)" @click.stop="handleChangeActiveId(item.id)">
        {{ item.name }}
      </aside-list>
    </div>

    <div class="bottom">
      <!-- current-page 当前页数  @current-page 改变时触发 -->
      <el-pagination background layout="prev, next" :total="total" :page-size="limit" @current-change="getData"
        v-model:current-page="currentPage" />
    </div>
  </el-aside>

  <!-- 抽屉： 可以通过头部按钮和 编辑打开 ref-->
  <form-drawer :title="drawTitle" ref="formDrawerRef" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
      </el-form-item>
    </el-form>

  </form-drawer>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import AsideList from "./AsideList.vue";
import FormDrawer from "./FormDrawer.vue";
import { toast } from "@/composables/util";

import {
  getImageClassList,
  createImageClass,
  updateImageClass,
  deleteImageClass,
} from "@/api/image_class.js";

// 加载动画
const loading = ref(false);
const list = ref([]);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

// 获取数据
function getData(limit) {
  // currentPage.value = limit;
  loading.value = true; // 开始加载动画
  getImageClassList(limit)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list;
      let item = list.value[0]; // 选择第一个item
      if (item) {
        // 如果item存在
        // activeId.value = item.id;
        handleChangeActiveId(item.id); // 类型请求后 获取第一个类型的图片数据
      }
    })
    .finally(() => {
      loading.value = false; // 无论失败还是成功 都关闭动画
    });
}

getData(currentPage.value);

// 抽屉
const formDrawerRef = ref(null);
const editId = ref(0);
// 通过editId是否有值来判断 标题的值
const drawTitle = computed(() => (editId.value ? "修改" : "新增"));

// 新增表单
const handleCreate = () => {
  editId.value = 0;
  form.name = "";
  form.order = 50;
  formDrawerRef.value.open();
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((validate) => {
    if (!validate) return;
    formDrawerRef.value.showLoading();

    const fun = editId.value
      ? updateImageClass(editId.value, form)
      : createImageClass(form);

    fun
      .then((res) => {
        toast(drawTitle.value + "成功");
        // 新增就跳转到第一页 修改还是在当前页
        getData(editId.value ? currentPage.value : 1);
        formDrawerRef.value.close();
      })
      .catch(() => { })
      .finally(() => {
        formDrawerRef.value.hideLoading();
      });
  });
};

const form = reactive({
  name: "",
  order: 50,
});
const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      trigger: "blur",
    },
  ],
};

const formRef = ref(null);

// 编辑表单
const handleEdit = (row) => {
  editId.value = row.id;
  form.name = row.name;
  form.order = row.order;
  formDrawerRef.value.open();
};

//  删除表达
const handleDelete = (id) => {
  loading.value = true;
  deleteImageClass(id)
    .then((res) => {
      toast("删除成功");
      getData(1);
    })
    .finally(() => {
      loading.value = false;
    });
};

// 选中图库分类ID
const activeId = ref(0);
const emit = defineEmits(["change"]);
// 切换分类  兄弟组件通信  需要借助父组件来通信
function handleChangeActiveId(id) {
  activeId.value = id;
  emit("change", id);
}

// 向外暴露方法 让外部的按钮调用
defineExpose({
  handleCreate,
});
</script>

<style lang="scss" scoped>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;

  .top {
    position: absolute;
    /*aside的overflow:auto 会产生进度条*/
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
    /*top标签超出 在top标签内部产生滚动条 而不是aside*/
  }

  .bottom {
    // bottom: 0;
    // height: 50px;
    // left: 0;
    /* left:0;  right:0; 可以使内容撑开*/
    // right: 0;
    @apply flex items-center justify-center absolute bottom-0 left-0 right-0 h-50px;
  }
}
</style>