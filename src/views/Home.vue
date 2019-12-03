<template lang="pug">
  v-container
      v-row.row-height(no-gutters)
        v-col(cols="8" sm="8")
          v-text-field(v-model="rootPath" :solo="true" :flat="true" readonly)
        v-col(cols="4" sm="4")
          v-btn(color="#A5D6A7" :disabled="serverStatus" @click="initPath()") Select Root
      v-row.row-height(no-gutters)
        v-col(cols="4" sm="4")
            .loacalhost-label http://localhost:
        v-col(cols="4" sm="4")
            .loacalhost
              v-text-field(v-model="portNum" :solo="true" :readonly="isServerOn" :flat="true" style="hegiht:48px")
        v-col(cols="4" sm="4")
            v-btn(v-if="isServerOn === false" color="primary"   :disabled="hasApiList" @click="startServer()") start Server
            v-btn(v-else color="deep-orange" :disabled="hasApiList" @click="closeServer()") close Server
      v-row(no-gutters)
        v-api-list(v-model="serverStatus" :port="portNum" :isServerOn="isServerOn" style="width:100%" ) 
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FileTreeUtils from "@/utils/filetreeUtils";
import { STANDARD_PORT } from "@/const/mockConst";
import ApiList from "@/components/ApiList.vue";
import MockupServer from "@/utils/server/mockupServer";
@Component({
  components: {
    vApiList: ApiList
  }
})
export default class MockServer extends Vue {
  private rootPath = "";
  private portNum = STANDARD_PORT;
  private serverStatus = false;
  private isServerOn = false;
  private hasRestfullList = true;

  private server!: MockupServer | undefined;

  private async initPath(): Promise<void> {
    const electron = require("electron").remote;
    const dialog = electron.dialog;
    const path = await dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (path.filePaths!.length === 0) {
      return;
    }
    this.rootPath = path.filePaths![0];
    this.makeFileTree();
  }

  private makeFileTree(): void {
    const filetree = new FileTreeUtils();
    filetree.getInstance().build(this.rootPath);
    this.$store.state.apiInfoList = filetree.getInstance().getApiInfoList()!;
  }

  private get hasApiList(): boolean {
    return this.$store.getters.apiInfoList.length === 0 ? true : false;
  }

  private async startServer(): Promise<void> {
    this.server = new MockupServer(this, this.portNum);
    this.isServerOn = await this.server.start();
  }

  private async closeServer(): Promise<void> {
    this.isServerOn = await this.server!.close();
    this.server = undefined;
    this.makeFileTree();
  }
}
</script>

<style lang="css" scoped>
.select-root-container {
  display: flex;
}

.rootPath {
  margin: 10px;
  border-radius: 3px;
  padding: 20px;
  background-color: #424242;
}
button {
  margin-left: 5px;
  width: 165px;
  height: 48px !important;
}

.loacalhost-label {
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  width: 40px;
  text-align: right;
  margin-right: 0px;
  float: left;
}

.loacalhost-input {
  float: right;
  width: 200px;
}

.input-row {
  width: 340px;
}

.row-height {
  height: 48px;
  margin-bottom: 5px;
}

.server-on-container {
  height: 48px;
  margin-bottom: 5px;
  width: 510px;
  display: flex;
}

.server-btn {
  margin-bottom: 10px;
  float: left;
  width: max-content;
  display: flex;
}
</style>
