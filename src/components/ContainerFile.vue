<template>
  <div>
    <div>
      <el-input v-model="location" @keyup.enter="visitLocation">
        <template #prepend>
          <el-button
            size="mini"
            type="primary"
            @click="getHomeLocation"
            icon="el-icon-s-home
"
            >主页</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="visitParent"
            icon="el-icon-back"
            >上级</el-button
          >
        </template>
        <template #append>
          <el-button
            size="mini"
            type="primary"
            @click="visitLocation"
            icon="el-icon-s-promotion"
            >浏览</el-button
          >
          <el-dropdown>
            <el-button
              type="primary"
              icon="el-icon-more"
              class="padding-left-30"
            >
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  icon="el-icon-upload"
                  @click="showUpload = !showUpload"
                >
                  上传功能
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-input>
    </div>
    <div v-if="showUpload" class="container-file-upload">
      <input ref="fileInput" type="file" />
      <el-button size="mini" type="primary" @click="uploadFile">上传</el-button>
    </div>
    <div>
      <el-table
        v-loading="loading"
        element-loading-text="查询中..."
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="name" label="名称" sortable>
          <template #default="scope">
            <span
              v-if="scope.row.fileType == 2"
              @click="visitFileItem(scope.row.name)"
              class="pointer file-type-dir"
              v-text="scope.row.name"
            ></span>
            <template v-else>
              <span
                class="pointer file-type-file"
                v-text="scope.row.name"
                @click="downloadFile(scope.row)"
              >
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="类型" sortable>
          <template #default="scope">
            <span v-if="scope.row.fileType == 2">目录</span>
            <span v-else>文件</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileSize" label="大小" sortable>
          <template #default="scope">
            {{ formatFileSize(scope.row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button type="text" size="small" @click="deleteFile(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      location: "/",
      tableData: [],
      uploadOriginalFileName: "",
      showUpload: false,
    };
  },
  props: {
    userConnectionSelected: {},
  },
  computed: {},
  created() {},
  methods: {
    checkSelectOne() {
      if (
        this.userConnectionSelected &&
        this.userConnectionSelected.length != 1
      ) {
        this.$message.warning("必须选择一个设备");
        return false;
      }
      return true;
    },
    visitLocation() {
      if (!this.checkSelectOne()) {
        return false;
      }
      this.loading = true;
      this.$axios
        .get(
          `/api/mtp/server/file/visit/${
            this.userConnectionSelected[0]
          }?location=${encodeURIComponent(this.location)}`
        )
        .then((res) => {
          this.loading = false;
          if (!res.data.success) {
            this.$message.warning(res.data.message);
            return false;
          }
          this.tableData = [];
          this.tableData = res.data.data;
        })
        .catch((e) => {
          console.warn(e);
          this.$message.warning(e.toString());
        });
    },
    visitParent() {
      var locations = this.location.split("/");
      if (locations.length > 1) {
        locations.pop();
        this.location = locations.join("/");
        this.visitLocation();
      } else {
        this.$message.warning("已经是根目录,没有上级目录");
      }
    },
    getHomeLocation() {
      if (!this.checkSelectOne()) {
        return false;
      }
      this.$axios
        .get(
          `/api/mtp/server/file/location/home/${this.userConnectionSelected[0]}`
        )
        .then((res) => {
          if (!res.data.success) {
            this.$message.warning(res.data.message);
            return false;
          }
          this.location = res.data.data.location;
          this.visitLocation();
        })
        .catch((e) => {
          console.warn(e);
          this.$message.warning(e.toString());
        });
    },
    visitFileItem(name) {
      var arr = this.location.split("/");
      arr.push(name);
      this.location = arr.join("/");
      this.visitLocation();
    },
    formatFileSize(s) {
      if (!s) {
        return "未知";
      } else {
        s = parseInt(s);
        var r = s + "b";
        if (s > 1024) {
          r = Math.round(s / 1024) + "kb";
        }
        if (s > 1024 * 1024) {
          r = Math.round(s / 1024 / 1024) + "mb";
        }
        if (s > 1024 * 1024 * 1024) {
          r = Math.round(s / 1024 / 1024 / 1024) + "gb";
        }
        return r;
      }
    },
    deleteFile(row) {
      console.log("删除", row);
      if (!this.checkSelectOne()) {
        return false;
      }
      this.loading = true;
      this.$axios
        .get(
          `/api/mtp/server/file/delete/${this.userConnectionSelected[0]}?file=${row.location}`
        )
        .then((res) => {
          this.loading = false;
          if (!res.data.success) {
            this.$message.warning(res.data.message);
            return false;
          }
          if (!res.data.data.success) {
            if (res.data.data.errorMessage) {
              this.$message.warning(res.data.data.errorMessage);
            } else {
              this.$message.warning("删除失败!");
            }
            return false;
          }
          this.$message.success("删除成功:" + row.location);
          this.visitLocation();
        })
        .catch((e) => {
          console.warn(e);
          this.$message.warning(e.toString());
        });
    },
    downloadFile(row) {
      console.log("下载", row);
      if (!this.checkSelectOne()) {
        return false;
      }
      this.loading = true;
      this.$message.info("准备下载文件:" + row.location);
      this.$axios
        .get(
          `/api/mtp/server/file/download/${
            this.userConnectionSelected[0]
          }?file=${encodeURIComponent(row.location)}`
        )
        .then((res) => {
          this.loading = false;
          if (!res.data.success) {
            this.$message.warning(res.data.message);
            return false;
          }
          if (!res.data.data.success) {
            this.$message.warning(res.data.data.errorMessage);
            return false;
          }
          this.$message.success("开始下载文件:" + row.location);
          window.open(res.data.data.url);
        })
        .catch((e) => {
          console.warn(e);
          this.$message.warning(e.toString());
        });
    },
    uuid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
    },
    uploadFile() {
      if (
        !window.codefg ||
        !window.codefg.config ||
        !window.codefg.config.properties ||
        !window.codefg.config.properties.mtpServerAgentUrl
      ) {
        this.$message.warning("获取配置信息失败，请刷新页面重试！");
        return false;
      }
      if (!this.checkSelectOne()) {
        return false;
      }
      var id = this.userConnectionSelected[0];
      var location = encodeURIComponent(this.location);

      var fileInput = this.$refs.fileInput;
      var file = fileInput.files[0];
      if (!file) {
        this.$message.warning("请选择需要上传的文件");
        return false;
      }

      let param = new FormData(); // 创建form对象
      param.append("file", file); // 通过append向form对象添加数据

      this.$message.info("开始上传文件:" + this.location + "/" + file.name);

      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      var uuid = this.uuid();
      var url =
        window.codefg.config.properties.mtpServerAgentUrl +
        "/api/mtp/agent/file/upload/" +
        uuid;

      this.$axios
        .post(url, param, config)
        .then((res) => {
          if (!res.data.success) {
            this.$message.warning(res.data.message);
            return false;
          }
          this.$message.info("已上传到代理服务器,准备从代理服务器下载到手机");
          var originalFileName = encodeURIComponent(
            res.data.data.originalFileName
          );
          var mtpServerAgentUrl = encodeURIComponent(
            window.codefg.config.properties.mtpServerAgentUrl +
              "/api/mtp/agent/file/download/" +
              uuid
          );
          this.$axios
            .get(
              `/api/mtp/server/file/upload/${id}?file=${uuid}&location=${location}&originalFileName=${originalFileName}&mtpServerAgentUrl=${mtpServerAgentUrl}`
            )
            .then((res) => {
              if (!res.data.success) {
                this.$message.warning(res.data.message);
                return false;
              }
              if (!res.data.data.success) {
                this.$message.warning(res.data.data.errorMessage);
                return false;
              }
              this.$message.success(
                "上传成功:" + res.data.data.originalFileName
              );
              this.location = decodeURIComponent(location);
              this.visitLocation();
            })
            .catch((e) => {
              console.warn(e);
              this.$message.warning(e.toString());
            });
        })
        .catch((e) => {
          console.warn(e);
          this.$message.warning(e.toString());
        });
    },
  },
};
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
.file-type-dir {
  color: blue;
}
.file-type-file {
  color: green;
}
.padding-left-30 {
  padding-left: 30px;
}
.container-file-upload {
  margin: 10px 0;
  padding: 5px 5px;
  background-color: rgb(243, 243, 243);
}
</style>