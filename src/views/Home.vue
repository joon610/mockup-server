<template lang="pug">
  v-container.screen-container
    .server-container
      v-row.row-height(no-gutters)
        v-col(cols="8" sm="8")
          v-text-field.text-container(v-model="rootPath" :solo="true" :flat="true" readonly)
        v-col(cols="4" sm="4")
          v-btn.setting-btns(color="#A5D6A7" :disabled="serverStatus" @click="initPath()") Select Root
      v-row.row-height(no-gutters)
        v-col(cols="4" sm="4")
            .loacalhost-label http://localhost:
        v-col(cols="4" sm="4")
            .loacalhost
              v-text-field.text-container(v-model="portNum" :solo="true" :readonly="isServerOn" :flat="true" style="hegiht:48px")
        v-col(cols="4" sm="4")
            v-btn.setting-btns(v-if="isServerOn === false" color="primary"   :disabled="hasApiList" @click="startServer()") start Server
            v-btn.setting-btns(v-else color="deep-orange" :disabled="hasApiList" @click="closeServer()") close Server
      v-row(no-gutters)
        v-col.api-list-outer(cols="12" sm="12")
          v-api-list(v-model="serverStatus" :port="portNum" :isServerOn="isServerOn" style="width:100%" ) 
    .logger-container
      v-logger
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import FileTreeUtils from "@/utils/filetreeUtils";
import {STANDARD_PORT} from "@/const/mockConst";
import ApiList from "@/components/ApiList.vue";
import Logger from "@/components/Logger.vue";
import MockupServer from "@/utils/server/mockupServer";
@Component({
  components: {
    vApiList: ApiList,
    vLogger:Logger
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
    this.$store.state.apiInfoList = filetree.getInstance().getApiInfoList();
    this.$store.state.rootPath = this.rootPath;
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

.setting-btns {
  width: 100%
}

.logger-container {
  width: 300px;
  height: 610px;
  margin: 0px 0px 5px 10px;
  padding: 5px;
  background: rgb(56, 56, 56);
}

.server-container {
  width: 610px;
  height: 620px;
}

.text-container {
  margin-right: 5px !important;
  margin-top: 0px !important;
}

.screen-container {
  display: flex;
  height: fit-content;
}
.api-list-outer {
  width: 100%;
  /* height: 100%; */
  overflow-y:auto;
  background: rgb(56, 56, 56);
}

.api-list-outer::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

.api-list-outer::-webkit-scrollbar {
    width: 18px;
}
 
.api-list-outer::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;

}
</style>
