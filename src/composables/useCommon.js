import { reactive, ref } from "vue";
export function useInitTable(opt = {}) {
  // // 查询表单
  // const searchForm = reactive({
  //   keyword: "",
  // });

  // // 清空表单
  // const restSearchForm = () => {
  //   searchForm.keyword = "";
  //   getData();
  // };

  // 封装1: 查询的关键字通过外部传入,默认是null
  let searchForm = null;
  let restSearchForm = null;
  if (opt.searchForm) {
    searchForm = reactive({
      ...opt.searchForm,
    });
    // 重置表单
    restSearchForm = () => {
      for (let key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key];
      }
      getData();
    };
  }

  // 加载动画
  const loading = ref(false);
  const tableData = ref([]);

  // 分页
  const currentPage = ref(1);
  const total = ref(0);
  const limit = ref(10);

  // 获取数据
  function getData(page = currentPage.value) {
    loading.value = true; // 开始加载动画
    // 封装2：
    // 请求的接口通过外部传入
    opt
      .getList(page, searchForm)
      .then((res) => {
        // 封装3：
        // 请求成功的操作通过外部传入
        if (
          opt.onGetListSuccess &&
          typeof opt.onGetListSuccess === "function"
        ) {
          opt.onGetListSuccess(res);
        } else {
          total.value = res.totalCount;
          tableData.value = res.list;
        }
      })
      .finally(() => {
        loading.value = false; // 无论失败还是成功 都关闭动画
      });
  }

  getData(currentPage.value);

  return {
    searchForm,
    restSearchForm,
    loading,
    tableData,
    currentPage,
    total,
    limit,
    getData,
  };
}
