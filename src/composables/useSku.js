import { ref } from "vue";
import { createGoodsSkusCard, updateGoodsSkusCard } from "~/api/goods.js";

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

// 初始化规格的值
export function initSkusCardItem(id) {
  const item = sku_card_list.value.find((o) => o.id == id);
  return {
    item,
  };
}
