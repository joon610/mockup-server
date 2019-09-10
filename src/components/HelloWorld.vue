<template lang="pug">
  v-container
    v-layout(text-center='', wrap='')
      v-flex(xs12)
        v-btn(color="primary" @click="getPath()") Select Root
      v-flex(xs12)
        .rootPath 
          div
            | {{ dirPath }}
          div
            v-btn(color="primary" @click="startServer()") start Server
            v-btn(color="primary" @click="closeServer()") close Server
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VirtualServer from '../utils/virtualServer';
@Component
export default class HelloWorld extends Vue {

  private dirPath: string = '';
  private server!: VirtualServer;

  private async getPath() {
    const electron = require('electron').remote;
    const dialog = electron.dialog;
    const path = await dialog.showOpenDialog({properties: ['openDirectory']});
    this.dirPath = path.filePaths![0];
    }

  private async startServer() {
    this.server = await new VirtualServer(8000);
    this.server.start();
  }

  private async closeServer() {
    if (this.server === undefined) {
        return;
    }
    await this.server.close();
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

</style>

