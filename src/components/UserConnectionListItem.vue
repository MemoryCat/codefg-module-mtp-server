<template>
  <div>
    <el-checkbox v-model="selected" border class="checkbox">
      <span :title="item.ip + ':' + item.port"
        >{{ item.userName }} - ({{ item.ip }}:{{ item.port }})</span
      >
    </el-checkbox>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: false,
    };
  },
  props: {
    item: {
      default: {
        id: "id",
        name: "name",
      },
    },
  },
  watch: {
    selected: {
      handler(newValue) {
        this.$emit("valueChange", this, newValue);
        this.$emit("userIdValueChange", this, newValue);
      },
    },
  },
};
</script>
<style scoped>
.checkbox {
  width: 100%;
  margin: 2px 0px;
}
</style>