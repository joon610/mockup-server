<template lang="pug">
  v-container.screen-container
    .server-container
      v-row.row-height(no-gutters)
        v-col(cols="6" sm="6")
          v-text-field.text-container(v-model="rootPath" :solo="true" :flat="true" readonly)
        v-col(cols="4" sm="4")
          v-btn.setting-btn-width(color="light-green" :disabled="serverStatus" @click="initPath()") 
            v-icon fa-folder-open
            .button-name Select Root
        v-col(cols="2" sm="2")
          v-btn.setting-btns(color="warning" @click="refresh()")
            v-icon fa-sync-alt
      v-row.row-height(no-gutters)
        v-col(cols="3" sm="3")
            .loacalhost-label http://localhost:
        v-col(cols="3" sm="3")
            .loacalhost
              v-text-field.text-container(v-model="portNum" :solo="true" :readonly="isServerOn" :flat="true" style="hegiht:48px")
        v-col(cols="6" sm="6")
            v-btn.setting-btns(v-if="isServerOn === false"  color="#546E7A"   :disabled="hasApiList" @click="startServer()") 
              v-icon fa-circle-notch 
              .button-server Start Server
            v-btn.setting-btns(v-else color="#546E7A"  :disabled="hasApiList"  @click="closeServer()") 
              v-icon fa-circle-notch fa-spin
              .button-server Running Server
      v-row(no-gutters)
        v-col.api-list-outer(cols="12" sm="12")
          template(v-if="rootPath")
            v-api-list(v-model="serverStatus" :port="portNum" :isServerOn="isServerOn" style="width:100%" ) 
          template(v-else)
            .empty-container
              v-icon.empty-icon fa-folder-open
              .button-name Select Root Path
    .logger-div
      v-logger
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import FileTreeUtils from "@/utils/filetreeUtils";
import {STANDARD_PORT} from "@/const/mockConst";
import ApiList from "@/components/ApiList.vue";
import Logger from "@/components/Logger.vue";
import MockupServer from "@/utils/server/mockupServer";
import fs from 'fs';
@Component({
  components: {
    vApiList: ApiList,
    vLogger:Logger
  }
})
export default class MockServer extends Vue {
  private rootPath = "";
  private portNum = "";
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
    if (path?.filePaths!.length === 0) {
      return;
    }
    this.rootPath = path?.filePaths![0];
    this.readPort(this.rootPath);
    this.writePort(this.rootPath,this.portNum);
    this.makeFileTree();
  }

  private readPort(path:string) {
    const portPath = path+'/init.json';
    if (fs.existsSync(portPath)){
      const initJson = JSON.parse(fs.readFileSync(portPath,'utf8'));
      if(initJson?.serverPort){
        this.portNum = initJson.serverPort;
      }
    }else {
      this.portNum = STANDARD_PORT;
    }
  }

  private writePort(path:string,port:string){
    const portPath = path+'/init.json';
    this.portNum = port ==='' ? STANDARD_PORT:port;
    const initPort = {
      serverPort: this.portNum,
    };
    fs.writeFileSync(portPath,JSON.stringify(initPort,null,2),'utf8');
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
    this.writePort(this.rootPath,this.portNum);
    await this.makeFileTree();
    this.server = new MockupServer(this.portNum);
    this.isServerOn = await this.server.start();
  }

  private async closeServer(): Promise<void> {
    this.isServerOn = await this.server!.close();
    this.server = undefined;
    this.makeFileTree();
  }

  private refresh(){
    const electron = require("electron").remote;
    electron.getCurrentWindow().reload();
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
  width: 100%;
  height: 48px !important;
  text-transform: none;
  font-size: 18px;
}

.setting-btn-width {
  width: calc(100% - 5px);
  height: 48px !important;
  text-transform: none;
  font-size: 18px;
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
  height: 570px;
}

.api-list-outer {
  width: 100%;
  height: 500px;
  overflow-y:auto;
  overflow-x:hidden; 
  background: rgb(56, 56, 56);
  border-radius: 5px;
}

.empty-container {
  text-align: center;
  color:dimgray;
  top: calc(50% - 120px);
  position: relative;
}

.empty-icon {
  color: dimgray;
  font-size: 100px;
  top: calc(50% - 120px);
  position: relative;
}

.button-name {
  margin-left: 5px;
}
.button-server {
  margin-left: 5px;
  width: 150px;
}

::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

::-webkit-scrollbar {
    width: 10px;
}
 
::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;

}
</style>
