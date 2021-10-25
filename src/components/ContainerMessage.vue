<template>
  <div>
    <el-form label-width="100px" :model="formData">
      <el-form-item label="消息id">
        <el-input v-model="formData.nid"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="formData.content"></el-input>
      </el-form-item>
      <el-form-item label="优先级别">
        <el-slider
          v-model="formData.priority"
          :min="-2"
          :max="2"
          :format-tooltip="formatTooltip"
        ></el-slider>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        nid: 12345,
        priority: 0,
        title: "标题",
        content: "内容",
      },
    };
  },
  props: {
    userConnectionSelected: {},
  },
  methods: {
    formatTooltip(val) {
      switch (val) {
        case -2:
          return "最低";
        case -1:
          return "比较低";
        case 1:
          return "比较高";
        case 2:
          return "最高";
        default:
          return "默认";
      }
    },
    submitForm() {
      var postData = {
        ids: this.userConnectionSelected,
        message: this.formData,
      };
      this.$axios
        .post("/api/mtp/server/message/notify", postData)
        .then((res) => {
          console.info(res);
        });
    },
  },
};
</script>
