<template lang="pug">
  v-container
    v-layout(text-center='', wrap='')
      v-row(no-gutters)
          v-text-field
            template(v-slot:label='')
              | Root Path
          v-btn(color="primary" @click="getPath()") Select Root
      v-row(no-gutters)
          v-text-field
            template(v-slot:label='')
              | http://localhost:
          v-btn(color="primary" :disabled="hasApiList" @click="startServer()") start Server
          v-btn(color="primary" :disabled="isServerOn" @click="closeServer()") close Server
      ApiList(:apiList="apiList")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VirtualServer from '../utils/virtualServer';
import FileTree from '../utils/filetree';
import ApiList from './ApiList.vue';
import { fips } from 'crypto';
import { setTimeout } from 'timers';

@Component({
  components: {
    ApiList,
  },
})
export default class Main extends Vue {

  private dirPath: string = '';
  private server!: VirtualServer;
  private apiList: string[] = [];

  private isServerOn: boolean = true;
  private hasApiList: boolean = true;

  private async getPath() {
    const electron = require('electron').remote;
    const dialog = electron.dialog;
    const path = await dialog.showOpenDialog({properties: ['openDirectory']});
    this.dirPath = path.filePaths![0];
    const filetree = new FileTree(this.dirPath);
    filetree.build();
    this.apiList = filetree.getRelativePath();
    if (this.apiList !== undefined) {
      this.hasApiList = false;
    }
  }

  private async startServer() {
    this.server = new VirtualServer(8001, this.apiList);
    this.isServerOn = await this.server.start();
  }

  private async closeServer() {
    this.isServerOn = await this.server.close();
  }

}

</script>

<style lang="css" scoped>
.rootPath {
  margin:10px;
  border-radius: 3px;
  padding: 20px;
  background-color: rgba(185, 224, 198,0.5);
}
button{
  margin: 5px;
}

</style>

