<template lang="pug">
    .api-list-container
        .api-container(v-for="api in apiList" )
            a(@click="openBrowser(api)" :style="apiContainerStyle")
                .http-method(:style="httpMethodStyle")
                    | GET
                .api-path(:style="apiPathStyle")
                    | {{ api }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
const shell = require('electron').shell;
@Component
export default class ApiList extends Vue {
  @Prop() private apiList!: string[];
  @Prop(String) private port!: string;
  @Prop(Boolean) private isServerOn!: boolean;

  private httpMethodStyle = {
    color: 'dimgray',
  };

  private apiPathStyle = {
    color: 'dimgray',
  };

  private apiContainerStyle = {
    cursor: 'default',
  };

  private openBrowser(api: string) {
    console.log('http://localhost:' + this.port + api);
    shell.openExternalSync('http://localhost:' + this.port + api);
  }

  @Watch('isServerOn')
  private watchServer() {
    if (this.isServerOn) {
      this.httpMethodStyle.color = 'darkorange';
      this.apiPathStyle.color = 'white';
      this.apiContainerStyle.cursor = 'pointer';
    } else {
      this.httpMethodStyle.color = 'dimgray';
      this.apiPathStyle.color = 'gray';
      this.apiContainerStyle.cursor = 'default';
    }
  }
}
</script>

<style scoped>
.api-container {
  background-color: #424242;
  border-radius: 5px;
  margin-bottom: 5px;
  justify-content: center;
  vertical-align: middle;
  height: 50px;
}
.api-container:hover {
  background-color: rgb(90, 90, 90);
  cursor: default;
}

.api-list-container {
  margin: 10px;
  width: 340px;
}
.api-path {
  width: 340px;
  float: left;
  line-height: 50px;
  text-align: left;
  margin-left: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.http-method {
  line-height: 50px;
  width: 50px;
  float: left;
}
</style>
