<template>
  <div>
    <el-icon
      class="pointer"
      :class="{ 'is-loading': loading }"
      title="刷新列表"
    >
      <refresh @click="refresh" />
    </el-icon>
    已选中{{ selectedIds.length }}条
    <template v-if="items && items.length">
      <div v-for="(item, index) in items" :key="index">
        <user-connection-list-item
          :ref="'item_' + item.id"
          :item="item"
          @valueChange="itemValueChange"
          @userIdValueChange="userIdValueChange"
        />
      </div>
    </template>
    <template v-else>
      <el-result icon="warning" sub-title="暂无在线设备，登录？"> </el-result>
    </template>
  </div>
</template>
<script>
import UserConnectionListItem from "@/components/UserConnectionListItem";

import { Refresh } from "@element-plus/icons";
export default {
  components: {
    UserConnectionListItem,
    Refresh,
  },
  data() {
    return {
      selectedIds: [],
      selectedUserIds: [],
      items: [],
      loading: false,
    };
  },
  computed: {},
  watch: {
    items: {
      handler() {
        // handler(newValue, oldValue) {
        // if (newValue.length < oldValue.length) {
        this.selectedIds = [];
        this.$emit("valueChanage", this, this.selectedIds);
        this.$emit("userIdValueChange", this, this.selectedUserIds);

        // }
      },
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    getSelectIds() {
      var arr = [];
      Object.entries(this.$refs).forEach((k) => {
        if (k[0].startsWith("item_")) {
          if (k[1].selected) {
            arr.push(k[1].item.id);
          }
        }
      });
      return arr;
    },
    itemValueChange(item, val) {
      var id = item.$props.item.id;
      if (val && this.selectedIds.indexOf(id) < 0) {
        this.selectedIds.push(id);
      } else if (!val && this.selectedIds.indexOf(id) >= 0) {
        this.selectedIds.splice(this.selectedIds.indexOf(id), 1);
      }
      this.$emit("valueChanage", this, this.selectedIds);
    },
    userIdValueChange(item, val) {
      var id = item.$props.item.userId;
      if (val && this.selectedUserIds.indexOf(id) < 0) {
        this.selectedUserIds.push(id);
      } else if (!val && this.selectedUserIds.indexOf(id) >= 0) {
        this.selectedUserIds.splice(this.selectedUserIds.indexOf(id), 1);

        //1个userid可能对应对个链接id，所以删除了之后检查一下如果还有选的就设置回去
        Object.entries(this.$refs).forEach((a) => {
          if (a[0].indexOf("item_") == 0 && a[1]) {
            if (a[1].item.userId == id && a[1].selected) {
              this.userIdValueChange(item, true);
            }
          }
        });
      }
      this.$emit("userIdValueChange", this, this.selectedUserIds);
    },
    loadData() {
      this.loading = true;
      this.$axios(this.$utils.URL.userConnectionList)
        .then((res) => {
          this.loading = false;
          console.info(res);
          if (!res.data.success) {
            this.$message.warning("获取用户链接列表失败");
          }
          this.items = res.data.data;
          Object.entries(this.$refs).forEach((a) => {
            if (a[0].indexOf("item_") == 0 && a[1]) {
              a[1].selected = false;
            }
          });
        })
        .catch((e) => {
          this.loading = false;
          this.$message.warning("获取用户链接列表失败:" + e);
        });
    },
    refresh() {
      this.loadData();
    },
  },
};
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
</style>