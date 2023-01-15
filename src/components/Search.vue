<template>
  <div>
    <!-- 搜索  small:表单中的所有子组件都继承了该表单的 size 属性-->
    <el-form  ref="searchFormRef" label-width="80px" inline size="small">
      <el-row :gutter="20">
       <slot></slot>
       <slot  v-if="showSearch" name="show">
       </slot>
        <!-- 动态设置offset-->
        <el-col :span="8" :offset="showSearch ? 0 : 8">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click.stop="$emit('search')">搜索</el-button>
            <el-button @click.stop="$emit('reset')">重置</el-button>
            <!-- slots没有高级组件就不显示 -->
            <el-button type="primary" size="default" @click="showSearch = !showSearch" text v-if="slots.show">
              {{ showSearch ? '收起' : '展开' }}
              <el-icon>
                <ArrowUp v-if="showSearch" />
                <ArrowDown v-else />
              </el-icon>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref ,useSlots} from 'vue';
const showSearch = ref(false)
const slots =useSlots()

defineEmits(['search', 'reset'])
console.log(slots)
</script>

<style scoped>

</style>