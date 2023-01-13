import { computed, reactive, ref } from "vue";
import { toast } from "@/composables/util";

// 列表，分页，搜索  删除和更新状态(由于和getData有关 直接写在这里)
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
    // console.log("currentPage.value", currentPage.value, page);
    currentPage.value = page; // 同步页数
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
      .catch((e) => console.log(e))
      .finally(() => {
        loading.value = false; // 无论失败还是成功 都关闭动画
      });
  }

  getData(currentPage.value);

  // 删除
  const hanleDelete = (id) => {
    loading.value = true;
    opt
      .delete(id)
      .then((res) => {
        toast("删除成功");
        getData(1);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 多选 multiSelections 要用ref 否则导出不同步
  // 由于multiSelections2 被重新赋值 地址改变了 所以不同步
  let multiSelections = ref([]);
  // let multiSelections2 = [];
  const handleSelectionChange = (e) => {
    multiSelections.value = e.map((o) => o.id);
    // multiSelections2 = e.map((o) => o.id);
  };

  const multipleTableRef = ref(null);

  // 批量删除
  const handleMultiDelete = () => {
    loading.value = true;
    opt
      .delete(multiSelections.value)
      .then((res) => {
        toast("删除成功");
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
        getData(1);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 批量修改状态
  const handleMultiStatusChange = (status) => {
    loading.value = true;
    opt
      .updateStatus(multiSelections.value, status)
      .then((res) => {
        toast("修改状态成功");
        // 清空选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
        getData(1);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 修改状态
  const handleStatusChange = (status, row) => {
    row.statusLoading = true; // swtich加载动画
    opt
      .updateStatus(row.id, status)
      .then((res) => {
        toast("修改状态成功!");
        row.status = status; // 修改状态
      })
      .catch(() => {
        row.status = row.status == 0 ? 0 : 1;
      })
      .finally(() => {
        row.statusLoading = false;
      });
  };

  return {
    searchForm,
    restSearchForm,
    loading,
    tableData,
    currentPage,
    total,
    limit,
    getData,
    hanleDelete,
    handleStatusChange,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,
    handleMultiStatusChange,
    multiSelections,
    // multiSelections2,
  };
}

// 新增 修改
export function useInitForm(opt = {}) {
  // 区别新增和编辑
  const editId = ref(0);
  const drawTitle = computed(() => (editId.value ? "修改" : "新增"));

  // 表单
  const formDrawerRef = ref(null);
  const formRef = ref(null);
  const defaultForm = opt.form;
  const form = reactive({});

  // 封装1
  // 校验规则
  const rules = opt.rules || {};

  // 重置表单
  const resetForm = (row) => {
    if (formRef.value) {
      // 清理某个字段的表单验证信息
      formRef.value.clearValidate();
    }
    // 给表单重新赋值
    if (row) {
      for (const key in defaultForm) {
        form[key] = row[key];
      }
    }
  };

  // 新增
  const handleCreate = () => {
    editId.value = 0;
    resetForm(defaultForm);
    formDrawerRef.value.open();
  };

  // 编辑
  const hanleEdit = (row) => {
    editId.value = row.id;
    resetForm(row);
    formDrawerRef.value.open();
  };

  // 提交表单
  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) return;
      formDrawerRef.value.showLoading();

      // 转换传递的参数
      let body = {};
      if (opt.beforeSumbit) {
        // 拷贝一份form表单
        body = opt.beforeSumbit({ ...form });
      } else {
        body = form;
      }

      // 封装2
      // 请求接口
      const fun = editId.value
        ? opt.update(editId.value, body)
        : opt.create(body);

      fun
        .then((res) => {
          toast(drawTitle.value + "成功");
          // 修改刷新当前页 新增刷新第一页
          opt.getData(editId.value ? undefined : 1);
          formDrawerRef.value.close();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };

  // 刷新按钮
  const handleReresh = () => {
    opt.getData();
  };

  return {
    editId,
    drawTitle,
    formDrawerRef,
    formRef,
    form,
    rules,
    resetForm,
    handleCreate,
    hanleEdit,
    handleSubmit,
    handleReresh,
  };
}
