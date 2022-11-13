<template>

  <el-card shadow="always">
    <!-- 新增和刷新 -->
    <header-list @create="handleCreate" @reFresh="handleReresh"></header-list>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" width="380" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
            :disabled="row.super == 1" @change="handleStatusChange($event, row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
          <el-button type="primary" size="small" text @click.stop="hanleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="hanleDelete(scope.row.id)">
            <template #reference>
              <el-button text type="primary">
                删除
                {{ scope.rows }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-center mt-5">
      <!-- current-page 当前页数  @current-page 改变时触发 -->
      <el-pagination background layout="prev, pager,next" :total="total" :page-size="limit" @current-change="getData"
        v-model:current-page="currentPage" />
    </div>

    <!-- 新增和修改 -->
    <form-drawer ref="formDrawerRef" :title="drawTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
    </form-drawer>


    <!-- 权限配置 -->
    <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
      <el-tree-v2 ref="setRuleTreeRef" :check-strictly="checkStrictly" :default-expanded-keys="defaultExpandedKeys"
        :data="ruleList" :props="{ label: 'name', children: 'child' }" show-checkbox :height="treeHeight"
        @check="handleCheck">
        <template #default="{ data }">
          <div class="flex items-center">
            <el-tag :type="data.menu == 1 ? '' : 'info'">
              {{ data.menu == 1 ? '菜单' : '限权' }}</el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </el-card>

</template>

<script setup>
import { nextTick, ref } from 'vue'
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  updateRoleStatus,
  setRoleRules
} from "@/api/role";
import {
  getRuleList
} from "~/api/rule"
import FormDrawer from "../../components/FormDrawer.vue";
import HeaderList from "@/components/HeaderList.vue";
import { useInitTable, useInitForm } from "@/composables/useCommon";
import { toast } from "@/composables/util";
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
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus,
  onGetListSuccess: (res) => {
    total.value = res.totalCount;
    tableData.value = res.list.map((o) => {
      o.statusLoading = false; // switch 默认没有动画
      return o;
    });
  },
})

// 抽离新增和修改(编辑)

const {
  drawTitle,
  formDrawerRef,
  formRef,
  form,
  rules,
  resetForm,
  handleCreate,
  hanleEdit,
  handleSubmit,
  handleReresh } = useInitForm(
    {
      form: {
        name: "",
        desc: "",
        status: 1
      },
      rules: {
        name: [{
          required: true,
          message: "角色名称不能为空",
          trigger: "blur",
        }]
      },
      getData,
      update: updateRole,
      create: createRole
    }
  )


const setRuleFormDrawerRef = ref(null)
const setRuleTreeRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)

// false 关联(默认)    true 不关联 
const checkStrictly = ref(false)
let roleId = 0;
let keyIds = []

// 默认展开的节点
const defaultExpandedKeys = ref([])
// // 默认选中的节点
// const defaultCheckedKeys = ref([])


const openSetRule = (row) => {
  roleId = row.id
  treeHeight.value = window.innerHeight - 170; // 动态计算高度
  checkStrictly.value = false; // 
  getRuleList(1).then(res => {
    checkStrictly.value = true; // 
    ruleList.value = res.list
    defaultExpandedKeys.value = res.list.map(o => o.id)
    // defaultCheckedKeys使用第二次打开后会有问题
    // defaultCheckedKeys.value = row.rules.map(o => o.id)

    // 先打开抽屉
    setRuleFormDrawerRef.value.open()

    nextTick(() => {
      // console.log(setRuleFormDrawerRef.value)
      // 树渲染好后才设置才有效
      setRuleTreeRef.value.setCheckedKeys(row.rules.map(o => o.id))
    })
    // setTimeout(() => {
    //   // 树渲染好后才设置才有效
    //   setRuleTreeRef.value.setCheckedKeys(row.rules.map(o => o.id))
    // }, 150)

  })
}


const handleSetRuleSubmit = () => {
  setRuleFormDrawerRef.value.showLoading()
  setRoleRules(roleId, keyIds).then(() => {
    toast("配置成功")
    getData()
    setRuleFormDrawerRef.value.close()
  })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      setRuleFormDrawerRef.value.hideLoading()
    })
}

// 
const handleCheck = (_, info) => {
  keyIds =
    [...info?.checkedKeys, ...info?.halfCheckedKeys]
}
</script>