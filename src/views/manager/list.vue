<template>

  <el-card shadow="always">
    <!-- 搜索  small:表单中的所有子组件都继承了该表单的 size 属性-->
    <el-form :model="searchForm" ref="searchFormRef" :rules="rules" label-width="80px" inline size="small"
      class="flex items-center justify-between">
      <el-form-item label="关键词">
        <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="getData(1)">搜索</el-button>
        <el-button @click.stop="restSearchForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增 | 刷新  -->
    <div class="flex justify-center justify-between mb-4">
      <el-button type="primary" size="small" @click.stop="handleCreate">新增</el-button>
      <el-tooltip content="刷新数据" placement="top" effect="dark">
        <el-button text size="default" @click.stop="handleReresh">
          <el-icon :size="20">
            <refresh></refresh>
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="管理员" width="200" align="center">
        <!-- 需要用到插槽 prop就不需要了 -->
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
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
            :disabled="row.super == 1" @change="handleStatusChange($event, row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-sm text-gray-500">暂无操作</small>
          <div v-else>
            <el-button type="primary" size="default" text @click.stop="hanleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="是否删除该管理员?" confirm-button-text="确认" cancel-button-text="取消"
              @confirm="hanleDelete(scope.row.id)">
              <template #reference>
                <el-button text type="primary">
                  删除
                  {{ scope.rows }}
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-center mt-5">
      <!-- current-page 当前页数  @current-page 改变时触发 -->
      <el-pagination background layout="prev, pager,next" :total="total" :page-size="limit" @current-change="getData"
        v-model:current-page="currentPage" />

      <form-drawer ref="formDrawerRef" :title="drawTitle" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <el-input v-model="form.avatar" placeholder="头像"></el-input>
          </el-form-item>
          <el-form-item label="所属管理员" prop="role_id">
            <el-select v-model="form.role_id" placeholder="请选择所属管理员">
              <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-form>

      </form-drawer>
    </div>
  </el-card>

</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { getManagerList, updateManagerStatus, createManager, updateManager, deleteManager } from "@/api/manager";
import FormDrawer from "../../components/FormDrawer.vue";
import { toast } from "@/composables/util";

// 查询表单
const searchForm = reactive({
  keyword: ''
})
// 清空表单
const restSearchForm = () => {
  searchForm.keyword = ''
  getData()
}

// 加载动画
const loading = ref(false);
const tableData = ref([]);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

// 区别新增和编辑
const editId = ref(0)
const drawTitle = computed(() => editId.value ? '修改' : '新增')

// 表单
const formDrawerRef = ref(null)
const formRef = ref(null)
const form = reactive({
  username: "",
  password: '',
  role_id: null,
  status: 1,
  avatar: ''
})

const rules = {
  // title: [{
  //   required: true,
  //   message: "公告名称不能为空",
  //   trigger: "blur",
  // }],
  // content: [{
  //   required: true,
  //   message: "公告内容不能为空",
  //   trigger: "blur",
  // }]
}
const roles = ref(null)

// 获取数据
function getData(page = currentPage.value) {
  loading.value = true; // 开始加载动画
  getManagerList(page, searchForm)
    .then((res) => {
      total.value = res.totalCount;
      tableData.value = res.list.map((o) => {
        o.statusLoading = false;  // switc 默认没有动画
        return o;
      });
      roles.value = res.roles
    })
    .finally(() => {
      loading.value = false; // 无论失败还是成功 都关闭动画
    });
}

getData(currentPage.value);

// 重置表单
const resetForm = (row) => {
  if (formRef.value) {
    // 清理某个字段的表单验证信息
    formRef.value.clearValidate()
  }
  // 给表单重新赋值
  if (row) {
    for (const key in form) {
      form[key] = row[key]
    }
  }
}

// 新增
const handleCreate = () => {
  editId.value = 0
  resetForm({
    username: "",
    password: '',
    role_id: null,
    status: 1,
    avatar: ''
  })
  formDrawerRef.value.open()
}

// 删除
const hanleDelete = (id) => {
  loading.value = true;
  deleteManager(id).then(res => {
    toast("删除成功")
    getData(1)
  })
    .finally(() => {
      loading.value = false;
    })
};

// 编辑
const hanleEdit = (row) => {
  editId.value = row.id;
  console.log(row)
  resetForm(row)
  formDrawerRef.value.open()
}

// 刷新按钮
const handleReresh = () => {
  getData()
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    formDrawerRef.value.showLoading()

    const fn = editId.value ? updateManager(editId.value, form) : createManager(form);

    fn.then(res => {
      toast(drawTitle.value + "成功")
      // 修改刷新当前页 新增刷新第一页
      getData(editId.value ? currentPage.value : 1)
      formDrawerRef.value.close()
    })
      .finally(() => {
        formDrawerRef.value.hideLoading()
      })
  })
}



// 修改状态
const handleStatusChange = (status, row) => {
  row.statusLoading = true; // swtich加载动画
  updateManagerStatus(row.id, status)
    .then((res) => {
      toast('修改状态成功!')
      row.status = status // 修改状态
    }).
    catch(() => {
      row.status = row.status == 0 ? 1 : 0;
    })
    .finally(() => {
      row.statusLoading = false;
    })
}

</script>