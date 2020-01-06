<template lang="pug">
  v-app(dark  style="-webkit-app-region: drag")
    v-app-bar(app)
      v-toolbar-title.headline
        span Mockup-server 
        | {{'v'+packageVersion}}
      v-spacer
      v-btn(v-if="diffResult === true"  color="deep-orange" @click="openBrowser()")
        span.mr-2 Release {{ newVersion }}
        v-icon fa-external-link-square-alt
      v-btn(v-else  @click="openBugReport()")
          span.mr-2 Issues
          v-icon fa-external-link-square-alt
    v-content
      router-view
</template>　　 

<style scoped>
.headline {
  margin-top: 20px
}
</style>

<script lang="ts">
import fs from 'fs';
import {Component, Vue} from 'vue-property-decorator';
const shell = require('electron').shell;
import {VERSION} from '@/const/mockConst';
@Component
  export default class ComponentName extends Vue {
    private newVersion = '';
    private packageVersion = VERSION;
    
    private openBrowser() {
        shell.openExternalSync(
            'https://github.com/joon610/mock-server/releases',
        );
        return;
    }

    private openBugReport() {
        shell.openExternalSync(
            'https://github.com/joon610/mockup-server/issues',
        );
        return;
    }

    private created() {
      this.getNewRelease();
      // this.getCurrentVersion();
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
