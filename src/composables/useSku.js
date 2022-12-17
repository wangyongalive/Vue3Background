import { ref } from "vue";
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
} from "~/api/goods.js";
import { useArrayMoveUp, useArrayMoveDown } from "~/composables/util";

// 当前商品ID
export const goods = ref(0);

// 规格选项列表
export const sku_card_list = ref([]);

// 初始化规格选项列表
export function initSkuCardList(d) {
  //   对数据进行重构
  sku_card_list.value = d.goodsSkusCard.map((item) => {
    item.text = item.name;
    item.loading = false;
    item.goodsSkusCardValue.map((v) => {
      v.text = v.value || "属性值";
      return v;
    });
    return item;
  });
}

// 添加规格按钮
export const btnLoading = ref(false);
export function addSkuCardEvent() {
  btnLoading.value = true;
  createGoodsSkusCard({
    goods_id: goods.value,
    name: "规格选项",
    order: 50,
    type: 0,
  })
    .then((res) => {
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
    })
    .finally(() => {
      btnLoading.value = false;
    });
}

// 修改规格选项
export function handleUpdate(item) {
  // card选项加载动画
  item.loading = true;
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0,
  })
    .then((res) => {
      // 修改成功
      item.name = item.text;
    })
    .catch((err) => {
      // 修改失败
      item.text = item.name;
    })
    .finally(() => {
      item.loading = false;
    });
}

// 删除规格选项
export function handleDelete(item) {
  // card选项加载动画
  item.loading = true; // item都删除了 就不用重置为true
  deleteGoodsSkusCard(item.id)
    .then((res) => {
      const index = sku_card_list.value.findIndex((o) => o.id == item.id);
      sku_card_list.value.splice(index, 1);
    })
    .catch((err) => {});
}

// 排序规格选项
// 加载动画
export const bodyLoading = ref(false);
export function sortCard(action, index) {
  // 拷贝一份数据
  let oList = JSON.parse(JSON.stringify(sku_card_list.value));
  let func = action == "up" ? useArrayMoveUp : useArrayMoveDown;
  func(oList, index);
  let sortData = oList.map((o, i) => {
    return {
      id: o.id,
      order: i + 1,
    };
  });
  bodyLoading.value = true;
  // 发送请求
  sortGoodsSkusCard({
    sortdata: sortData,
  })
    .then(() => {
      func(sku_card_list.value, index);
    })
    .catch(() => {})
    .finally(() => {
      bodyLoading.value = false;
    });
}

// 初始化规格的值
export function initSkusCardItem(id) {
  const item = sku_card_list.value.find((o) => o.id == id);
  return {
    item,
  };
}
