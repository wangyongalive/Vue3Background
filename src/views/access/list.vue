<template>
  <el-card shadow="never" class="border-0">
    <header-list @reFresh="getData" @create="handleCreate"></header-list>
    <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }"
      :default-expanded-keys="defaultExpandedKeys" node-key="id" v-loading="loading">
      <template #default="{ data }">
        <!-- h-[40px]  写在外面的div -->
        <div class="flex flex-1 items-center">
          <!-- <div> -->
          <el-tag :type="data.menu == 1 ? '' : 'info'">
            {{ data.menu == 1 ? '菜单' : '权限' }}
          </el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span class="ml-2"> {{ data.name }}</span>
          <!-- </div> -->
          <div class="ml-auto">
            <el-switch :model-value="data.status" :active-value="1" :inactive-value="0"
              @change="handleStatusChange($event, data)">
            </el-switch>
            <!-- 防止事件冒泡 -->
            <el-button type="primary" text @click.stop="hanleEdit(data)">修改</el-button>
            <el-button type="primary" text @click.stop="addChild(data.id)" v-if="data.menu == 1">增加</el-button>
            <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消"
              @confirm="hanleDelete(data.id)">
              <template #reference>
                <el-button text type="primary">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>

        </div>
      </template>
    </el-tree>


    <form-drawer ref="formDrawerRef" :title="drawTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="上级菜单" prop="rule_id">
          <!-- 级联选择器 -->
          <el-cascader v-model="form.rule_id" :options="options"
            :props="{ value: 'id', checkStrictly: true, label: `name`, children: 'child', emitPath: false }" clearable
            placeholder="请选择上级菜单" />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name" style="width:30%">
          <el-input v-model="form.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
          <icon-select v-model="form.icon" />
        </el-form-item>
        <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
          <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
          <el-input v-model="form.content" placeholder="后端规则"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
          <el-select v-model="value" placeholder="请求方式">
            <el-option v-for='item in ["GET", "POST", "PUT", "DELETE"]' :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>

</template>

<script setup>
import { ref } from 'vue'
import HeaderList from "@/components/HeaderList.vue";
import FormDrawer from "../../components/FormDrawer.vue";
import IconSelect from "../../components/IconSelect.vue";
import { getRuleList, createRule, updateRule, deleteRule, updateRuleStatus } from '@/api/rule';
import { useInitTable, useInitForm } from '@/composables/useCommon.js';
const options = ref([])
const defaultExpandedKeys = ref([])
const {
  tableData,
  getData,
  loading,
  handleStatusChange,
  hanleDelete
} = useInitTable(
  {
    getList: getRuleList,
    onGetListSuccess: (res) => {
      options.value = res.rules;
      tableData.value = res.list
      defaultExpandedKeys.value = res.list.map(o => o.id)
      tableData.value = res.list.map((o) => {
        o.statusLoading = false; // switch 默认没有动画
        return o;
      });
    },
    updateStatus: updateRuleStatus,
    delete: deleteRule
  }
)


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
        rule_id: 0,
        menu: 0,
        name: '',
        condition: '',
        method: "GET",
        status: 1,
        order: 50,
        icon: '',
        frontpath: ''
      },
      rules: {
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
      },
      getData,
      update: updateRule,
      create: createRule
    }
  )

const addChild = (id) => {
  handleCreate() // 先重置
  form.rule_id = id
  form.status = 1
}

</script>

<style lang="scss" scoped>
:deep(.el-tree-node__label) {
  flex: 1;
}

:deep(.el-tree-node__content) {
  height: 40px;
}
</style>
