<template lang="pug">
  v-app(dark)
    v-app-bar(app style="-webkit-app-region: drag")
      v-toolbar-title.headline
        span Mockup-server 
        | {{'v'+packageVersion}}
      v-spacer
      v-btn.issue-button(v-if="diffResult === true"  style="-webkit-app-region: no-drag" color="deep-orange" @click="openBrowser()")
        span.mr-2 Release {{ newVersion }}
        v-icon fa-external-link-square-alt
      v-btn.issue-button(v-else  @click="openBugReport()" style="-webkit-app-region: no-drag")
        span.mr-2 Issues
        v-icon fa-external-link-square-alt
      v-btn.close-button(style="-webkit-app-region: no-drag" @click ="windowClose()")
        v-icon fa-times
    v-content
      router-view
</template>　　 

<style scoped>
.headline {
  margin-top: 20px;
}
.issue-button {
  background: black;
}
.close-button {
  min-width: 40px !important;
  padding: 0 !important;
  margin-left: 20px;
  background: black;
}
</style>

<script lang="ts">
import fs from 'fs';
import os from 'os';
import {Component, Vue} from 'vue-property-decorator';
const shell = require('electron').shell;
import {VERSION} from '@/const/mockConst';
@Component
  export default class ComponentName extends Vue {
      
    private newVersion = '';
    private packageVersion = VERSION;
    private isWindow = os.platform() === 'win32'? true : false;

    private openBrowser() {
        shell.openExternalSync(
            'https://github.com/joon610/mock-server/releases',
        );
        return;
    }

    private windowClose() {
       const remote = require('electron').remote;
       const window = remote.getCurrentWindow();
       window.close();
    }

    private openBugReport() {
        shell.openExternalSync(
            'https://github.com/joon610/mockup-server/issues',
        );
        return;
    }

    private created() {
      this.getNewRelease();
    }

    private get diffResult() {
      if(this.newVersion === '') return false;
      if(this.packageVersion === '') return false;
      const githubVersionNum = Number(this.removeVersion(this.removePoint(this.newVersion)));
      const packageVersionNum = Number(this.removePoint(this.packageVersion));
      return githubVersionNum > packageVersionNum ? true:false;
    }


    private async getNewRelease(){
      const url = "https://api.github.com/repos/joon610/mockup-server/releases/latest";
      const response = await this.axios.get(url);
      const data = response?.data?.name;
      this.newVersion = data;
    }

    private getCurrentVersion() {
      const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      this.packageVersion = json.version;
    }

    private removePoint = (value:string):string => (value.replace(/\./g ,''));
    private removeVersion = (value:string):string => (value.replace(/v/ ,''));
  
}
</script>
