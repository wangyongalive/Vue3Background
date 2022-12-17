<template>
  <div v-for="(tag, index) in item.goodsSkusCardValue" :key="index">
    {{ tag.value }}
  </div>
</template>

<script setup>
import {
  initSkusCardItem
} from "~/composables/useSku.js";

const props = defineProps({
  skuCardId: [Number, String]
})

const {
  item
} = initSkusCardItem(props.skuCardId)

console.log({ item })
</script>

<style scoped>

</style>