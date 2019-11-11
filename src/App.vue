<template lang="pug">
  v-app(dark)
    v-app-bar(app)
      v-toolbar-title.headline.text-uppercase
        span Mockup Server
      v-spacer
      v-btn(text @click="openBrowser()")
        span.mr-2 Latest Release
        v-icon mdi-open-in-new
    v-content
      router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
const shell = require('electron').shell;
@Component
export default class ComponentName extends Vue {

    private openBrowser() {
      shell.openExternalSync('https://github.com/joon610/mock-server/releases');
    }

}
</script>
