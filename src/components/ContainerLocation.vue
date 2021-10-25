<template>
  <iframe
    ref="iframe"
    class="container"
    runat="server"
    :src="iframeUrl"
    width="100%"
    frameborder="no"
    border="0"
    marginwidth="0"
    marginheight="0"
    scrolling="yes"
    allowtransparency="yes"
  ></iframe>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    userIdSelected: {},
  },
  computed: {
    iframeUrl() {
      var url = "/module/mtp/server/location/page?order_createTime=desc";
      if (this.userIdSelected && this.userIdSelected.length > 0) {
        var userIds = encodeURIComponent(this.userIdSelected.join(","));
        url += "&query_userId=" + userIds;
      }
      return url;
    },
  },
  created() {
    var me = this;
    this.$nextTick(() => {
      setInterval(() => {
        if (me.$refs.iframe) {
          me.$refs.iframe.style.height = window.innerHeight - 115 + "px";
        }
      }, 2000);
    });
  },
};
</script>
<style scoped>
.container {
  width: 100%;
  /* height: 100%;
  min-height: 400px; */
  overflow: hidden;
  padding: 0;
  margin: 0;
}
</style>