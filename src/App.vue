<template lang="pug">
  v-app(dark  style="-webkit-app-region: drag")
    v-app-bar(app)
      v-toolbar-title.headline
        span Mockup 
        | {{'v'+packageVersion}}
      v-spacer
      v-btn(v-if="diffResult === true" text @click="openBrowser()")
        v-badge(overlap='', color='red' :overlap="false")
          template(v-slot:badge='')
            | New {{newVersion}}
          span.mr-2 Latest Release
          v-icon mdi-open-in-new
      v-btn(v-else)
          span.mr-2 github
          v-icon mdi-open-in-new
    v-content
      router-view
</template>　　 

<script lang="ts">
import fs from 'fs';
import {Component, Vue} from 'vue-property-decorator';
const shell = require('electron').shell;
@Component
  export default class ComponentName extends Vue {
    private newVersion = '';
    private packageVersion = '';
    
    private openBrowser() {
        shell.openExternalSync(
            'https://github.com/joon610/mock-server/releases',
        );
        return;
    }

    private created() {
      this.getNewRelease();
      this.getCurrentVersion();
    }

    private get diffResult() {
      if(this.newVersion === '') return false;
      if(this.packageVersion === '') return false;
      console.log('this.newVersion :', this.newVersion);
      console.log('this.packageVersion :', this.packageVersion);
      const githubVersionNum = Number(this.removeVersion(this.removePoint(this.newVersion)));
      const packageVersionNum = Number(this.removePoint(this.packageVersion));
      console.log('object :', githubVersionNum > packageVersionNum ? true:false);
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
