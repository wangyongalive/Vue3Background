<!-- // 抽离的新增和刷新功能的组件 -->
<template>
  <!-- 新增 | 刷新  |批量删除 -->
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button v-if="btns.includes('create')" type="primary" size="small" @click.stop="$emit('create')">新增</el-button>
      <span @click.stop="() => { }" style="margin-left:10px;margin-right: 10px;">
        <el-popconfirm v-if="btns.includes(`delete`)" title="是否要删除该规格？" confirmButtonText="确认" cancelButtonText="取消"
          @confirm="$emit('delete')">
          <template #reference>
            <el-button type="danger" size="small">批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </span>
      <slot></slot>
    </div>
    <div>
      <el-tooltip v-if="btns.includes(`reFresh`)" content="刷新数据" placement="top" effect="dark">
        <el-button text size="default" @click.stop="$emit('reFresh')">
          <el-icon :size="15">
            <refresh></refresh>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="btns.includes(`download`)" content="导出数据" placement="top" effect="dark">
        <el-button text size="default" @click.stop="$emit('download')">
          <el-icon :size="15">
            <download />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>

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
  "create", "reFresh", 'delete', 'download'
])
</script>

<style scoped>

</style>
