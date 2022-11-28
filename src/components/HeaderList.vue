// 抽离的新增和刷新功能的组件
<template>
  <!-- 新增 | 刷新  -->
  <div class="flex justify-center justify-between mb-4">
    <div>
      <el-button v-if="btns.includes('create')" type="primary" size="small" @click.stop="$emit('create')">新增</el-button>
      <span @click.stop="() => { }" style="margin-left:10px;">
        <el-popconfirm v-if="btns.includes(`delete`)" title="是否要删除该规格？" confirmButtonText="确认" cancelButtonText="取消"
          @confirm="$emit('delete')">
          <template #reference>
            <el-button type="danger" size="small">批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </span>
    </div>
    <el-tooltip v-if="btns.includes(`reFresh`)" content="刷新数据" placement="top" effect="dark">
      <el-button text size="default" @click.stop="$emit('reFresh')">
        <el-icon :size="20">
          <refresh></refresh>
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>

const props = defineProps({
  layout: {
    type: String,
    default: 'create,reFresh'
  }
})

const btns = props.layout.split(",")
// 向外暴露 create reFresh
defineEmits([
  "create", "reFresh", 'delete'
])
</script>

<style scoped>

</style>
