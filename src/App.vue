<template>
  <div class="main-contianer">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <user-connection-list
            ref="userConnectionList"
            @valueChanage="userConnectionSelectedValueChanage"
            @userIdValueChange="userIdSelectedValueChanage"
          />
          <div class="tip-id" v-show="false">
            <div><b>id:</b> {{ this.userConnectionSelected }}</div>
            <div><b>uid:</b> {{ this.userIdSelected }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <div>
          <el-tabs v-model="tabActiveName" type="border-card">
            <el-tab-pane v-if="1 == 2" name="dashboard" label="仪表板">
              <container-dashboard />
            </el-tab-pane>
            <el-tab-pane name="message" label="消息管理器">
              <container-message
                :userConnectionSelected="userConnectionSelected"
              />
            </el-tab-pane>
            <el-tab-pane name="filemanager" label="文件管理器"
              ><container-file
                :userConnectionSelected="userConnectionSelected"
              ></container-file>
            </el-tab-pane>
            <el-tab-pane name="location" label="位置" class="no-padding"
              ><container-location
                :userIdSelected="userIdSelected"
              ></container-location>
            </el-tab-pane>
            <el-tab-pane name="other" label="其他">
              <container-other
                :userConnectionSelected="userConnectionSelected"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
    
<script>
import UserConnectionList from "@/components/UserConnectionList";
import ContainerDashboard from "@/components/ContainerDashboard";
import ContainerMessage from "@/components/ContainerMessage";
import ContainerFile from "@/components/ContainerFile";
import ContainerLocation from "@/components/ContainerLocation";
import ContainerOther from "@/components/ContainerOther";
export default {
  name: "App",
  components: {
    UserConnectionList,
    ContainerDashboard,
    ContainerMessage,
    ContainerFile,
    ContainerLocation,
    ContainerOther,
  },
  data() {
    return {
      userConnectionSelected: [],
      userIdSelected: [],
      tabActiveName: "filemanager",
    };
  },
  mounted() {
    // this.$message("testtttttttttttttt");
  },
  created() {
    this.loadPageConfig();
  },
  methods: {
    test() {
      var ids = this.$refs.userConnectionList.getSelectIds();
      this.$message("ids:" + ids);
    },
    userConnectionSelectedValueChanage(widget, value) {
      this.userConnectionSelected = [];
      this.userConnectionSelected.push(...value);
    },
    userIdSelectedValueChanage(widget, value) {
      this.userIdSelected = [];
      this.userIdSelected.push(...value);
    },
    loadPageConfig() {
      this.$axios
        .get("/api/module/config/app/mtpServerPage")
        .then((res) => {
          this.loading = false;
          if (!res.data.success) {
            this.$message.warning(res.data.message);
            return false;
          }
          window.codefg = window.codefg || {};
          window.codefg.config = res.data.data;
        })
        .catch((e) => {
          console.warn(e);
          this.$message.warning(e.toString());
        });
    },
  },
};
</script>

<style>
.main-contianer {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.grid-content {
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
。no-padding {
  padding: 0;
}
.tip-id {
  color: rgb(226, 226, 226);
  font-size: 6px;
}
</style>
