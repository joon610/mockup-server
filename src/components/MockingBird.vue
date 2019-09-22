<template lang="pug">
  v-container
    v-layout(text-center='', wrap='')
      v-row.row-hegiht(no-gutters)
        .input-row
          v-text-field(v-model="rootPath" :solo="true" :flat="true" readonly)
        v-btn(color="#A5D6A7" @click="getPath()") Select Root
      v-row.row-hegiht(no-gutters)
        .input-row
          .loacalhost-label http://loacalhost:
          .loacalhost-input
            v-text-field(v-model="portNum" :solo="true" :readonly="isServerOn" :flat="true" style="hegiht:48px")
      v-row(no-gutters)
        MakeRestfull(:restfullList="restfullList" :rootPath="rootPath" :port="portNum" :isServerOn="isServerOn" style="width:100%" ) 
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FileTree from '../utils/filetree';
import MakeRestfull from './MakeRestfull.vue';
import { ApiInfo } from '../const/mockingBirdConst';
const fs = require('fs');
@Component({
  components: {
    MakeRestfull,
  },
})
export default class MockingBird extends Vue {
  private rootPath: string = '';
  private restfullList: ApiInfo[] = [];
  private portNum: string = '9000';


  private isServerOn: boolean = false;
  private hasRestfullList: boolean = true;

  private async getPath() {
    const electron = require('electron').remote;
    const dialog = electron.dialog;
    const path = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (path.filePaths!.length === 0) {
        console.log('empty path');
        return;
    }
    this.rootPath = path.filePaths![0];
    this.makeFileTree();
  }

  private makeFileTree() {
    const filetree = new FileTree(this.rootPath);
    filetree.build();
    this.restfullList = filetree.getRelativePath().map((api) => {
      try {
        const rawdata = fs.readFileSync(this.rootPath + api + '/index.json');
      } catch {
        const error = new ApiInfo();
        error.api = 'add index.json';
        error.isFail = true;
        return error;
      }
      const apiInfo = new ApiInfo();
      apiInfo.api = api;
      return apiInfo;
    });
  }
}
</script>

<style lang="css" scoped>

.rootPath {
  margin: 10px;
  border-radius: 3px;
  padding: 20px;
  background-color: #424242;
}
button {
  margin-left: 5px;
  width: 150px;
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

.row-hegiht {
  height: 48px;
  margin-bottom: 5px;
}
</style>

