<template lang="pug">
  v-container
    v-layout(text-center='', wrap='')
      v-row.row-height(no-gutters)
        .input-row
          v-text-field(v-model="rootPath" :solo="true" :flat="true" readonly)
        .test
          v-btn(color="#A5D6A7" :disabled="serverStatus" @click="getPath()") Select Root
      v-row(no-gutters)
        MakeRestful(v-model="serverStatus" :restfullList="restfullList" :rootPath="rootPath" :port="portNum" :isServerOn="isServerOn" style="width:100%" ) 
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FileTreeUtils from '../utils/filetreeUtils';
import MakeRestful from './MakeRestful.vue';
import { ApiInfo } from '../const/mockServerConst';
const fs = require('fs');
@Component({
  components: {
    MakeRestful,
  },
})
export default class MockServer extends Vue {
  private rootPath: string = '';
  private restfullList: ApiInfo[] = Array<ApiInfo>();
  private portNum: string = '9000';

  private serverStatus: boolean = false;
  private isServerOn: boolean = false;
  private hasRestfullList: boolean = true;

  private async getPath() {
    const electron = require('electron').remote;
    const dialog = electron.dialog;
    const path = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (path.filePaths!.length === 0) {
        return;
    }
    this.rootPath = path.filePaths![0];
    this.makeFileTree();
  }

  private makeFileTree() {
    const filetree = new FileTreeUtils(this.rootPath);
    this.restfullList = filetree.getRelativePath();
  }
}
</script>

<style lang="css" scoped>
.test{
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
</style>

